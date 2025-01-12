import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateCompanyRequest {
  companyName: string;
  adminEmail: string;
  adminName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting create-company function')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyName, adminEmail, adminName }: CreateCompanyRequest = await req.json()
    console.log('Request data:', { companyName, adminEmail, adminName })

    // Primeiro, verificar se o usuário já existe
    const { data: existingUsers, error: userCheckError } = await supabaseClient.auth.admin.listUsers()
    
    if (userCheckError) {
      console.error('Error checking existing users:', userCheckError)
      throw new Error('Erro ao verificar usuários existentes')
    }

    const userExists = existingUsers.users.some(user => user.email === adminEmail)
    
    if (userExists) {
      console.log('User already exists:', adminEmail)
      return new Response(
        JSON.stringify({ 
          error: "Este email já está cadastrado. Por favor, use outro email ou entre em contato com o suporte." 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Gerar senha temporária
    const temporaryPassword = Math.random().toString(36).slice(-8)
    console.log('Generated temporary password')

    // Criar o usuário admin
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: adminEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      throw new Error(`Erro ao criar usuário: ${authError.message}`)
    }

    console.log('User created successfully')

    // Criar empresa e configurar admin
    const { data: companyData, error: companyError } = await supabaseClient
      .rpc('create_company_with_admin', {
        company_name: companyName,
        admin_email: adminEmail,
        admin_full_name: adminName
      })

    if (companyError) {
      console.error('Error creating company:', companyError)
      throw new Error(`Erro ao criar empresa: ${companyError.message}`)
    }

    console.log('Company created successfully:', companyData)

    // Enviar email de boas-vindas
    const { error: emailError } = await supabaseClient.functions.invoke('send-welcome-email', {
      body: {
        to: adminEmail,
        temporaryPassword,
        adminName,
        companyName
      }
    })

    if (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Não vamos lançar erro aqui, pois a empresa já foi criada
      console.log('Company creation successful but welcome email failed')
    } else {
      console.log('Welcome email sent successfully')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Empresa e administrador criados com sucesso',
        companyId: companyData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-company function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno ao criar empresa'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})