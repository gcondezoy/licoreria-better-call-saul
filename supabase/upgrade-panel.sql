-- =====================================================================
-- Migración: Panel avanzado — modelo "confirmar para vender"
-- Ejecutar en Supabase -> SQL Editor -> pegar todo -> Run. Es idempotente
-- (reemplaza las funciones; puedes re-ejecutarla sin problema).
--
-- Modelo:
--  * Crear pedido = SOLICITUD (pendiente): NO toca stock ni cuenta como venta.
--  * Confirmar/Entregar: descuenta stock (valida disponibilidad) = venta real.
--  * Cancelar un pedido ya confirmado: DEVUELVE el stock.
-- =====================================================================

-- 1) Costo del producto (para margen/utilidad).
alter table products add column if not exists cost numeric(10,2) not null default 0;

-- 2) ¿Ya se descontó el stock de este pedido? (para no descontar/devolver doble).
alter table orders add column if not exists stock_applied boolean not null default false;

-- 3) Crear pedido = solicitud. Calcula el total en el SERVIDOR (precios reales).
--    NO toca stock: un pedido pendiente es solo un lead.
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

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest((v_item->>'quantity')::int, 1);
    select * into v_product from products where id = (v_item->>'id')::uuid;
    if not found then
      raise exception 'Producto no encontrado';
    end if;
    v_total := v_total + v_product.price * v_qty;
  end loop;

  insert into orders (id, customer_name, customer_phone, delivery_address, notes, total, status, stock_applied)
  values (
    v_order_id, p_customer->>'name', p_customer->>'phone', p_customer->>'address',
    p_notes, v_total, 'pendiente', false
  );

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest((v_item->>'quantity')::int, 1);
    select * into v_product from products where id = (v_item->>'id')::uuid;
    insert into order_items (order_id, product_id, product_name, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_qty);
  end loop;

  return v_order_id;
end;
$$;

grant execute on function place_order(jsonb, jsonb, text) to anon, authenticated;

-- 4) Cambiar estado con manejo de stock atómico e idempotente.
--    Confirmado/Entregado => descuenta stock (una sola vez).
--    Pendiente/Cancelado  => si ya se había descontado, lo devuelve.
create or replace function set_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_committed boolean;
  v_item order_items%rowtype;
  v_stock int;
begin
  if p_status not in ('pendiente','confirmado','entregado','cancelado') then
    raise exception 'Estado inválido: %', p_status;
  end if;

  select * into v_order from orders where id = p_order_id;
  if not found then
    raise exception 'Pedido no encontrado';
  end if;

  v_committed := p_status in ('confirmado','entregado');

  if v_committed and not v_order.stock_applied then
    -- Validar stock disponible antes de descontar.
    for v_item in select * from order_items where order_id = p_order_id loop
      if v_item.product_id is not null then
        select stock into v_stock from products where id = v_item.product_id;
        if v_stock is not null and v_stock < v_item.quantity then
          raise exception 'Stock insuficiente para %', v_item.product_name;
        end if;
      end if;
    end loop;
    -- Descontar.
    for v_item in select * from order_items where order_id = p_order_id loop
      if v_item.product_id is not null then
        update products set stock = stock - v_item.quantity where id = v_item.product_id;
      end if;
    end loop;
    update orders set status = p_status, stock_applied = true where id = p_order_id;

  elsif (not v_committed) and v_order.stock_applied then
    -- Devolver stock.
    for v_item in select * from order_items where order_id = p_order_id loop
      if v_item.product_id is not null then
        update products set stock = stock + v_item.quantity where id = v_item.product_id;
      end if;
    end loop;
    update orders set status = p_status, stock_applied = false where id = p_order_id;

  else
    update orders set status = p_status where id = p_order_id;
  end if;
end;
$$;

grant execute on function set_order_status(uuid, text) to authenticated;
