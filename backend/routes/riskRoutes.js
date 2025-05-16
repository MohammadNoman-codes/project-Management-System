const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');

// Get all risks (with optional project filter)
router.get('/', riskController.getAllRisks);

// Get all risks for a specific project
router.get('/project/:projectId', riskController.getAllRisks);

// Get risk by ID
router.get('/:id', riskController.getRiskById);

// Create new risk
router.post('/', riskController.createRisk);

// Create new risk for a specific project
router.post('/project/:projectId', riskController.createRisk);

// Update risk
router.put('/:id', riskController.updateRisk);

// Delete risk
router.delete('/:id', riskController.deleteRisk);

module.exports = router;
