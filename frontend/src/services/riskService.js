import { riskApi } from './api';

// Mock data for fallback if needed
const mockRisks = [
  {
    id: 1,
    title: 'Scope creep',
    description: 'Project scope expands beyond initial requirements',
    category: 'Scope',
    probability: 4,
    impact: 3,
    riskScore: 12,
    status: 'Identified',
    mitigation_plan: 'Strict change control process',
    contingency_plan: 'Renegotiate timeline and resources',
    owner_id: 1,
    owner_name: 'John Manager',
    triggers: ['Client requests major changes', 'Requirements not clearly documented'],
    identified_date: '2023-10-15',
    review_date: '2024-01-15',
    project_id: 1
  },
  {
    id: 2,
    title: 'Resource unavailability',
    description: 'Key team members unavailable when needed',
    category: 'Resource',
    probability: 3,
    impact: 4,
    riskScore: 12,
    status: 'Mitigated',
    mitigation_plan: 'Cross-training team members',
    contingency_plan: 'Contract temporary resources',
    owner_id: 2,
    owner_name: 'Sarah Leader',
    triggers: ['Team member resignation', 'Unplanned leave'],
    identified_date: '2023-09-22',
    review_date: '2023-12-22',
    project_id: 1
  }
];

const riskService = {
  // Get all risks for a project
  getAllRisks: async (projectId) => {
    try {
      console.log(`Fetching risks for project ID: ${projectId}`);
      const response = await riskApi.getAll(projectId);
      return response.data.data;
    } catch (error) {
      console.error('Error in getAllRisks:', error);
      console.log('Falling back to mock data for risks');
      return mockRisks.filter(risk => risk.project_id.toString() === projectId.toString());
    }
  },
  
  // Get a risk by ID
  getRiskById: async (id) => {
    try {
      console.log(`Fetching risk ID: ${id}`);
      const response = await riskApi.getById(id);
      return response.data.data;
    } catch (error) {
      console.error('Error in getRiskById:', error);
      console.log('Falling back to mock data for risk');
      return mockRisks.find(risk => risk.id.toString() === id.toString());
    }
  },
  
  // Create a new risk
  createRisk: async (riskData) => {
    try {
      console.log('Creating risk with data:', riskData);
      
      // Ensure project_id is present in the request
      if (!riskData.project_id) {
        throw new Error('A project must be selected to create a risk');
      }
      
      // Send the complete risk data to the API
      const response = await riskApi.create(riskData);
      return response.data.data;
    } catch (error) {
      console.error('Error in createRisk:', error);
      throw error;
    }
  },
  
  // Update an existing risk
  updateRisk: async (id, riskData) => {
    try {
      console.log(`Updating risk ID: ${id}`, riskData);
      const response = await riskApi.update(id, riskData);
      return response.data.data;
    } catch (error) {
      console.error('Error in updateRisk:', error);
      throw error;
    }
  },
  
  // Delete a risk
  deleteRisk: async (id) => {
    try {
      console.log(`Deleting risk ID: ${id}`);
      const response = await riskApi.delete(id);
      return response.data;
    } catch (error) {
      console.error('Error in deleteRisk:', error);
      throw error;
    }
  }
};

export default riskService;
