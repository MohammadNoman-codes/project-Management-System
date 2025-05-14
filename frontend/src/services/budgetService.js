import api from './api';

const budgetService = {
  getProjectBudget: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/budget`);
    return response.data.data;
  },
  
  addExpense: async (projectId, expenseData) => {
    const response = await api.post(`/projects/${projectId}/expenses`, expenseData);
    return response.data.data;
  },
  
  updateExpense: async (expenseId, expenseData) => {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data.data;
  },
  
  deleteExpense: async (expenseId) => {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },
  
  approveExpense: async (expenseId) => {
    const response = await api.put(`/expenses/${expenseId}/approve`);
    return response.data.data;
  },
  
  rejectExpense: async (expenseId) => {
    const response = await api.put(`/expenses/${expenseId}/reject`);
    return response.data.data;
  },
  
  addBudgetChange: async (projectId, changeData) => {
    const response = await api.post(`/projects/${projectId}/budget-changes`, changeData);
    return response.data.data;
  },
  
  approveBudgetChange: async (changeId) => {
    const response = await api.put(`/budget-changes/${changeId}/approve`);
    return response.data.data;
  }
};

export default budgetService;
