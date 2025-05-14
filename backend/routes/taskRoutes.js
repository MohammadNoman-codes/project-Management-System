const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Get all tasks (or filtered by project)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GET tasks endpoint (placeholder)',
    data: []
  });
});

// Get task by ID
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `GET task with ID ${req.params.id} (placeholder)`,
    data: {}
  });
});

// Create new task
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST task created (placeholder)',
    data: req.body
  });
});

// Update task
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT task with ID ${req.params.id} updated (placeholder)`,
    data: req.body
  });
});

// Delete task
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `DELETE task with ID ${req.params.id} (placeholder)`
  });
});

// Upload file to task
router.post('/:id/files', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: `POST file uploaded to task with ID ${req.params.id} (placeholder)`
  });
});

module.exports = router;
