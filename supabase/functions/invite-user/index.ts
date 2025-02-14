import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

interface InviteUserRequest {
  email: string
  fullName: string
  role: 'admin' | 'common' | 'visitor'
  companyId?: string
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

// Função para aguardar a deleção do usuário
const waitForUserDeletion = async (userId: string, maxAttempts = 5) => {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: users } = await supabaseClient.auth.admin.listUsers()
    const userExists = users?.users.some(u => u.id === userId)
    if (!userExists) {
      console.log('Usuário deletado com sucesso')
      return true
    }
    console.log('Aguardando deleção do usuário, tentativa:', i + 1)
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2 segundos
  }
  throw new Error('Timeout waiting for user deletion')
}

const inviteUser = async ({ email, fullName, role, companyId }: InviteUserRequest) => {
  try {
    console.log('Iniciando processo de convite para:', email)

    // Verificar usuários existentes no auth
    const { data: existingUsers, error: searchError } = await supabaseClient.auth.admin.listUsers()
    if (searchError) {
      console.error('Erro ao buscar usuários:', searchError)
      throw searchError
    }

    const existingUser = existingUsers?.users.find(user => user.email === email)
    if (existingUser) {
      console.log('Encontrado usuário no auth:', existingUser)
      // Limpar usuário existente
      await supabaseClient.from('user_roles').delete().eq('user_id', existingUser.id)
      await supabaseClient.from('profiles').delete().eq('id', existingUser.id)
      await supabaseClient.auth.admin.deleteUser(existingUser.id)
      console.log('Aguardando confirmação da deleção do usuário')
      await waitForUserDeletion(existingUser.id)
    }

    // Aguardar um pouco mais antes de criar o novo usuário
    await new Promise(resolve => setTimeout(resolve, 3000)) // 3 segundos

    console.log('Criando convite para:', email)
    const { data: inviteData, error: inviteError } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
      },
      options: {
        redirectTo: `${Deno.env.get('PUBLIC_SITE_URL')}/set-initial-password`,
      }
    })

    if (inviteError) {
      if (inviteError.message.includes('rate limit')) {
        console.error('Rate limit atingido, aguarde alguns minutos antes de tentar novamente')
        return new Response(
          JSON.stringify({ error: 'Por favor, aguarde alguns minutos antes de tentar novamente' }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            status: 429 // Too Many Requests
          }
        )
      }
      console.error('Error inviting user:', inviteError)
      throw inviteError
    }

    if (inviteData?.user) {
      try {
        console.log('Novo usuário criado:', inviteData.user)

        // Aguardar um momento para o perfil ser criado pelo trigger
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Atualizar o perfil existente em vez de criar um novo
        console.log('Atualizando perfil para:', inviteData.user.id)
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .update({
            full_name: fullName,
            company_id: companyId
          })
          .eq('id', inviteData.user.id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
          await supabaseClient.auth.admin.deleteUser(inviteData.user.id)
          throw profileError
        }

        console.log('Perfil atualizado com sucesso')

        // Verificar e remover roles existentes
        console.log('Verificando roles existentes para:', inviteData.user.id)
        const { error: deleteRoleError } = await supabaseClient
          .from('user_roles')
          .delete()
          .eq('user_id', inviteData.user.id)

        if (deleteRoleError) {
          console.error('Erro ao remover roles existentes:', deleteRoleError)
        }

        // Aguardar um momento para a deleção ser processada
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('Criando nova role para:', inviteData.user.id)
        const { error: roleError } = await supabaseClient
          .from('user_roles')
          .insert({
            user_id: inviteData.user.id,
            role: role
          })

        if (roleError) {
          console.error('Error setting user role:', roleError)
          await supabaseClient.from('profiles').delete().eq('id', inviteData.user.id)
          await supabaseClient.auth.admin.deleteUser(inviteData.user.id)
          throw roleError
        }

        // Enviar email de boas-vindas
        try {
          if (!RESEND_API_KEY) {
            console.log('RESEND_API_KEY não configurada, pulando envio de email')
          } else {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'AgroMetric <onboarding@resend.dev>',
                to: email,
                subject: 'Bem-vindo ao AgroMetric - Configure sua conta',
                html: `
                  <h1>Bem-vindo ao AgroMetric!</h1>
                  <p>Olá ${fullName},</p>
                  <p>Sua conta foi criada com sucesso. Para começar a usar o sistema, você precisa configurar sua senha.</p>
                  <p>Você receberá um email separado com um link para definir sua senha.</p>
                  <p>Por favor, siga as instruções nesse email para completar a configuração da sua conta.</p>
                  <p>Atenciosamente,<br>Equipe AgroMetric</p>
                `
              })
            })
            console.log('Email de boas-vindas enviado com sucesso')
          }
        } catch (emailError) {
          console.error('Erro ao enviar email de boas-vindas:', emailError)
          // Não falhar a função se apenas o email falhar
        }

        return new Response(
          JSON.stringify({ message: 'User invited successfully' }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            status: 200
          }
        )
      } catch (error) {
        console.error('Error in user creation process:', error)
        if (inviteData?.user?.id) {
          await supabaseClient.auth.admin.deleteUser(inviteData.user.id)
        }
        throw error
      }
    }

  } catch (error) {
    console.error('Error in invite-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 400
      }
    )
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, fullName, role, companyId } = await req.json()

    if (!email || !fullName || !role) {
      throw new Error('Missing required fields')
    }

    return await inviteUser({ email, fullName, role, companyId })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
