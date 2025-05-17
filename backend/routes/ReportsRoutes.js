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

// GET project health data
router.get('/project-health', async (req, res) => {
    try {
        const projects = await dbAll(`
            SELECT 
                p.id, 
                p.title, 
                p.status,
                p.completion,
                p.budget_estimated,
                p.budget_actual,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Completed') as completed_tasks
            FROM projects p
            ORDER BY p.start_date DESC
            LIMIT 10
        `);
        
        // Calculate health metrics for each project
        const projectHealthData = projects.map(project => {
            // Timeline adherence (simplified calculation)
            const timelineAdherence = Math.min(100, Math.max(60, 
                100 - Math.abs(project.completion - (project.completed_tasks / Math.max(project.total_tasks, 1)) * 100))
            );
            
            // Budget adherence
            const budgetEstimated = project.budget_estimated || 0;
            const budgetActual = project.budget_actual || 0;
            const budgetAdherence = budgetEstimated > 0 
                ? Math.min(100, Math.max(60, 100 - ((Math.abs(budgetActual - (budgetEstimated * project.completion / 100)) / budgetEstimated) * 100)))
                : 80; // Default if no budget data
            
            // Task efficiency
            const taskEfficiency = project.total_tasks > 0 
                ? (project.completed_tasks / project.total_tasks) * 100 
                : 0;
            
            // Quality score (placeholder - would need real quality metrics)
            const qualityScore = Math.floor(Math.random() * 33) + 65;
            
            // Overall health
            const overallHealth = Math.round((timelineAdherence + budgetAdherence + taskEfficiency + qualityScore) / 4);
            
            return {
                id: project.id,
                title: project.title,
                status: project.status,
                completion: project.completion,
                totalTasks: project.total_tasks,
                completedTasks: project.completed_tasks,
                timelineAdherence,
                budgetAdherence,
                taskEfficiency,
                qualityScore,
                overallHealth
            };
        });
        
        res.json(projectHealthData);
    } catch (error) {
        console.error('Error fetching project health data:', error);
        res.status(500).json({ 
            message: 'Failed to fetch project health data', 
            error: error.message 
        });
    }
});

// GET project task completion data
router.get('/task-completion', async (req, res) => {
    try {
        const projects = await dbAll(`
            SELECT 
                p.id, 
                p.title,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
                (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Completed') as completed_tasks
            FROM projects p
            ORDER BY p.completion DESC
            LIMIT 6
        `);
        
        res.json({
            labels: projects.map(p => p.title),
            datasets: [
                {
                    label: 'Completed Tasks',
                    data: projects.map(p => p.completed_tasks)
                },
                {
                    label: 'Total Tasks',
                    data: projects.map(p => p.total_tasks)
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching task completion data:', error);
        res.status(500).json({ 
            message: 'Failed to fetch task completion data', 
            error: error.message 
        });
    }
});

// GET milestone status data
router.get('/milestone-status', async (req, res) => {
    try {
        const statusRows = await dbAll(`
            SELECT 
                status, 
                COUNT(*) as count
            FROM milestones
            GROUP BY status
        `);
        
        // Ensure all expected statuses are present, even if count is 0
        const expectedStatuses = ['Not Started', 'In Progress', 'Completed', 'Delayed'];
        const statusMap = statusRows.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
        }, {});
        
        const labels = [];
        const data = [];
        
        expectedStatuses.forEach(status => {
            labels.push(status);
            data.push(statusMap[status] || 0);
        });
        
        res.json({
            labels,
            datasets: [
                {
                    label: 'Milestone Status',
                    data
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching milestone status data:', error);
        res.status(500).json({ 
            message: 'Failed to fetch milestone status data', 
            error: error.message 
        });
    }
});

// GET upcoming tasks data
router.get('/upcoming-tasks', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const tasks = await dbAll(`
            SELECT 
                t.id,
                t.name,
                p.title as project,
                p.id as projectId,
                t.due_date as dueDate,
                t.priority,
                u.name as assignee,
                t.status
            FROM tasks t
            JOIN projects p ON t.project_id = p.id
            LEFT JOIN users u ON t.assigned_to = u.id
            WHERE t.status != 'Completed'
            AND t.due_date >= ?
            ORDER BY t.due_date ASC
            LIMIT 10
        `, [today]);
        
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch upcoming tasks', 
            error: error.message 
        });
    }
});

// GET completed tasks data
router.get('/completed-tasks', async (req, res) => {
    try {
        const tasks = await dbAll(`
            SELECT 
                t.id,
                t.name,
                p.title as project,
                p.id as projectId,
                t.updated_at as completedDate,
                u.name as completedBy,
                t.status
            FROM tasks t
            JOIN projects p ON t.project_id = p.id
            LEFT JOIN users u ON t.assigned_to = u.id
            WHERE t.status = 'Completed'
            ORDER BY t.updated_at DESC
            LIMIT 10
        `);
        
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch completed tasks', 
            error: error.message 
        });
    }
});

module.exports = router;