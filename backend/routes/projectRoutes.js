const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET all projects
router.get('/', projectController.getAllProjects);

// GET a single project
router.get('/:id', projectController.getProjectById);

// GET project details
router.get('/:id/details', projectController.getProjectWithDetails);

// POST create new project
router.post('/', projectController.createProject);

// POST create new project with milestones and tasks
router.post('/with-details', projectController.createProjectWithDetails);

// PUT update project
router.put('/:id', projectController.updateProject);

// DELETE project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
