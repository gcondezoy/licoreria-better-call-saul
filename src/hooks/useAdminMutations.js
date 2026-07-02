import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../data/api'

// Invalida las queries relevantes tras cada mutación para refrescar la UI.
function useInvalidate() {
  const qc = useQueryClient()
  return (keys) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
}

export function useProductMutations() {
  const invalidate = useInvalidate()
  const opts = { onSuccess: () => invalidate(['products', 'featured', 'product']) }
  return {
    create: useMutation({ mutationFn: api.createProduct, ...opts }),
    update: useMutation({ mutationFn: ({ id, data }) => api.updateProduct(id, data), ...opts }),
    remove: useMutation({ mutationFn: api.deleteProduct, ...opts }),
  }
}

export function useCategoryMutations() {
  const invalidate = useInvalidate()
  const opts = { onSuccess: () => invalidate(['categories', 'products']) }
  return {
    create: useMutation({ mutationFn: api.createCategory, ...opts }),
    update: useMutation({ mutationFn: ({ id, data }) => api.updateCategory(id, data), ...opts }),
    remove: useMutation({ mutationFn: api.deleteCategory, ...opts }),
  }
}

export function useBrandMutations() {
  const invalidate = useInvalidate()
  const opts = { onSuccess: () => invalidate(['brands', 'products']) }
  return {
    create: useMutation({ mutationFn: api.createBrand, ...opts }),
    remove: useMutation({ mutationFn: api.deleteBrand, ...opts }),
  }
}

export function useOrderMutations() {
  const invalidate = useInvalidate()
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }) => api.updateOrderStatus(id, status),
      onSuccess: () => invalidate(['orders']),
    }),
  }
}
