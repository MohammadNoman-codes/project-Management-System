const express = require('express');
const db = require('../config/dbConfig'); // Import database connection
const router = express.Router();

// Utility functions to promisify database operations
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || {});
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// GET endpoint for KPI metrics
router.get('/kpis', async (req, res) => {
    try {
        // Get count of active projects
        const activeProjectsRow = await dbGet("SELECT COUNT(*) as count FROM projects WHERE status != 'Completed'");
        const activeProjects = activeProjectsRow.count || 0;
        
        // Get count of active tasks
        const activeTasksRow = await dbGet("SELECT COUNT(*) as count FROM tasks WHERE status != 'Completed'");
        const activeTasks = activeTasksRow.count || 0;
        
        // Get total budget from all projects
        const budgetRow = await dbGet('SELECT SUM(budget_estimated) as total FROM projects');
        const totalBudget = budgetRow.total || 0;
        
        // Get count of active risks
        const activeRisksRow = await dbGet("SELECT COUNT(*) as count FROM risks WHERE status != 'Resolved' AND status != 'Closed'");
        const activeRisks = activeRisksRow.count || 0;
        
        // Get count of critical active risks
        const criticalRisksRow = await dbGet(
          "SELECT COUNT(*) as count FROM risks WHERE (status != 'Resolved' AND status != 'Closed') AND (impact >= 4 OR risk_score >= 12)"
        );
        const criticalRisks = criticalRisksRow.count || 0;
        
        // Calculate percentage of completed tasks
        const totalTasksRow = await dbGet("SELECT COUNT(*) as count FROM tasks");
        const totalTasks = totalTasksRow.count || 0;
        
        const completedTasksRow = await dbGet("SELECT COUNT(*) as count FROM tasks WHERE status = 'Completed'");
        const completedTasks = completedTasksRow.count || 0;
        const completedTaskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Calculate budget utilization
        const spentRow = await dbGet('SELECT SUM(budget_actual) as total FROM projects');
        const spentToDate = spentRow.total || 0;
        const budgetUtilizationPercentage = totalBudget > 0 ? Math.round((spentToDate / totalBudget) * 100) : 0;
        
        // Return all KPI metrics as JSON
        res.json({
            totalProjects: totalTasks > 0 ? totalTasks : activeProjects + completedTasks,
            activeProjects,
            activeProjectPercentage: totalTasks > 0 ? Math.round((activeProjects / totalTasks) * 100) : 0,
            totalTasks,
            activeTasks,
            completedTaskPercentage,
            totalBudget,
            spentToDate,
            budgetUtilizationPercentage,
            totalRisks: activeRisks,
            criticalRisks,
            criticalRiskPercentage: activeRisks > 0 ? Math.round((criticalRisks / activeRisks) * 100) : 0,
            // Add KPIs for Performance KPIs section - example values
            schedulePerformanceIndex: 1.02,
            costPerformanceIndex: 0.95,
            resourceUtilization: 82,
            budgetVariance: -2,
            qualityIndex: 88
        });
    } catch (error) {
        console.error('Error fetching KPI data:', error);
        res.status(500).json({ 
            message: 'Failed to fetch KPI data', 
            error: error.message 
        });
    }
});

// GET project type distribution
router.get('/project-types', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT 
                CASE 
                    WHEN description LIKE '%infrastructure%' THEN 'Infrastructure'
                    WHEN description LIKE '%IT%' OR description LIKE '%software%' THEN 'IT'
                    WHEN description LIKE '%public%' OR description LIKE '%park%' THEN 'Public Works'
                    WHEN description LIKE '%transport%' OR description LIKE '%road%' THEN 'Transportation'
                    ELSE 'Other'
                END as category,
                COUNT(*) as count
            FROM projects
            GROUP BY category
        `);
        
        const labels = rows.map(row => row.category);
        const data = rows.map(row => row.count);
        
        res.json({
            labels,
            data
        });
    } catch (error) {
        console.error('Error fetching project type distribution:', error);
        res.status(500).json({ 
            message: 'Failed to fetch project type distribution', 
            error: error.message 
        });
    }
});

// GET task status distribution
router.get('/task-status', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT status, COUNT(*) as count
            FROM tasks
            GROUP BY status
        `);
        
        const labels = rows.map(row => row.status);
        const data = rows.map(row => row.count);
        
        res.json({
            labels,
            data
        });
    } catch (error) {
        console.error('Error fetching task status distribution:', error);
        res.status(500).json({ 
            message: 'Failed to fetch task status distribution', 
            error: error.message 
        });
    }
});

// GET project status distribution
router.get('/project-status', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT status, COUNT(*) as count
            FROM projects
            GROUP BY status
        `);
        
        const labels = rows.map(row => row.status);
        const data = rows.map(row => row.count);
        
        res.json({
            labels,
            data
        });
    } catch (error) {
        console.error('Error fetching project status distribution:', error);
        res.status(500).json({ 
            message: 'Failed to fetch project status distribution', 
            error: error.message 
        });
    }
});

// GET projects with timeline data for overview tab
router.get('/projects-timeline', async (req, res) => {
    try {
        const projects = await dbAll(`
            SELECT 
                id, 
                title, 
                start_date, 
                end_date, 
                status, 
                completion
            FROM projects
            ORDER BY start_date DESC
            LIMIT 10
        `);
        
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects timeline:', error);
        res.status(500).json({ 
            message: 'Failed to fetch projects timeline', 
            error: error.message 
        });
    }
});

module.exports = router;