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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyName, adminEmail, adminName }: CreateCompanyRequest = await req.json()

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8)

    // Create the admin user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: adminEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (authError) throw authError

    // Create company and set up admin
    const { data: companyData, error: companyError } = await supabaseClient
      .rpc('create_company_with_admin', {
        company_name: companyName,
        admin_email: adminEmail,
        admin_full_name: adminName
      })

    if (companyError) throw companyError

    // Send welcome email with temporary password
    const { error: emailError } = await supabaseClient.functions.invoke('send-welcome-email', {
      body: {
        to: adminEmail,
        temporaryPassword,
        adminName,
        companyName
      }
    })

    if (emailError) throw emailError

    return new Response(
      JSON.stringify({ message: 'Company and admin created successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

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