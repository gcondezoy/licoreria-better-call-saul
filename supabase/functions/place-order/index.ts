// Supabase Edge Function: crea un pedido SOLO si pasa la verificación anti-bot
// de Cloudflare Turnstile. Así el checkout queda blindado contra spam de bots.
//
// Desplegar:
//   supabase functions deploy place-order --no-verify-jwt
// Secreto necesario:
//   supabase secrets set TURNSTILE_SECRET=xxxxx
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automáticamente)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { customer, items, notes, captchaToken } = await req.json()

    if (!customer || !Array.isArray(items) || items.length === 0) {
      return json({ error: 'Pedido inválido' }, 400)
    }

    // 1) Verificar el token de Turnstile con Cloudflare.
    const secret = Deno.env.get('TURNSTILE_SECRET')
    if (secret) {
      const form = new FormData()
      form.append('secret', secret)
      form.append('response', captchaToken ?? '')
      const verify = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        { method: 'POST', body: form },
      )
      const outcome = await verify.json()
      if (!outcome.success) {
        return json({ error: 'No pudimos verificar que no eres un bot. Reintenta.' }, 403)
      }
    }

    // 2) Crear el pedido con el service role (llama al RPC place_order).
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data, error } = await supabase.rpc('place_order', {
      p_customer: customer,
      p_items: items,
      p_notes: notes ?? null,
    })
    if (error) return json({ error: error.message }, 400)

    return json({ id: data }, 200)
  } catch (e) {
    return json({ error: (e as Error).message || 'Error inesperado' }, 400)
  }
})
