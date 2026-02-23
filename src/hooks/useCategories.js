import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, extractArray, extractObject } from '../services/api';
import { DEMO_MODE, demoCategories } from '../data/dummy';

// Query keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  trees: () => [...categoryKeys.all, 'tree'],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
};

/**
 * Hook to fetch all categories (flat list)
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoCategories;
      }
      const response = await categoryApi.getAll();
      return extractArray(response);
    },
  });
};

/**
 * Hook to fetch categories in tree structure
 */
export const useCategoryTree = () => {
  return useQuery({
    queryKey: categoryKeys.trees(),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoCategories;
      }
      const response = await categoryApi.getTree();
      return extractArray(response);
    },
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      if (DEMO_MODE) {
        return demoCategories.find((category) => category.id === id) || null;
      }
      const response = await categoryApi.getById(id);
      return extractObject(response);
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

/**
 * Hook to update a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
