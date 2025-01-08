import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailRequest {
  to: string
  temporaryPassword: string
  adminName: string
  companyName: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, temporaryPassword, adminName, companyName }: WelcomeEmailRequest = await req.json()

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
        to: [to],
        subject: 'Bem-vindo ao AgroMetric - Suas Credenciais de Acesso',
        html: `
          <h1>Bem-vindo ao AgroMetric!</h1>
          <p>Olá ${adminName},</p>
          <p>Sua empresa ${companyName} foi cadastrada com sucesso no AgroMetric.</p>
          <p>Aqui estão suas credenciais temporárias de acesso:</p>
          <ul>
            <li>Email: ${to}</li>
            <li>Senha temporária: ${temporaryPassword}</li>
          </ul>
          <p>Por favor, faça login e altere sua senha imediatamente.</p>
          <p>Atenciosamente,<br>Equipe AgroMetric</p>
        `,
      }),
    })

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
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