const express = require('express');
const router = express.Router();

// GET all stakeholders
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GET stakeholders endpoint (placeholder)',
    data: []
  });
});

// GET a single stakeholder
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `GET stakeholder with ID ${req.params.id} (placeholder)`,
    data: {}
  });
});

// POST create new stakeholder
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST stakeholder created (placeholder)',
    data: req.body
  });
});

// PUT update stakeholder
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT stakeholder with ID ${req.params.id} updated (placeholder)`,
    data: req.body
  });
});

// DELETE stakeholder
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `DELETE stakeholder with ID ${req.params.id} (placeholder)`
  });
});

module.exports = router;
