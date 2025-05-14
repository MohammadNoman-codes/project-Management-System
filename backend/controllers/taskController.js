const Task = require('../models/taskModel');

// Get all tasks (or filtered by project)
exports.getAllTasks = (req, res) => {
  const { projectId } = req.query;
  
  Task.getAll(projectId, (err, data) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching tasks',
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Get task by ID
exports.getTaskById = (req, res) => {
  const { id } = req.params;
  
  Task.getById(id, (err, data) => {
    if (err) {
      console.error(`Error fetching task with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching task with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Task with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Create new task
exports.createTask = (req, res) => {
  // Validate request
  if (!req.body.project_id || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Project ID and task name are required'
    });
  }
  
  // Create task object
  const taskData = {
    project_id: req.body.project_id,
    milestone_id: req.body.milestone_id,
    name: req.body.name,
    description: req.body.description,
    status: req.body.status || 'Not Started',
    priority: req.body.priority || 'Medium',
    start_date: req.body.start_date,
    due_date: req.body.due_date,
    progress: req.body.progress || 0,
    assigned_to: req.body.assigned_to,
    dependencies: req.body.dependencies || []
  };
  
  Task.create(taskData, (err, data) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating task',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Update task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request body cannot be empty'
    });
  }
  
  Task.update(id, req.body, (err, data) => {
    if (err) {
      console.error(`Error updating task with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating task with ID ${id}`,
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  
  Task.delete(id, (err, data) => {
    if (err) {
      console.error(`Error deleting task with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting task with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Task with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Task with ID ${id} deleted successfully`
    });
  });
};

// Upload file to task
exports.uploadTaskFile = (req, res) => {
  // This would handle file uploads
  // Requires file upload middleware like multer
  res.status(501).json({
    status: 'error',
    message: 'File upload functionality not implemented yet'
  });
};
