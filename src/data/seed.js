// Datos de ejemplo (modo demo). Se usan cuando Supabase no está configurado.
// Reflejan la misma forma que las tablas de la base de datos real.

export const seedCategories = [
  { id: 'c-whisky', name: 'Whisky', slug: 'whisky', color: '#c8962c', sort_order: 1 },
  { id: 'c-ron', name: 'Ron', slug: 'ron', color: '#a0522d', sort_order: 2 },
  { id: 'c-pisco', name: 'Pisco', slug: 'pisco', color: '#d8c07a', sort_order: 3 },
  { id: 'c-vodka', name: 'Vodka', slug: 'vodka', color: '#b8c4cc', sort_order: 4 },
  { id: 'c-gin', name: 'Gin', slug: 'gin', color: '#7fa8bf', sort_order: 5 },
  { id: 'c-vinos', name: 'Vinos', slug: 'vinos', color: '#8a2a38', sort_order: 6 },
  { id: 'c-espumantes', name: 'Espumantes', slug: 'espumantes', color: '#d4b483', sort_order: 7 },
  { id: 'c-cerveza', name: 'Cervezas', slug: 'cervezas', color: '#d4a017', sort_order: 8 },
]

export const seedBrands = [
  { id: 'b-jw', name: 'Johnnie Walker' },
  { id: 'b-chivas', name: 'Chivas Regal' },
  { id: 'b-cartavio', name: 'Cartavio' },
  { id: 'b-bacardi', name: 'Bacardí' },
  { id: 'b-absolut', name: 'Absolut' },
  { id: 'b-tanqueray', name: 'Tanqueray' },
  { id: 'b-tabernero', name: 'Tabernero' },
  { id: 'b-cusquena', name: 'Cusqueña' },
  { id: 'b-moet', name: 'Moët & Chandon' },
  { id: 'b-queirolo', name: 'Queirolo' },
]

