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

    // First check if user already exists
    const { data: existingUser } = await supabaseClient.auth.admin.listUsers()
    const userExists = existingUser?.users.some(user => user.email === adminEmail)
    
    if (userExists) {
      return new Response(
        JSON.stringify({ 
          error: "Um usuário com este email já está registrado. Por favor, use um email diferente." 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // 1. Create company first
    const { data: companyData, error: companyError } = await supabaseClient
      .from('companies')
      .insert({ name: companyName })
      .select()
      .single()

    if (companyError) throw companyError

    // 2. Create auth user with temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8)
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email: adminEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (userError) {
      // If user creation fails, delete the company
      await supabaseClient
        .from('companies')
        .delete()
        .eq('id', companyData.id)
      throw userError
    }

    // 3. Create profile with company association
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: adminName,
        company_id: companyData.id
      })

    if (profileError) {
      // If profile creation fails, clean up user and company
      await supabaseClient.auth.admin.deleteUser(userData.user.id)
      await supabaseClient
        .from('companies')
        .delete()
        .eq('id', companyData.id)
      throw profileError
    }

    // 4. Set user role as admin
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin'
      })

    if (roleError) {
      // If role assignment fails, clean up everything
      await supabaseClient.auth.admin.deleteUser(userData.user.id)
      await supabaseClient
        .from('companies')
        .delete()
        .eq('id', companyData.id)
      throw roleError
    }

    // 5. Send welcome email with temporary password
    const { error: emailError } = await supabaseClient.functions.invoke('send-welcome-email', {
      body: {
        to: adminEmail,
        temporaryPassword,
        adminName,
        companyName
      }
    })

    if (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't throw here as the core functionality is complete
    }

    return new Response(
      JSON.stringify({ 
        message: 'Company and admin created successfully',
        companyId: companyData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-company function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})