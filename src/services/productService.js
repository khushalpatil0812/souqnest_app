import apiClient from './api'

export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params })
  return response
}

export const getProductBySlug = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`)
  return response
}

export const getProductFeatures = async (id) => {
  const response = await apiClient.get(`/products/${id}/features`)
  return response
}
