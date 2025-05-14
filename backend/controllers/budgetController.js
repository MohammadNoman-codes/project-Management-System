const Budget = require('../models/budgetModel');

// Get project budget
exports.getProjectBudget = (req, res) => {
  const { projectId } = req.params;
  
  Budget.getByProjectId(projectId, (err, data) => {
    if (err) {
      console.error(`Error fetching budget for project ID ${projectId}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching budget data`,
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Add expense
exports.addExpense = (req, res) => {
  const { projectId } = req.params;
  
  // Validate request
  if (!req.body.amount || !req.body.category || !req.body.description) {
    return res.status(400).json({
      status: 'fail',
      message: 'Amount, category, and description are required fields'
    });
  }
  
  const expenseData = {
    project_id: projectId,
    ...req.body,
    status: req.body.status || 'Pending'
  };
  
  Budget.addExpense(expenseData, (err, data) => {
    if (err) {
      console.error('Error adding expense:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error adding expense',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Update expense
exports.updateExpense = (req, res) => {
  const { id } = req.params;
  
  Budget.updateExpense(id, req.body, (err, data) => {
    if (err) {
      console.error(`Error updating expense with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating expense`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Expense with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Delete expense
exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  
  Budget.deleteExpense(id, (err, data) => {
    if (err) {
      console.error(`Error deleting expense with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting expense`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Expense with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `Expense deleted successfully`
    });
  });
};

// Approve expense
exports.approveExpense = (req, res) => {
  const { id } = req.params;
  
  Budget.updateExpenseStatus(id, 'Approved', (err, data) => {
    if (err) {
      console.error(`Error approving expense with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error approving expense`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Expense with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Reject expense
exports.rejectExpense = (req, res) => {
  const { id } = req.params;
  
  Budget.updateExpenseStatus(id, 'Rejected', (err, data) => {
    if (err) {
      console.error(`Error rejecting expense with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error rejecting expense`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `Expense with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};
