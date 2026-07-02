-- =====================================================================
-- Migración: Panel avanzado (Fase 1)
-- Ejecutar en Supabase -> SQL Editor -> pegar todo -> Run. Es idempotente.
-- Agrega: costo por producto (para margen) + creación de pedido ATÓMICA
-- que descuenta stock en una sola transacción, validando disponibilidad.
-- =====================================================================

-- 1) Costo del producto (para calcular margen/utilidad).
alter table products add column if not exists cost numeric(10,2) not null default 0;

-- 2) Creación de pedido atómica.
--    - Calcula el total en el SERVIDOR (no confía en el precio/total del cliente).
--    - Valida stock disponible y lo descuenta.
--    - Todo en una transacción: o entra completo, o no entra nada.
--    - SECURITY DEFINER: permite descontar stock aunque quien pide sea anónimo
--      (por RLS el anónimo no puede modificar products directamente).
create or replace function place_order(
  p_customer jsonb,
  p_items jsonb,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty int;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido no tiene productos';
  end if;

  -- Validación previa: existencia y stock suficiente + cálculo del total.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest((v_item->>'quantity')::int, 1);
    select * into v_product from products where id = (v_item->>'id')::uuid;
    if not found then
      raise exception 'Producto no encontrado';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Stock insuficiente para %', v_product.name;
    end if;
    v_total := v_total + v_product.price * v_qty;
  end loop;

  insert into orders (id, customer_name, customer_phone, delivery_address, notes, total, status)
  values (
    v_order_id,
    p_customer->>'name',
    p_customer->>'phone',
    p_customer->>'address',
    p_notes,
    v_total,
    'pendiente'
  );

  -- Inserta ítems y descuenta stock.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest((v_item->>'quantity')::int, 1);
    select * into v_product from products where id = (v_item->>'id')::uuid;
    insert into order_items (order_id, product_id, product_name, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_qty);
    update products set stock = stock - v_qty where id = v_product.id;
  end loop;

  return v_order_id;
end;
$$;

grant execute on function place_order(jsonb, jsonb, text) to anon, authenticated;
