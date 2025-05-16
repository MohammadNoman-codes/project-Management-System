import axios from 'axios';

// Make sure this points to your actual backend API
// If in development, it should typically be http://localhost:portnumber/api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // For debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // For debugging
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle session expiration or authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', {
        request: error.request,
        url: error.config?.url
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Projects API
export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  getWithDetails: (id) => api.get(`/projects/${id}/details`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  // Add these new endpoints
  addTeamMember: (projectId, teamMemberData) => api.post(`/projects/${projectId}/team`, teamMemberData),
  removeTeamMember: (projectId, teamMemberId) => api.delete(`/projects/${projectId}/team/${teamMemberId}`)
};

// Tasks API
export const taskApi = {
  getAll: (projectId) => {
    const url = projectId ? `/projects/${projectId}/tasks` : '/tasks';
    return api.get(url);
  },
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, data) => api.patch(`/tasks/${id}/status`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  uploadFile: (id, formData) => api.post(`/tasks/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
};

// Resources API
export const resourceApi = {
  getAll: () => api.get('/resources'),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

// Documents API
export const documentApi = {
  getAll: (projectId) => api.get('/documents', { params: { projectId } }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`)
};

// Budget API
export const budgetApi = {
  addExpense: (data) => api.post('/budget/expenses', data),
  approveExpense: (id) => api.put(`/budget/expenses/${id}/approve`),
  rejectExpense: (id) => api.put(`/budget/expenses/${id}/reject`),
  requestBudgetChange: (data) => api.post('/budget/changes', data),
  approveBudgetChange: (id) => api.put(`/budget/changes/${id}/approve`),
  rejectBudgetChange: (id) => api.put(`/budget/changes/${id}/reject`)
};

// Stakeholders API
export const stakeholderApi = {
  getAll: (projectId) => api.get('/stakeholders', { params: { projectId } }),
  getById: (id) => api.get(`/stakeholders/${id}`),
  create: (data) => api.post('/stakeholders', data),
  update: (id, data) => api.put(`/stakeholders/${id}`, data),
  delete: (id) => api.delete(`/stakeholders/${id}`)
};

// Risks API
export const riskApi = {
  getAll: (projectId) => api.get('/risks', { params: { projectId } }),
  getById: (id) => api.get(`/risks/${id}`),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`)
};

// Analytics API
export const analyticsApi = {
  getProjectPerformance: (projectId, dateRange) => 
    api.get('/analytics/performance', { params: { projectId, dateRange } }),
  getResourceUtilization: (dateRange, departmentId) => 
    api.get('/analytics/resources', { params: { dateRange, departmentId } }),
  getBudgetForecasts: (projectId) => 
    api.get('/analytics/budget-forecast', { params: { projectId } }),
  getCompletionForecasts: (projectId) => 
    api.get('/analytics/completion-forecast', { params: { projectId } })
};

export default {
  projectApi,
  taskApi,
  resourceApi,
  documentApi,
  budgetApi,
  stakeholderApi,
  riskApi,
  analyticsApi
};
