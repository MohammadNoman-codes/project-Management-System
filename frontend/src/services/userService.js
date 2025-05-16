import { userApi } from './api';

// Mock data for fallback
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Project Manager', department: 'Management' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Risk Analyst', department: 'Operations' },
  { id: 3, name: 'Ahmad Hassan', email: 'ahmad@example.com', role: 'Engineer', department: 'Engineering' },
  { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Developer', department: 'IT' },
  { id: 5, name: 'Mohammed Al-Farsi', email: 'mohammed@example.com', role: 'Quality Assurance', department: 'QA' }
];

const userService = {
  getAllUsers: async () => {
    try {
      console.log('Fetching all users');
      const response = await userApi.getAll();
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      console.log('Falling back to mock data for users');
      return mockUsers;
    }
  },
  
  getUserById: async (id) => {
    try {
      console.log(`Fetching user with ID: ${id}`);
      const response = await userApi.getById(id);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      console.log('Falling back to mock data for user');
      return mockUsers.find(u => u.id.toString() === id.toString());
    }
  }
};

export default userService;
