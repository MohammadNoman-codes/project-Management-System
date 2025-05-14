import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get project budget
const getProjectBudget = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/budget`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project budget:', error);
    throw error;
  }
};

// Add expense
const addExpense = async (projectId, expenseData) => {
  try {
    const response = await axios.post(`${API_URL}/projects/${projectId}/expenses`, expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Update expense
const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/expenses/${expenseId}`, expenseData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete expense
const deleteExpense = async (expenseId) => {
  try {
    const response = await axios.delete(`${API_URL}/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Approve expense
const approveExpense = async (expenseId) => {
  try {
    const response = await axios.put(`${API_URL}/expenses/${expenseId}/approve`);
    return response.data.data;
  } catch (error) {
    console.error('Error approving expense:', error);
    throw error;
  }
};

// Reject expense
const rejectExpense = async (expenseId) => {
  try {
    const response = await axios.put(`${API_URL}/expenses/${expenseId}/reject`);
    return response.data.data;
  } catch (error) {
    console.error('Error rejecting expense:', error);
    throw error;
  }
};

// Add budget change request
const addBudgetChange = async (projectId, budgetChangeData) => {
  try {
    const response = await axios.post(`${API_URL}/projects/${projectId}/budget-changes`, budgetChangeData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding budget change:', error);
    throw error;
  }
};

// Approve budget change
const approveBudgetChange = async (budgetChangeId) => {
  try {
    const response = await axios.put(`${API_URL}/budget-changes/${budgetChangeId}/approve`);
    return response.data.data;
  } catch (error) {
    console.error('Error approving budget change:', error);
    throw error;
  }
};

// Reject budget change
const rejectBudgetChange = async (budgetChangeId) => {
  try {
    const response = await axios.put(`${API_URL}/budget-changes/${budgetChangeId}/reject`);
    return response.data.data;
  } catch (error) {
    console.error('Error rejecting budget change:', error);
    throw error;
  }
};

const budgetService = {
  getProjectBudget,
  addExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  addBudgetChange,
  approveBudgetChange,
  rejectBudgetChange
};

export default budgetService;
