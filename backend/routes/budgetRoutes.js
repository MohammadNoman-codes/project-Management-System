const express = require('express');
const router = express.Router();

// GET budget details
router.get('/:projectId', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `GET budget for project with ID ${req.params.projectId} (placeholder)`,
    data: {}
  });
});

// POST add expense
router.post('/expenses', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST expense created (placeholder)',
    data: req.body
  });
});

// PUT approve expense
router.put('/expenses/:id/approve', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT approve expense with ID ${req.params.id} (placeholder)`
  });
});

// PUT reject expense
router.put('/expenses/:id/reject', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT reject expense with ID ${req.params.id} (placeholder)`
  });
});

// POST budget change request
router.post('/changes', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST budget change request created (placeholder)',
    data: req.body
  });
});

// PUT approve budget change
router.put('/changes/:id/approve', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT approve budget change with ID ${req.params.id} (placeholder)`
  });
});

// PUT reject budget change
router.put('/changes/:id/reject', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT reject budget change with ID ${req.params.id} (placeholder)`
  });
});

module.exports = router;
