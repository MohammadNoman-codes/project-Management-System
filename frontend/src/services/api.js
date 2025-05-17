import axios from 'axios';

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
  (response) => response,
  (error) => {
    // Handle session expiration or authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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
  delete: (id) => api.delete(`/projects/${id}`)
};

// Tasks API
export const taskApi = {
  getAll: (projectId) => api.get('/tasks', { params: { projectId } }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  // Add the upload method
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

// Users API
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Reports API
export const reportApi = {
  getKPIs: () => api.get('/reports/kpis'),
  getProjectTypes: () => api.get('/reports/project-types'),
  getTaskStatus: () => api.get('/reports/task-status'),
  getProjectStatus: () => api.get('/reports/project-status'),
  getProjectsTimeline: () => api.get('/reports/projects-timeline'),
  getProjectHealth: () => api.get('/reports/project-health'),
  getTaskCompletion: () => api.get('/reports/task-completion'),
  getMilestoneStatus: () => api.get('/reports/milestone-status'),
  getUpcomingTasks: () => api.get('/reports/upcoming-tasks'),
  getCompletedTasks: () => api.get('/reports/completed-tasks'),
  // Add Financial endpoints
  getFinancialSummary: () => api.get('/reports/financial-summary'),
  getExpensesTrend: () => api.get('/reports/expenses-trend'),
  getExpensesByCategory: () => api.get('/reports/expenses-by-category'),
  getBudgetVariance: () => api.get('/reports/budget-variance'),
  getBudgetForecast: () => api.get('/reports/budget-forecast'),
  // Add Risk endpoints
  getRiskSeverity: () => api.get('/reports/risk-severity'),
  getRiskCategories: () => api.get('/reports/risk-categories'),
  getRiskTrends: () => api.get('/reports/risk-trends'),
  getRiskExposure: () => api.get('/reports/risk-exposure'),
  getTopRisks: () => api.get('/reports/top-risks'),
  getRiskSummary: () => api.get('/reports/risk-summary')
};

export default {
  projectApi,
  taskApi,
  resourceApi,
  documentApi,
  budgetApi,
  stakeholderApi,
  riskApi,
  analyticsApi,
  userApi,
  reportApi
};
