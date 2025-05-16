const Risk = require('../models/riskModel');

// Get all risks for a project
exports.getAllRisks = (req, res) => {
  const { projectId } = req.params;
  
  Risk.getAll(projectId, (err, data) => {
    if (err) {
      console.error('Error fetching risks:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching risks',
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Get risk by ID
exports.getRiskById = (req, res) => {
  const { id } = req.params;
  
  Risk.getById(id, (err, data) => {
    if (err) {
      console.error(`Error fetching risk with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching risk with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Risk with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Create new risk
exports.createRisk = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.project_id) {
    return res.status(400).json({
      status: 'fail',
      message: 'Risk title and project ID are required'
    });
  }
  
  // Create risk object from request body
  const riskData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    probability: req.body.probability,
    impact: req.body.impact,
    risk_score: req.body.risk_score || (req.body.probability * req.body.impact),
    status: req.body.status || 'Identified',
    mitigation_plan: req.body.mitigation_plan,
    contingency_plan: req.body.contingency_plan,
    owner_id: req.body.owner_id,
    identified_date: req.body.identified_date,
    review_date: req.body.review_date,
    project_id: req.body.project_id
  };
  
  Risk.create(riskData, (err, data) => {
    if (err) {
      console.error('Error creating risk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating risk',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Update risk
exports.updateRisk = (req, res) => {
  const { id } = req.params;
  
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request body cannot be empty'
    });
  }
  
  // Update risk object from request body
  const riskData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    probability: req.body.probability,
    impact: req.body.impact,
    risk_score: req.body.risk_score || (req.body.probability * req.body.impact),
    status: req.body.status,
    mitigation_plan: req.body.mitigation_plan,
    contingency_plan: req.body.contingency_plan,
    owner_id: req.body.owner_id,
    identified_date: req.body.identified_date,
    review_date: req.body.review_date,
    project_id: req.body.project_id
  };
  
  Risk.update(id, riskData, (err, data) => {
    if (err) {
      console.error(`Error updating risk with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating risk with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Risk with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Delete risk
exports.deleteRisk = (req, res) => {
  const { id } = req.params;
  
  Risk.delete(id, (err, data) => {
    if (err) {
      console.error(`Error deleting risk with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting risk with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Risk with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Risk with ID ${id} deleted successfully`
    });
  });
};
