import axios from 'axios';

// Base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token + cleaning empty params
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Strip empty/null/undefined params so we don't send ?search=&category=&minPrice=
    if (config.params) {
      const cleanParams = {};
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = value;
        }
      });
      config.params = cleanParams;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - unwrap axios response to get JSON body
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    console.error('Full error response:', error.response?.data);
    
    // Log validation errors in detail
    if (error.response?.data?.errors) {
      console.error('Validation Errors Detail:', JSON.stringify(error.response.data.errors, null, 2));
    }
    
    console.error('Request URL:', error.config?.url);
    console.error('Request Data:', error.config?.data);
    return Promise.reject(error);
  }
);

/**
 * Extract an array from any API response format.
 * Handles: [...], { data: [...] }, { products: [...] }, { suppliers: [...] }, etc.
 */
export const extractArray = (response, fallback = []) => {
  if (!response) return fallback;
  if (Array.isArray(response)) return response;
  if (typeof response === 'object') {
    // Try common wrapper keys
    for (const key of ['data', 'products', 'suppliers', 'categories', 'industries', 'rfqs', 'items', 'results', 'rows', 'popularity', 'topProducts']) {
      if (Array.isArray(response[key])) return response[key];
    }
  }
  return fallback;
};

/**
 * Extract paginated response with data and meta.
 * Returns { data: [...], meta: { total, page, limit, totalPages } }
 */
export const extractPaginated = (response, fallback = { data: [], meta: null }) => {
  if (!response) return fallback;
  const result = { data: [], meta: null };
  
  // Extract data array
  if (Array.isArray(response)) {
    result.data = response;
  } else if (typeof response === 'object') {
    for (const key of ['data', 'products', 'suppliers', 'categories', 'industries', 'rfqs', 'items', 'results', 'rows', 'popularity', 'topProducts']) {
      if (Array.isArray(response[key])) {
        result.data = response[key];
        break;
      }
    }
    // Extract meta/pagination info
    if (response.meta) {
      result.meta = response.meta;
    } else if (response.pagination) {
      result.meta = response.pagination;
    } else if (response.total !== undefined) {
      result.meta = {
        total: response.total,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || Math.ceil(response.total / (response.limit || 10))
      };
    }
  }
  
  return result;
};

/**
 * Extract an object from any API response format.
 * Handles: { ... }, { data: { ... } }
 */
export const extractObject = (response, fallback = {}) => {
  if (!response) return fallback;
  if (Array.isArray(response)) return fallback;
  if (typeof response === 'object') {
    // If it has a .data key that's an object (not array), unwrap it
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data;
    }
    return response;
  }
  return fallback;
};

// =======================
// Auth APIs
// =======================
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
};

// =======================
// Supplier APIs
// =======================
export const supplierApi = {
  getAll: (params) => apiClient.get('/suppliers', { params }),
  getById: (id) => apiClient.get(`/suppliers/${id}`),
  getIndustries: (id) => apiClient.get(`/suppliers/${id}/industries`),
  create: (data) => apiClient.post('/suppliers', data),
  update: (id, data) => apiClient.patch(`/suppliers/${id}`, data),
  updateIndustries: (id, data) => apiClient.patch(`/suppliers/${id}/industries`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`),
  bulkCreate: (data) => apiClient.post('/suppliers/bulk', data),
  bulkUpload: (formData) => apiClient.post('/suppliers/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// =======================
// Product APIs
// =======================
export const productApi = {
  getAll: (params) => apiClient.get('/products', { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.patch(`/products/${id}`, data),
  updatePrices: (id, data) => apiClient.patch(`/products/${id}/prices`, data),
  updateIndustries: (id, data) => apiClient.patch(`/products/${id}/industries`, data),
  updateFeatures: (id, data) => apiClient.patch(`/products/${id}/features`, data),
  updateSpecifications: (id, data) => apiClient.patch(`/products/${id}/specifications`, data),
  updateFaqs: (id, data) => apiClient.patch(`/products/${id}/faqs`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  addFeature: (id, data) => apiClient.post(`/products/${id}/features`, data),
  getFeatures: (id) => apiClient.get(`/products/${id}/features`),
  deleteFeature: (id, featureId) => apiClient.delete(`/products/${id}/features/${featureId}`),
};

// =======================
// Category APIs
// =======================
export const categoryApi = {
  getAll: (params) => apiClient.get('/categories', { params }),
  getTree: () => apiClient.get('/categories/tree'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.patch(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

// =======================
// Industry APIs
// =======================
export const industryApi = {
  getAll: (params) => apiClient.get('/industries', { params }),
  create: (data) => apiClient.post('/industries', data),
  update: (id, data) => apiClient.patch(`/industries/${id}`, data),
  delete: (id) => apiClient.delete(`/industries/${id}`),
};

// =======================
// RFQ APIs
// =======================
export const rfqApi = {
  getAll: (params) => apiClient.get('/rfq', { params }),
  getById: (id) => apiClient.get(`/rfq/${id}`),
  create: (data) => apiClient.post('/rfq', data),
  updateStatus: (id, status) => apiClient.patch(`/rfq/${id}/status`, { status }),
};

// =======================
// Enquiry APIs
// =======================
export const enquiryApi = {
  submit: (data) => apiClient.post('/enquiry', data),
};

// =======================
// Dashboard APIs
// =======================
export const dashboardApi = {
  getMetrics: () => apiClient.get('/dashboard'),
  getProductPopularity: (params) => apiClient.get('/dashboard/product-popularity', { params }),
  getRfqAnalytics: (params) => apiClient.get('/dashboard/rfq-analytics', { params }),
  globalSearch: (params) => apiClient.get('/dashboard/search', { params }),
};

export default apiClient;
