const Stakeholder = require('../models/stakeholderModel');

exports.getAllStakeholders = (req, res) => {
  const { projectId } = req.params;
  
  Stakeholder.getAll(projectId, (err, data) => {
    if (err) {
      console.error('Error fetching stakeholders:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching stakeholders',
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

exports.getStakeholderById = (req, res) => {
  const { id } = req.params;
  
  Stakeholder.getById(id, (err, data) => {
    if (err) {
      console.error(`Error fetching stakeholder with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching stakeholder with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Stakeholder with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

exports.createStakeholder = (req, res) => {
  const { projectId } = req.params;
  
  // Validate request
  if (!req.body.name || !req.body.role) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name and role are required fields'
    });
  }
  
  // Create stakeholder object with project ID from params
  const stakeholderData = {
    project_id: projectId,
    ...req.body
  };
  
  Stakeholder.create(stakeholderData, (err, data) => {
    if (err) {
      console.error('Error creating stakeholder:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating stakeholder',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

exports.updateStakeholder = (req, res) => {
  const { id } = req.params;
  
  Stakeholder.update(id, req.body, (err, data) => {
    if (err) {
      console.error(`Error updating stakeholder with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating stakeholder with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Stakeholder with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

exports.deleteStakeholder = (req, res) => {
  const { id } = req.params;
  
  Stakeholder.delete(id, (err, data) => {
    if (err) {
      console.error(`Error deleting stakeholder with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting stakeholder with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Stakeholder with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Stakeholder with ID ${id} deleted successfully`
    });
  });
};
