const Project = require('../models/projectModel');

// Get all projects
exports.getAllProjects = (req, res) => {
  Project.getAll((err, data) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching projects',
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Get project by ID
exports.getProjectById = (req, res) => {
  const { id } = req.params;
  
  Project.getById(id, (err, data) => {
    if (err) {
      console.error(`Error fetching project with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching project with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Project with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Create new project
exports.createProject = (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).json({
      status: 'fail',
      message: 'Project title is required'
    });
  }
  
  // Create project object
  const projectData = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'Not Started',
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    budget_estimated: req.body.budget_estimated || 0,
    budget_actual: req.body.budget_actual || 0,
    budget_currency: req.body.budget_currency || 'BHD',
    objectives: req.body.objectives,
    scope: req.body.scope
  };
  
  Project.create(projectData, (err, data) => {
    if (err) {
      console.error('Error creating project:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating project',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Create new project with milestones and tasks
exports.createProjectWithDetails = (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).json({
      status: 'fail',
      message: 'Project title is required'
    });
  }
  
  // Extract project data
  const projectData = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'Not Started',
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    budget_estimated: req.body.budget_estimated || 0,
    budget_actual: req.body.budget_actual || 0,
    budget_currency: req.body.budget_currency || 'BHD',
    objectives: req.body.objectives,
    scope: req.body.scope
  };
  
  // Extract milestones and tasks
  const milestones = req.body.milestones || [];
  
  // Create project with all details
  Project.createWithDetails(projectData, milestones, (err, data) => {
    if (err) {
      console.error('Error creating project with details:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating project with details',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Update project
exports.updateProject = (req, res) => {
  const { id } = req.params;
  
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request body cannot be empty'
    });
  }
  
  Project.update(id, req.body, (err, data) => {
    if (err) {
      console.error(`Error updating project with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating project with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Project with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Delete project
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  
  Project.delete(id, (err, data) => {
    if (err) {
      console.error(`Error deleting project with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting project with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Project with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Project with ID ${id} deleted successfully`
    });
  });
};

// Get project with details
exports.getProjectWithDetails = (req, res) => {
  const { id } = req.params;
  
  Project.getWithDetails(id, (err, data) => {
    if (err) {
      console.error(`Error fetching details for project with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching details for project with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Project with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Add a team member to a project
exports.addTeamMember = (req, res) => {
  const { id } = req.params;
  const teamMemberData = req.body;
  
  // Validate request body
  if (!teamMemberData.name || !teamMemberData.role) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name and role are required fields'
    });
  }
  
  // Call the model method to add the team member
  Project.addTeamMember(id, teamMemberData, (err, data) => {
    if (err) {
      console.error(`Error adding team member to project ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error adding team member to project ${id}`,
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Remove a team member from a project
exports.removeTeamMember = (req, res) => {
  const { id, memberId } = req.params;
  
  // Call the model method to remove the team member
  Project.removeTeamMember(id, memberId, (err, data) => {
    if (err) {
      console.error(`Error removing team member ${memberId} from project ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error removing team member from project`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Team member with ID ${memberId} not found in project ${id}`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Team member removed successfully`
    });
  });
};
