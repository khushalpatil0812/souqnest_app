import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi, extractArray, extractObject, extractPaginated } from '../services/api';
import { DEMO_MODE, demoSuppliers, filterDemoSuppliers, demoPaginate } from '../data/dummy';

// Query keys
export const supplierKeys = {
  all: ['suppliers'],
  lists: () => [...supplierKeys.all, 'list'],
  list: (params) => [...supplierKeys.lists(), params],
  details: () => [...supplierKeys.all, 'detail'],
  detail: (id) => [...supplierKeys.details(), id],
};

/**
 * Hook to fetch all suppliers with optional filters
 */
export const useSuppliers = (params = {}) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: async () => {
      if (DEMO_MODE) {
        return filterDemoSuppliers(params);
      }
      const response = await supplierApi.getAll(params);
      return extractArray(response);
    },
  });
};

/**
 * Hook to fetch suppliers with pagination metadata
 * Returns { data: [...], meta: { total, page, limit, totalPages } }
 */
export const useSuppliersWithPagination = (params = {}) => {
  return useQuery({
    queryKey: supplierKeys.list({ ...params, paginated: true }),
    queryFn: async () => {
      if (DEMO_MODE) {
        const filtered = filterDemoSuppliers(params);
        return demoPaginate(filtered, params);
      }
      const response = await supplierApi.getAll(params);
      return extractPaginated(response);
    },
  });
};

/**
 * Hook to fetch a single supplier by ID
 */
export const useSupplier = (id) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoSuppliers.find((supplier) => supplier.id === id) || null;
      }
      const response = await supplierApi.getById(id);
      return extractObject(response);
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a supplier
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => supplierApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

/**
 * Hook to update a supplier
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => supplierApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a supplier
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => supplierApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

/**
 * Hook to upload suppliers in bulk
 */
export const useBulkUploadSuppliers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => supplierApi.bulkUpload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

/**
 * Hook to fetch supplier industries
 */
export const useSupplierIndustries = (supplierId) => {
  return useQuery({
    queryKey: [...supplierKeys.detail(supplierId), 'industries'],
    queryFn: async () => {
      const response = await supplierApi.getIndustries(supplierId);
      return extractArray(response);
    },
    enabled: !!supplierId,
  });
};

/**
 * Hook to update supplier industries
 */
export const useUpdateSupplierIndustries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, industryIds }) => supplierApi.updateIndustries(id, { industryIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) });
    },
  });
};
