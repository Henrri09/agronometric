import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteUserRequest {
  email: string;
  fullName: string;
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

    const { email, fullName }: InviteUserRequest = await req.json()

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin
      .generateLink({
        type: 'recovery',
        email: email,
      })

    if (resetError) throw resetError

    // Send invitation email using Resend
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
        subject: 'Bem-vindo ao AgroMetric - Configure sua senha',
        html: `
          <h1>Bem-vindo ao AgroMetric!</h1>
          <p>Olá ${fullName},</p>
          <p>Uma conta foi criada para você no AgroMetric.</p>
          <p>Por favor, clique no link abaixo para definir sua senha:</p>
          <p><a href="${resetData.properties.action_link}">Definir senha</a></p>
          <p>Se você não solicitou esta conta, por favor ignore este email.</p>
          <p>Atenciosamente,<br>Equipe AgroMetric</p>
        `,
      }),
    })

    const emailData = await res.json()

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
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