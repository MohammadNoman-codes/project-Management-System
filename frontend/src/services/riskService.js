import api from './api';

const riskService = {
  getAllRisks: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/risks`);
    return response.data.data;
  },
  
  getRiskById: async (id) => {
    const response = await api.get(`/risks/${id}`);
    return response.data.data;
  },
  
  createRisk: async (projectId, riskData) => {
    const response = await api.post(`/projects/${projectId}/risks`, riskData);
    return response.data.data;
  },
  
  updateRisk: async (id, riskData) => {
    const response = await api.put(`/risks/${id}`, riskData);
    return response.data.data;
  },
  
  deleteRisk: async (id) => {
    const response = await api.delete(`/risks/${id}`);
    return response.data;
  }
};

export default riskService;
