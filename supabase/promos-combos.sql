-- =====================================================================
-- Migración: Promociones y Combos
-- Ejecutar en Supabase -> SQL Editor -> Run. Idempotente.
-- =====================================================================

-- Precio "antes" (de referencia). Si es mayor al precio actual => está en OFERTA.
alter table products add column if not exists compare_at_price numeric(10,2);

-- Marca un producto como COMBO (paquete armado por el dueño).
alter table products add column if not exists is_combo boolean not null default false;

-- Contenido del combo en texto (ej. "1 Ron Cartavio, 2 Coca-Cola 1.5L, Hielo").
alter table products add column if not exists combo_items text;
