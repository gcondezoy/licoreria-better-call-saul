# Licorería · Web + Panel de Control

Web de catálogo con pedidos por WhatsApp y panel de administración, construida con **React + Vite**, **Tailwind CSS** y **Supabase**.

## Modo demo (sin configuración)

La app arranca en **modo demo** con datos de ejemplo cuando no hay credenciales de Supabase.
Todo funciona (catálogo, carrito, panel admin), pero los cambios viven solo en la sesión del navegador.

```bash
npm install
npm run dev
```

- Web pública: `http://localhost:5185/`
- Panel admin: `http://localhost:5185/admin` → en modo demo entra con cualquier email y una contraseña de 4+ caracteres.

## Conectar Supabase (base de datos real)

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql) (crea tablas, seguridad RLS, bucket de imágenes y datos de ejemplo).
3. En **Authentication → Users**, crea el usuario administrador (email + contraseña).
4. Copia `.env.example` a `.env` y completa:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
VITE_WHATSAPP_NUMBER=51987654321
```

5. Reinicia `npm run dev`. La app detecta las credenciales y usa la base de datos real.

## Personalización

- **Datos del negocio** (nombre, dirección, horario, WhatsApp, redes): [`src/config/site.js`](src/config/site.js).
- **Colores y tipografías**: [`tailwind.config.js`](tailwind.config.js).

## Estructura

```
src/
├─ config/site.js      Datos del negocio (nombre, WhatsApp, dirección…)
├─ lib/                Cliente Supabase + utilidades (WhatsApp)
├─ data/               Capa de datos (Supabase o demo) + seed
├─ store/cartStore.js  Carrito (Zustand + localStorage)
├─ hooks/              React Query: catálogo y mutaciones
├─ components/         UI compartida
├─ pages/             Páginas públicas
└─ admin/             Panel de control
```

## Despliegue

- **Frontend**: Vercel o Netlify (build `npm run build`, output `dist`). Configura las variables de entorno `VITE_*` en el panel del proveedor.
- **Base de datos**: Supabase (ya alojada).
