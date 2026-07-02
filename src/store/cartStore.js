import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Estado del carrito. Persiste en localStorage para no perder el pedido al recargar.
export const useCart = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, slug, price, image_url, quantity, stock }

      // Estado del mini-carrito deslizable (no se persiste, ver partialize).
      drawerOpen: false,
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          const maxStock = product.stock ?? 99
          if (existing) {
            return {
              drawerOpen: true,
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, maxStock) }
                  : i,
              ),
            }
          }
          return {
            drawerOpen: true,
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image_url: product.image_url ?? null,
                category: product.category?.name ?? null,
                color: product.category?.color ?? null,
                stock: maxStock,
                quantity: Math.min(qty, maxStock),
              },
            ],
          }
        }),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock ?? 99)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),

      // Selectores derivados
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: 'licoreria_cart',
      // Solo persistimos los productos, no el estado abierto/cerrado del panel.
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
