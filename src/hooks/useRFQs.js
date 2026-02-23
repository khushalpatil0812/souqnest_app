import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, extractArray, extractObject } from '../services/api';

// Query keys
export const rfqKeys = {
  all: ['rfqs'],
  lists: () => [...rfqKeys.all, 'list'],
  list: (params) => [...rfqKeys.lists(), params],
  details: () => [...rfqKeys.all, 'detail'],
  detail: (id) => [...rfqKeys.details(), id],
};

/**
 * Hook to fetch all RFQs with optional filters
 */
export const useRFQs = (params = {}) => {
  return useQuery({
    queryKey: rfqKeys.list(params),
    queryFn: async () => {
      const response = await rfqApi.getAll(params);
      return extractArray(response);
    },
  });
};

/**
 * Hook to fetch a single RFQ by ID
 */
export const useRFQ = (id) => {
  return useQuery({
    queryKey: rfqKeys.detail(id),
    queryFn: async () => {
      const response = await rfqApi.getById(id);
      return extractObject(response);
    },
    enabled: !!id,
  });
};

/**
 * Hook to create an RFQ
 */
export const useCreateRFQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => rfqApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
    },
  });
};

/**
 * Hook to update RFQ status
 */
export const useUpdateRFQStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => rfqApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rfqKeys.detail(variables.id) });
    },
  });
};

// Note: No delete RFQ endpoint exists in the backend