export const seedProducts = [
  {
    id: 'p1', name: 'Johnnie Walker Black Label 12 años', slug: 'jw-black-label-12',
    category_id: 'c-whisky', brand_id: 'b-jw', price: 129.9, compare_at_price: 159.9, stock: 24,
    volume_ml: 750, abv: 40, is_featured: true, is_active: true,
    description: 'Blend escocés de 12 años, ahumado y con notas de vainilla y fruta madura. Un clásico infaltable.',
  },
  {
    id: 'p2', name: 'Chivas Regal 12 años', slug: 'chivas-regal-12',
    category_id: 'c-whisky', brand_id: 'b-chivas', price: 115.0, stock: 18,
    volume_ml: 750, abv: 40, is_featured: true, is_active: true,
    description: 'Whisky escocés suave y meloso, con toques de miel, manzana y vainilla.',
  },
  {
    id: 'p3', name: 'Johnnie Walker Red Label', slug: 'jw-red-label',
    category_id: 'c-whisky', brand_id: 'b-jw', price: 69.9, compare_at_price: 84.9, stock: 40,
    volume_ml: 750, abv: 40, is_featured: false, is_active: true,
    description: 'Versátil y con carácter, ideal para tragos largos y cócteles.',
  },
  {
    id: 'p4', name: 'Ron Cartavio Solera 12 años', slug: 'cartavio-solera-12',
    category_id: 'c-ron', brand_id: 'b-cartavio', price: 74.9, stock: 30,
    volume_ml: 750, abv: 40, is_featured: true, is_active: true,
    description: 'Ron peruano añejado, redondo y con notas de caramelo, roble y frutos secos.',
  },
  {
    id: 'p5', name: 'Ron Bacardí Carta Blanca', slug: 'bacardi-carta-blanca',
    category_id: 'c-ron', brand_id: 'b-bacardi', price: 45.0, stock: 50,
    volume_ml: 750, abv: 40, is_featured: false, is_active: true,
    description: 'Ron blanco ligero y suave, base perfecta para el mojito y la piña colada.',
  },
  {
    id: 'p6', name: 'Pisco Quebranta Queirolo', slug: 'pisco-quebranta-queirolo',
    category_id: 'c-pisco', brand_id: 'b-queirolo', price: 42.0, stock: 35,
    volume_ml: 750, abv: 42, is_featured: true, is_active: true,
    description: 'Pisco puro de uva quebranta, aromático y equilibrado. Ideal para el pisco sour.',
  },
  {
    id: 'p7', name: 'Pisco Acholado Tabernero', slug: 'pisco-acholado-tabernero',
    category_id: 'c-pisco', brand_id: 'b-tabernero', price: 39.9, stock: 28,
    volume_ml: 750, abv: 41, is_featured: false, is_active: true,
    description: 'Blend de varias uvas pisqueras, versátil para cócteles y chilcanos.',
  },
  {
    id: 'p8', name: 'Vodka Absolut Original', slug: 'vodka-absolut-original',
    category_id: 'c-vodka', brand_id: 'b-absolut', price: 58.0, stock: 32,
    volume_ml: 750, abv: 40, is_featured: true, is_active: true,
    description: 'Vodka sueco de grano, limpio y suave. Un referente mundial.',
  },
  {
    id: 'p9', name: 'Gin Tanqueray London Dry', slug: 'gin-tanqueray-london-dry',
    category_id: 'c-gin', brand_id: 'b-tanqueray', price: 79.9, stock: 22,
    volume_ml: 750, abv: 43.1, is_featured: true, is_active: true,
    description: 'Gin premium con enebro intenso y cítricos frescos. El gin tonic perfecto.',
  },
  {
    id: 'p10', name: 'Vino Tinto Tabernero Gran Tinto', slug: 'tabernero-gran-tinto',
    category_id: 'c-vinos', brand_id: 'b-tabernero', price: 28.9, stock: 60,
    volume_ml: 750, abv: 12, is_featured: false, is_active: true,
    description: 'Vino tinto semiseco, frutado y fácil de beber. Para compartir en cualquier ocasión.',
  },
  {
    id: 'p11', name: 'Champagne Moët & Chandon Brut', slug: 'moet-chandon-brut',
    category_id: 'c-espumantes', brand_id: 'b-moet', price: 249.0, stock: 10,
    volume_ml: 750, abv: 12, is_featured: true, is_active: true,
    description: 'Champagne francés icónico, elegante y burbujeante. Para celebrar en grande.',
  },
  {
    id: 'p12', name: 'Cerveza Cusqueña Trigo (Six Pack)', slug: 'cusquena-trigo-sixpack',
    category_id: 'c-cerveza', brand_id: 'b-cusquena', price: 32.0, stock: 45,
    volume_ml: 330, abv: 5, is_featured: false, is_active: true,
    description: 'Six pack de cerveza de trigo, refrescante y con cuerpo. Perfecta bien fría.',
  },
  {
    id: 'p13', name: 'Johnnie Walker Blue Label', slug: 'jw-blue-label',
    category_id: 'c-whisky', brand_id: 'b-jw', price: 899.0, stock: 4,
    volume_ml: 750, abv: 40, is_featured: false, is_active: true,
    description: 'La joya de la corona: whisky de mezcla excepcional, sedoso y profundo. Edición de lujo.',
  },
  {
    id: 'p14', name: 'Ron Cartavio XO 18 años', slug: 'cartavio-xo-18',
    category_id: 'c-ron', brand_id: 'b-cartavio', price: 189.0, stock: 8,
    volume_ml: 750, abv: 40, is_featured: false, is_active: true,
    description: 'Ron ultra premium de 18 años, complejo y aterciopelado. Para degustar sin apuro.',
  },
  {
    id: 'p15', name: 'Vodka Absolut Citron', slug: 'vodka-absolut-citron',
    category_id: 'c-vodka', brand_id: 'b-absolut', price: 62.0, stock: 0,
    volume_ml: 750, abv: 40, is_featured: false, is_active: true,
    description: 'Vodka saborizado con limón, ideal para un cosmopolitan vibrante.',
  },
  {
    id: 'p16', name: 'Espumante Tabernero Brut', slug: 'tabernero-brut',
    category_id: 'c-espumantes', brand_id: 'b-tabernero', price: 34.9, stock: 26,
    volume_ml: 750, abv: 11.5, is_featured: false, is_active: true,
    description: 'Espumante peruano seco y festivo. La opción accesible para brindar.',
  },
  {
    id: 'p17', name: 'Combo Previa', slug: 'combo-previa',
    category_id: null, brand_id: null, price: 89.9, compare_at_price: 110.0, stock: 15,
    is_combo: true, is_featured: true, is_active: true,
    combo_items: '1 Ron Cartavio Solera, 2 Coca-Cola 1.5L, Hielo 2kg',
    description: 'Todo listo para la previa: ron, gaseosas y hielo. Lo llevamos a tu puerta.',
  },
  {
    id: 'p18', name: 'Combo Fiesta', slug: 'combo-fiesta',
    category_id: null, brand_id: null, price: 149.9, compare_at_price: 189.0, stock: 10,
    is_combo: true, is_featured: true, is_active: true,
    combo_items: '1 Whisky JW Red Label, 1 Vodka Absolut, 4 energizantes, Hielo 2kg',
    description: 'Para armar la fiesta completa. Whisky, vodka, energizantes y hielo.',
  },
]
