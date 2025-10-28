import { ofetch } from 'ofetch'

const useApi = () => {
  const config = useRuntimeConfig()
  const apiFetch = ofetch.create({ baseURL: config.public.apiBaseUrl })

  return {
    getCategories: () => apiFetch('/categories'),
    getProducts: (params) => apiFetch('/products', { params }),
    getIngredients: () => apiFetch('/ingredients'),
    getProductIngredients: (productId) => apiFetch('/productIngredients', { params: { productId } }),
    getComponents: () => apiFetch('/components'),
    getProductComponents: (productId) => apiFetch('/productComponents', { params: { productId } }),
    createOrder: (order) => apiFetch('/orders', { method: 'POST', body: order })
  }
}

export default useApi
