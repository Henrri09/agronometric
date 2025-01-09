import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteUserRequest {
  email: string
  fullName: string
  role: 'admin' | 'common' | 'visitor'
  companyId?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, fullName, role, companyId }: InviteUserRequest = await req.json()

    // Primeiro, verificar se o usuário já existe
    const { data: existingUser } = await supabaseClient.auth.admin.listUsers()
    const userExists = existingUser?.users.find(user => user.email === email)

    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'Usuário já existe' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Enviar convite para o usuário
    const { data: inviteData, error: inviteError } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
      },
    })

    if (inviteError) throw inviteError

    if (inviteData) {
      // Criar perfil com associação à empresa
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: inviteData.user.id,
          full_name: fullName,
          company_id: companyId
        })

      if (profileError) throw profileError

      // Definir função do usuário
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: inviteData.user.id,
          role: role
        })

      if (roleError) throw roleError

      // Enviar email personalizado de boas-vindas
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
      if (!RESEND_API_KEY) {
        throw new Error('Missing RESEND_API_KEY')
      }

      const res = await fetch('https://api.resend.com/emails', {
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

      const emailData = await res.json()
      console.log('Email enviado:', emailData)

      return new Response(
        JSON.stringify({ message: 'User invited successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('Error in invite-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})