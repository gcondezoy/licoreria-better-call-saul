-- =====================================================================
-- Cerrar el camino directo de creación de pedidos.
-- EJECUTAR SOLO DESPUÉS de desplegar la Edge Function `place-order`
-- y de haber configurado el CAPTCHA (VITE_TURNSTILE_SITE_KEY).
--
-- Con esto, los pedidos SOLO se pueden crear a través de la Edge Function
-- (que verifica el CAPTCHA con service role). Un bot que llame al RPC directo
-- con la llave anónima recibirá "permission denied".
-- =====================================================================

revoke execute on function place_order(jsonb, jsonb, text) from public, anon;

-- Nota: la Edge Function usa el service role (que conserva el permiso), así que
-- sigue funcionando. Si algún día quieres volver al modo sin CAPTCHA, re-otorga:
--   grant execute on function place_order(jsonb, jsonb, text) to anon;
