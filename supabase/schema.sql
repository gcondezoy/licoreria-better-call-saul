-- =====================================================================
-- Licorería · Esquema de base de datos para Supabase
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New query -> pegar todo -> Run
-- Es idempotente: puedes ejecutarlo más de una vez sin romper nada.
-- =====================================================================

-- ------------------------- TABLAS -------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text default '#c8962c',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null default 0,
  stock int not null default 0,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  image_url text,
  volume_ml int,
  abv numeric(4,1),
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  status text not null default 'pendiente'
    check (status in ('pendiente','confirmado','entregado','cancelado')),
  total numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null default 1
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_order_items_order on order_items(order_id);

-- ------------------------- ROW LEVEL SECURITY -------------------------

alter table categories  enable row level security;
alter table brands      enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Lectura pública del catálogo
drop policy if exists "public read categories" on categories;
drop policy if exists "public read brands" on brands;
drop policy if exists "public read products" on products;
create policy "public read categories" on categories for select using (true);
create policy "public read brands"     on brands     for select using (true);
create policy "public read products"   on products   for select using (true);

-- Solo usuarios autenticados (admin) pueden modificar el catálogo
drop policy if exists "admin write categories" on categories;
drop policy if exists "admin write brands" on brands;
drop policy if exists "admin write products" on products;
create policy "admin write categories" on categories for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin write brands" on brands for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin write products" on products for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- Pedidos: cualquiera (anon) puede CREAR un pedido desde la web...
drop policy if exists "anyone create orders" on orders;
drop policy if exists "anyone create order_items" on order_items;
create policy "anyone create orders"      on orders      for insert with check (true);
create policy "anyone create order_items" on order_items for insert with check (true);

-- ...pero solo admins autenticados pueden leer / actualizar / eliminar
drop policy if exists "admin read orders" on orders;
drop policy if exists "admin update orders" on orders;
drop policy if exists "admin delete orders" on orders;
drop policy if exists "admin read order_items" on order_items;
create policy "admin read orders"   on orders for select using (auth.uid() is not null);
create policy "admin update orders" on orders for update using (auth.uid() is not null);
create policy "admin delete orders" on orders for delete using (auth.uid() is not null);
create policy "admin read order_items" on order_items for select using (auth.uid() is not null);

-- ------------------------- STORAGE (imágenes de productos) -------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "admin upload product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.uid() is not null);

-- ------------------------- DATOS DE EJEMPLO (seed) -------------------------

insert into categories (name, slug, color, sort_order) values
  ('Whisky','whisky','#c8962c',1),
  ('Ron','ron','#a0522d',2),
  ('Pisco','pisco','#d8c07a',3),
  ('Vodka','vodka','#b8c4cc',4),
  ('Gin','gin','#7fa8bf',5),
  ('Vinos','vinos','#8a2a38',6),
  ('Espumantes','espumantes','#d4b483',7),
  ('Cervezas','cervezas','#d4a017',8)
on conflict (slug) do nothing;

insert into brands (name) values
  ('Johnnie Walker'),('Chivas Regal'),('Cartavio'),('Bacardí'),
  ('Absolut'),('Tanqueray'),('Tabernero'),('Cusqueña'),
  ('Moët & Chandon'),('Queirolo')
on conflict (name) do nothing;

insert into products (name, slug, description, price, stock, category_id, brand_id, volume_ml, abv, is_featured)
select p.name, p.slug, p.description, p.price, p.stock,
       c.id, b.id, p.volume_ml, p.abv, p.is_featured
from (values
  ('Johnnie Walker Black Label 12 años','jw-black-label-12','Blend escocés de 12 años, ahumado y con notas de vainilla y fruta madura.',129.90,24,'whisky','Johnnie Walker',750,40,true),
  ('Chivas Regal 12 años','chivas-regal-12','Whisky escocés suave y meloso, con toques de miel y vainilla.',115.00,18,'whisky','Chivas Regal',750,40,true),
  ('Johnnie Walker Red Label','jw-red-label','Versátil y con carácter, ideal para tragos largos y cócteles.',69.90,40,'whisky','Johnnie Walker',750,40,false),
  ('Ron Cartavio Solera 12 años','cartavio-solera-12','Ron peruano añejado, redondo y con notas de caramelo y roble.',74.90,30,'ron','Cartavio',750,40,true),
  ('Ron Bacardí Carta Blanca','bacardi-carta-blanca','Ron blanco ligero y suave, base perfecta para el mojito.',45.00,50,'ron','Bacardí',750,40,false),
  ('Pisco Quebranta Queirolo','pisco-quebranta-queirolo','Pisco puro de uva quebranta, aromático y equilibrado.',42.00,35,'pisco','Queirolo',750,42,true),
  ('Pisco Acholado Tabernero','pisco-acholado-tabernero','Blend de varias uvas pisqueras, versátil para cócteles y chilcanos.',39.90,28,'pisco','Tabernero',750,41,false),
  ('Vodka Absolut Original','vodka-absolut-original','Vodka sueco de grano, limpio y suave.',58.00,32,'vodka','Absolut',750,40,true),
  ('Gin Tanqueray London Dry','gin-tanqueray-london-dry','Gin premium con enebro intenso y cítricos frescos.',79.90,22,'gin','Tanqueray',750,43.1,true),
  ('Vino Tinto Tabernero Gran Tinto','tabernero-gran-tinto','Vino tinto semiseco, frutado y fácil de beber.',28.90,60,'vinos','Tabernero',750,12,false),
  ('Champagne Moët & Chandon Brut','moet-chandon-brut','Champagne francés icónico, elegante y burbujeante.',249.00,10,'espumantes','Moët & Chandon',750,12,true),
  ('Cerveza Cusqueña Trigo (Six Pack)','cusquena-trigo-sixpack','Six pack de cerveza de trigo, refrescante y con cuerpo.',32.00,45,'cervezas','Cusqueña',330,5,false),
  ('Johnnie Walker Blue Label','jw-blue-label','Whisky de mezcla excepcional, sedoso y profundo. Edición de lujo.',899.00,4,'whisky','Johnnie Walker',750,40,false),
  ('Ron Cartavio XO 18 años','cartavio-xo-18','Ron ultra premium de 18 años, complejo y aterciopelado.',189.00,8,'ron','Cartavio',750,40,false),
  ('Vodka Absolut Citron','vodka-absolut-citron','Vodka saborizado con limón, ideal para un cosmopolitan.',62.00,0,'vodka','Absolut',750,40,false),
  ('Espumante Tabernero Brut','tabernero-brut','Espumante peruano seco y festivo. La opción accesible para brindar.',34.90,26,'espumantes','Tabernero',750,11.5,false)
) as p(name, slug, description, price, stock, cat_slug, brand_name, volume_ml, abv, is_featured)
join categories c on c.slug = p.cat_slug
left join brands b on b.name = p.brand_name
on conflict (slug) do nothing;
