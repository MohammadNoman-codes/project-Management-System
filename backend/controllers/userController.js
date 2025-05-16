const User = require('../models/userModel');

// Get all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching users',
        error: err.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  
  User.getById(id, (err, data) => {
    if (err) {
      console.error(`Error fetching user with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error fetching user with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Create new user
exports.createUser = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      status: 'fail',
      message: 'User name and email are required'
    });
  }
  
  // Create user object
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    department: req.body.department,
    avatar: req.body.avatar
  };
  
  User.create(userData, (err, data) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Error creating user',
        error: err.message
      });
    }
    
    res.status(201).json({
      status: 'success',
      data
    });
  });
};

// Update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request body cannot be empty'
    });
  }
  
  User.update(id, req.body, (err, data) => {
    if (err) {
      console.error(`Error updating user with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error updating user with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data) {
      return res.status(404).json({
        status: 'fail',
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  
  User.delete(id, (err, data) => {
    if (err) {
      console.error(`Error deleting user with ID ${id}:`, err);
      return res.status(500).json({
        status: 'error',
        message: `Error deleting user with ID ${id}`,
        error: err.message
      });
    }
    
    if (!data.deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `User with ID ${id} deleted successfully`
    });
  });
};
