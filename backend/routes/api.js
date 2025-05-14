const express = require('express');
const router = express.Router();

// Import controllers
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const stakeholderController = require('../controllers/stakeholderController');
const budgetController = require('../controllers/budgetController');
const riskController = require('../controllers/riskController');

// Project routes
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.get('/projects/:id/details', projectController.getProjectWithDetails);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Task routes
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.post('/tasks/:id/upload', taskController.uploadTaskFile);

// Stakeholder routes (assuming you have these)
if (typeof stakeholderController.getAllStakeholders === 'function') {
  router.get('/projects/:projectId/stakeholders', stakeholderController.getAllStakeholders);
  router.get('/stakeholders/:id', stakeholderController.getStakeholderById);
  router.post('/projects/:projectId/stakeholders', stakeholderController.createStakeholder);
  router.put('/stakeholders/:id', stakeholderController.updateStakeholder);
  router.delete('/stakeholders/:id', stakeholderController.deleteStakeholder);
}

// Budget routes (assuming you have these)
if (typeof budgetController.getProjectBudget === 'function') {
  router.get('/projects/:projectId/budget', budgetController.getProjectBudget);
  router.post('/projects/:projectId/expenses', budgetController.addExpense);
  router.put('/expenses/:id', budgetController.updateExpense);
  router.delete('/expenses/:id', budgetController.deleteExpense);
  router.put('/expenses/:id/approve', budgetController.approveExpense);
  router.put('/expenses/:id/reject', budgetController.rejectExpense);
}

// Risk routes
router.get('/projects/:projectId/risks', riskController.getAllRisks);
router.get('/risks/:id', riskController.getRiskById);
router.post('/projects/:projectId/risks', riskController.createRisk);
router.put('/risks/:id', riskController.updateRisk);
router.delete('/risks/:id', riskController.deleteRisk);

module.exports = router;
