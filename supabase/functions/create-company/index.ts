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
  cnpj?: string;
  address?: string;
  location?: string;
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

    const { companyName, adminEmail, adminName, cnpj, address, location }: CreateCompanyRequest = await req.json()
    console.log('Request data:', { companyName, adminEmail, adminName, cnpj, address, location })

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

    // Criar empresa com os dados adicionais
    const { data: companyData, error: companyError } = await supabaseClient
      .rpc('create_company_with_admin', {
        company_name: companyName,
        admin_email: adminEmail,
        admin_name: adminName,
        company_cnpj: cnpj,
        company_address: address,
        company_location: location
      })

    if (companyError) {
      console.error('Error creating company:', companyError)
      throw new Error(`Erro ao criar empresa: ${companyError.message}`)
    }

    console.log('Company created successfully:', companyData)

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