import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { industryApi, extractArray } from '../services/api';
import { DEMO_MODE, demoIndustries } from '../data/dummy';

// Query keys
export const industryKeys = {
  all: ['industries'],
  lists: () => [...industryKeys.all, 'list'],
};

/**
 * Hook to fetch all industries
 */
export const useIndustries = () => {
  return useQuery({
    queryKey: industryKeys.lists(),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoIndustries;
      }
      const response = await industryApi.getAll();
      return extractArray(response);
    },
  });
};

/**
 * Hook to create an industry
 */
export const useCreateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => industryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
    },
  });
};

/**
 * Hook to update an industry
 */
export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => industryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
    },
  });
};

/**
 * Hook to delete an industry
 */
export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => industryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.lists() });
    },
  });
};
