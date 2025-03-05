import { supabase as supabaseClient } from "../../../src/integrations/supabase/client"
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

const createCompany = async ({
  companyName,
  adminEmail,
  adminName,
  cnpj,
  address,
  location
}: CreateCompanyRequest) => {
  try {

    // First, verify if the user already exists
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

    // Create company with the data
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
}

export default createCompany
