import api from './api';

const stakeholderService = {
  getAllStakeholders: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/stakeholders`);
    return response.data.data;
  },
  
  getStakeholderById: async (id) => {
    const response = await api.get(`/stakeholders/${id}`);
    return response.data.data;
  },
  
  createStakeholder: async (projectId, stakeholderData) => {
    const response = await api.post(`/projects/${projectId}/stakeholders`, stakeholderData);
    return response.data.data;
  },
  
  updateStakeholder: async (id, stakeholderData) => {
    const response = await api.put(`/stakeholders/${id}`, stakeholderData);
    return response.data.data;
  },
  
  deleteStakeholder: async (id) => {
    const response = await api.delete(`/stakeholders/${id}`);
    return response.data;
  },
  
  // Communication plan endpoints
  getCommunicationPlans: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/communications`);
    return response.data.data;
  },
  
  createCommunicationPlan: async (projectId, planData) => {
    const response = await api.post(`/projects/${projectId}/communications`, planData);
    return response.data.data;
  },
  
  updateCommunicationPlan: async (id, planData) => {
    const response = await api.put(`/communications/${id}`, planData);
    return response.data.data;
  },
  
  deleteCommunicationPlan: async (id) => {
    const response = await api.delete(`/communications/${id}`);
    return response.data;
  }
};

export default stakeholderService;
