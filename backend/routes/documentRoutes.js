const express = require('express');
const router = express.Router();

// GET all documents
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GET documents endpoint (placeholder)',
    data: []
  });
});

// GET a single document
router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `GET document with ID ${req.params.id} (placeholder)`,
    data: {}
  });
});

// POST create new document
router.post('/', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'POST document created (placeholder)',
    data: req.body
  });
});

// PUT update document
router.put('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `PUT document with ID ${req.params.id} updated (placeholder)`,
    data: req.body
  });
});

// DELETE document
router.delete('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `DELETE document with ID ${req.params.id} (placeholder)`
  });
});

module.exports = router;
