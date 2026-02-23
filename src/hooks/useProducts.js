import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, extractArray, extractObject, extractPaginated } from '../services/api';
import { DEMO_MODE, demoProducts, filterDemoProducts, demoPaginate } from '../data/dummy';

// Query keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (params) => [...productKeys.lists(), params],
  details: () => [...productKeys.all, 'detail'],
  detail: (slug) => [...productKeys.details(), slug],
  features: (id) => [...productKeys.all, 'features', id],
};

/**
 * Hook to fetch all products with optional filters
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      if (DEMO_MODE) {
        return filterDemoProducts(params);
      }
      const response = await productApi.getAll(params);
      return extractArray(response);
    },
  });
};

/**
 * Hook to fetch products with pagination metadata
 * Returns { data: [...], meta: { total, page, limit, totalPages } }
 */
export const useProductsWithPagination = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list({ ...params, paginated: true }),
    queryFn: async () => {
      if (DEMO_MODE) {
        const filtered = filterDemoProducts(params);
        return demoPaginate(filtered, params);
      }
      const response = await productApi.getAll(params);
      return extractPaginated(response);
    },
  });
};

/**
 * Hook to fetch a single product by slug or ID
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoProducts.find((product) => product.slug === slug || product.id === slug) || null;
      }
      const response = await productApi.getBySlug(slug);
      return extractObject(response);
    },
    enabled: !!slug,
  });
};

/**
 * Hook to fetch product features
 */
export const useProductFeatures = (productId) => {
  return useQuery({
    queryKey: productKeys.features(productId),
    queryFn: async () => {
      const response = await productApi.getFeatures(productId);
      return extractArray(response);
    },
    enabled: !!productId,
  });
};

/**
 * Hook to create a product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to update a product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to add a product feature
 */
export const useAddProductFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }) => productApi.addFeature(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.features(variables.productId) });
    },
  });
};

/**
 * Hook to delete a product feature
 */
export const useDeleteProductFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, featureId }) => productApi.deleteFeature(productId, featureId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.features(variables.productId) });
    },
  });
};
