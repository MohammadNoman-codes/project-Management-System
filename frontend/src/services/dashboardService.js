import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get KPI data for dashboard
const getKPIs = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/kpis`);
    return response.data;
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    throw error;
  }
};

// Get project status distribution for charts
const getProjectStatusDistribution = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/projects/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project status distribution:', error);
    throw error;
  }
};

// Get task status distribution for charts
const getTaskStatusDistribution = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/tasks/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task status distribution:', error);
    throw error;
  }
};

// Get budget allocation for charts
const getBudgetAllocation = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/budget/allocation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budget allocation:', error);
    throw error;
  }
};

// Get risk distribution for charts
const getRiskDistribution = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/risks/distribution`);
    return response.data;
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    throw error;
  }
};

// Get top projects by budget variance
const getTopProjectsByBudgetVariance = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/projects/budget-variance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top projects by budget variance:', error);
    throw error;
  }
};

// Get recent notifications
const getRecentNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    throw error;
  }
};

// Get upcoming tasks
const getUpcomingTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/tasks/upcoming`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }
};

const dashboardService = {
  getKPIs,
  getProjectStatusDistribution,
  getTaskStatusDistribution,
  getBudgetAllocation,
  getRiskDistribution,
  getTopProjectsByBudgetVariance,
  getRecentNotifications,
  getUpcomingTasks,
};

export default dashboardService;
