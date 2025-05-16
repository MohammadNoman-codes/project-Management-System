import axios from 'axios';
import { projectApi } from './api';  // Add this import

// Create API instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

// Mock data for fallback
const mockProjects = [
  {
    id: '1',
    title: 'Hamad Town Park (حديقة مدينة حمد)',
    description: 'Building a comprehensive project management system with resource allocation and budget tracking',
    status: 'In Progress',
    completion: 45,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    manager: { name: 'Mohammad', avatar: 'https://via.placeholder.com/40' },
    budget: {
      estimated: 85000,
      actual: 30000,
      currency: 'BHD',
      expenses: [
        { id: '10001', category: 'Labor', description: 'UX Design', amount: 8500, date: '2023-01-20', status: 'Approved' },
        { id: '10002', category: 'Labor', description: 'Frontend Development', amount: 12000, date: '2023-03-05', status: 'Approved' },
        { id: '10003', category: 'Software', description: 'Design Tools', amount: 1500, date: '2023-01-18', status: 'Approved' },
        { id: '10004', category: 'Hosting', description: 'Development Environment', amount: 800, date: '2023-02-10', status: 'Approved' },
        { id: '10005', category: 'Labor', description: 'UI Design', amount: 7500, date: '2023-04-15', status: 'Pending' }
      ],
      budgetChanges: []
    },
    milestones: [
      {
        id: 1,
        name: 'Stage 1 - Studies',
        status: 'Completed',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        tasks: [
          { id: 101, name: 'Creation of Project Charter', status: 'Completed', startDate: '2023-01-01', dueDate: '2023-01-15', assignedTo: { name: 'Mohammad' } },
          { id: 102, name: 'Preparations for Conceptual Design', status: 'Completed', startDate: '2023-01-16', dueDate: '2023-01-31', assignedTo: { name: 'Mohammad' } }
        ]
      },
      {
        id: 2,
        name: 'Stage 2 - Initial Design',
        status: 'In Progress',
        startDate: '2023-02-01',
        endDate: '2023-03-15',
        tasks: [
          { id: 201, name: 'Producing Conceptual Design Layout', status: 'Completed', startDate: '2023-02-01', dueDate: '2023-02-15', assignedTo: { name: 'Mohammad' } },
          { id: 202, name: 'Wayleave Permits Follow-up', status: 'In Progress', startDate: '2023-02-16', dueDate: '2023-03-01', assignedTo: { name: 'Mohammad' } },
          { id: 203, name: 'External Stakeholders\' Approval', status: 'To Do', startDate: '2023-03-01', dueDate: '2023-03-15', assignedTo: { name: 'Mohammad' } }
        ]
      }
    ],
    team: [
      { id: 1, name: 'Mohammad', role: 'Project Manager', email: 'mohammad@example.com', avatar: 'https://via.placeholder.com/40' },
      { id: 2, name: 'Ahmed', role: 'Design Engineer', email: 'ahmed@example.com', avatar: 'https://via.placeholder.com/40' },
      { id: 3, name: 'Fatima', role: 'Contract Manager', email: 'fatima@example.com', avatar: 'https://via.placeholder.com/40' }
    ]
  },
  // Add other mock projects similar to those in Projects.js here
  {
    id: '2',
    title: 'الحديقة البيئية- ECO WALK',
    description: 'Renovation of municipal hospital facilities with modern equipment',
    status: 'Planned',
    completion: 0,
    startDate: '2023-03-15',
    endDate: '2024-06-30',
    manager: { name: 'Mohammad', avatar: 'https://via.placeholder.com/40' },
    budget: {
      estimated: 120000,
      actual: 0,
      currency: 'BHD',
      expenses: [],
      budgetChanges: []
    },
    milestones: [],
    team: []
  },
  {
    id: '3',
    title: 'Salman City Park (حديقة مدينة سلمان)',
    description: 'Development of new public park with recreational facilities',
    status: 'Completed',
    completion: 100,
    startDate: '2022-05-10',
    endDate: '2023-02-28',
    manager: { name: 'Mohammad', avatar: 'https://via.placeholder.com/40' },
    budget: {
      estimated: 45000,
      actual: 45000,
      currency: 'BHD',
      expenses: [],
      budgetChanges: []
    },
    milestones: [],
    team: []
  }
];

const getAllProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Create a project with all its details (milestones and tasks)
const createProjectWithDetails = async (projectData) => {
  try {
    const response = await api.post('/projects/with-details', projectData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating project with details:', error);
    throw error;
  }
};

const projectService = {
  getAllProjects,
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data.data;
    } catch (error) {
      console.log('Falling back to mock data for projects:', error);
      return mockProjects;
    }
  },
  
  getProjectById: async (id) => {
    try {
      const response = await api.get(`http://localhost:5000/api/projects/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(`Falling back to mock data for project ${id}:`, error);
      return mockProjects.find(p => p.id === id);
    }
  },
  
  getProjectWithDetails: async (id) => {
    try {
      const response = await api.get(`http://localhost:5000/api/projects/${id}/details`);
      return response.data.data;
    } catch (error) {
      console.log(`Falling back to mock data for project details ${id}:`, error);
      return mockProjects.find(p => p.id === id);
    }
  },
  
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data.data;
    } catch (error) {
      console.log('Error creating project, using mock data:', error);
      const newProject = {
        ...projectData,
        id: (mockProjects.length + 1).toString(),
        budget: {
          estimated: projectData.budget?.estimated || 0,
          actual: 0,
          currency: projectData.budget?.currency || 'BHD',
          expenses: [],
          budgetChanges: []
        },
        team: [],
        milestones: projectData.milestones || []
      };
      mockProjects.push(newProject);
      return newProject;
    }
  },
  
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      console.log(`Error updating project ${id}, using mock data:`, error);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProjects[index] = { ...mockProjects[index], ...projectData };
        return mockProjects[index];
      }
      return null;
    }
  },
  
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.log(`Error deleting project ${id}, using mock data:`, error);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProjects.splice(index, 1);
        return { success: true };
      }
      return { success: false };
    }
  },
  
  createProjectWithDetails,

  // Add team member to project
  addTeamMember: async (projectId, teamMemberData) => {
    try {
      console.log(`Adding team member to project ID: ${projectId}`, teamMemberData);
      const response = await projectApi.addTeamMember(projectId, teamMemberData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in addTeamMember:', error);
      
      // // Fallback to mock data if API fails
      // console.log('Falling back to mock data for adding team member');
      // const mockProject = mockProjects.find(p => p.id === projectId);
      // if (mockProject) {
      //   const newMember = {
      //     id: Date.now(),
      //     ...teamMemberData,
      //     avatar: 'https://via.placeholder.com/40'
      //   };
      //   mockProject.team.push(newMember);
      //   return newMember;
      // }
      
      throw error;
    }
  },

  // Remove team member from project
  removeTeamMember: async (projectId, teamMemberId) => {
    try {
      console.log(`Removing team member ${teamMemberId} from project ID: ${projectId}`);
      const response = await projectApi.removeTeamMember(projectId, teamMemberId);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in removeTeamMember:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data for removing team member');
      const mockProject = mockProjects.find(p => p.id === projectId);
      if (mockProject) {
        mockProject.team = mockProject.team.filter(member => member.id !== teamMemberId);
        return { success: true };
      }
      
      throw error;
    }
  },
};

export default projectService;
