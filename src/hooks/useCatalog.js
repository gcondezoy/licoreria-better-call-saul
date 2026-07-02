import { useQuery } from '@tanstack/react-query'
import * as api from '../data/api'

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.listProducts(filters),
  })
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProductBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useFeatured(limit = 6) {
  return useQuery({
    queryKey: ['featured', limit],
    queryFn: () => api.listFeatured(limit),
  })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: api.listCategories })
}

export function useBrands() {
  return useQuery({ queryKey: ['brands'], queryFn: api.listBrands })
}

export function useOrders(status) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => api.listOrders({ status }),
  })
}
