import { taskApi } from './api';

const taskService = {
  getAllTasks: async (projectId = null) => {
    try {
      console.log(`Fetching tasks for project ID: ${projectId || 'all'}`);
      const response = await taskApi.getAll(projectId);
      
      // Check if we actually have the data we expect
      if (!response.data) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid API response format - no data property');
      }
      
      // If your API returns data inside a data property, keep this line
      // Otherwise, adjust this to match your API's response format
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error;
    }
  },
  
  getTaskById: async (id) => {
    try {
      console.log(`Fetching task ID: ${id}`);
      const response = await taskApi.getById(id);
      
      // Check if we actually have the data we expect
      if (!response.data) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid API response format - no data property');
      }
      
      // If your API returns data inside a data property, keep this line
      // Otherwise, adjust this to match your API's response format
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      console.log('Creating task with data:', taskData);
      const response = await taskApi.create(taskData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      console.log(`Updating task ID: ${id} with data:`, taskData);
      const response = await taskApi.update(id, taskData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      console.log(`Deleting task ID: ${id}`);
      const response = await taskApi.delete(id);
      return response.data;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  },
  
  uploadTaskFile: async (taskId, formData) => {
    try {
      console.log(`Uploading file for task ID: ${taskId}`);
      const response = await taskApi.uploadFile(taskId, formData);
      return response.data;
    } catch (error) {
      console.error('Error in uploadTaskFile:', error);
      throw error;
    }
  }
};

export default taskService;
