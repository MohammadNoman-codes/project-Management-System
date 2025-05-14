const express = require('express');
const router = express.Router();

// GET all resources
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GET resources endpoint (placeholder)',
    data: []
  });
});

// GET a single resource
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `GET resource with ID ${req.params.id} (placeholder)`,
    data: {}
  });
});

// POST create new resource
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST resource created (placeholder)',
    data: req.body
  });
});

// PUT update resource
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT resource with ID ${req.params.id} updated (placeholder)`,
    data: req.body
  });
});

// DELETE resource
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `DELETE resource with ID ${req.params.id} (placeholder)`
  });
});

module.exports = router;
