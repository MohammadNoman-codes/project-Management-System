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
  const { projectId } = req.params;
  
  // Validate request
  if (!req.body.title) {
    return res.status(400).json({
      status: 'fail',
      message: 'Risk title is required'
    });
  }
  
  // Create risk object
  const riskData = {
    project_id: projectId,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    probability: req.body.probability,
    impact: req.body.impact,
    risk_score: req.body.probability * req.body.impact,
    status: req.body.status || 'Identified',
    owner_id: req.body.owner_id,
    owner_name: req.body.owner_name,
    identified_date: req.body.identified_date,
    mitigation_plan: req.body.mitigation_plan,
    contingency_plan: req.body.contingency_plan,
    triggers: JSON.stringify(req.body.triggers || []),
    review_date: req.body.review_date
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
  
  // Update risk score if probability or impact were updated
  let riskScore = req.body.risk_score;
  if (req.body.probability !== undefined && req.body.impact !== undefined) {
    riskScore = req.body.probability * req.body.impact;
  }
  
  // Create risk object with updated data
  const riskData = {
    ...req.body,
    risk_score: riskScore,
    triggers: req.body.triggers ? JSON.stringify(req.body.triggers) : undefined
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
