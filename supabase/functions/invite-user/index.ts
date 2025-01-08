import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteUserRequest {
  email: string;
  fullName: string;
  role: 'common' | 'visitor';
  companyId: string;
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

    // Create user without password
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })

    if (userError) throw userError

    // Create profile with company association
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: fullName,
        company_id: companyId
      })

    if (profileError) throw profileError

    // Set user role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role
      })

    if (roleError) throw roleError

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: email
    })

    if (resetError) throw resetError

    // Send invitation email with password reset link
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY')
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'AgroMetric <no-reply@agrometric.com.br>',
        to: [email],
        subject: 'Convite para o AgroMetric',
        html: `
          <h1>Bem-vindo ao AgroMetric!</h1>
          <p>Olá ${fullName},</p>
          <p>Você foi convidado para acessar o AgroMetric.</p>
          <p>Por favor, clique no link abaixo para definir sua senha:</p>
          <p><a href="${resetData.properties.action_link}">Definir senha</a></p>
          <p>Atenciosamente,<br>Equipe AgroMetric</p>
        `,
      }),
    })

    const emailData = await res.json()

    return new Response(
      JSON.stringify({ message: 'User invited successfully' }),
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