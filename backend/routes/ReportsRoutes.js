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
            message: 'Failed to fetch milestone status', 
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

// GET financial summary data
router.get('/financial-summary', async (req, res) => {
    try {
        // Get total budget from all projects
        const budgetRow = await dbGet('SELECT SUM(budget_estimated) as total FROM projects');
        const totalBudget = budgetRow.total || 0;
        
        // Get total spent from expenses
        const spentRow = await dbGet('SELECT SUM(amount) as total FROM expenses WHERE status = "Approved"');
        const totalSpent = spentRow.total || 0;
        
        // Get committed funds (pending expenses)
        const committedRow = await dbGet('SELECT SUM(amount) as total FROM expenses WHERE status = "Pending"');
        const totalCommitted = committedRow.total || 0;
        
        // Calculate remaining budget
        const totalRemaining = totalBudget - totalSpent - totalCommitted;
        
        // Return financial summary data
        res.json({
            totalBudget,
            totalSpent,
            totalCommitted,
            totalRemaining,
            budgetUtilizationPercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
        });
    } catch (error) {
        console.error('Error fetching financial summary:', error);
        res.status(500).json({ 
            message: 'Failed to fetch financial summary', 
            error: error.message 
        });
    }
});

// GET expenses trend data (monthly)
router.get('/expenses-trend', async (req, res) => {
    try {
        const expenses = await dbAll(`
            SELECT 
                strftime('%m', date) as month,
                strftime('%Y', date) as year,
                SUM(amount) as amount
            FROM expenses
            WHERE status = 'Approved'
            GROUP BY year, month
            ORDER BY year, month
            LIMIT 12
        `);
        
        // Format month names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const expensesByMonth = expenses.map(row => ({
            month: monthNames[parseInt(row.month) - 1],
            year: row.year,
            amount: row.amount
        }));
        
        res.json({
            expensesByMonth
        });
    } catch (error) {
        console.error('Error fetching expenses trend:', error);
        res.status(500).json({ 
            message: 'Failed to fetch expenses trend', 
            error: error.message 
        });
    }
});

// GET expenses by category
router.get('/expenses-by-category', async (req, res) => {
    try {
        const categories = await dbAll(`
            SELECT 
                category,
                SUM(amount) as amount
            FROM expenses
            WHERE status = 'Approved'
            GROUP BY category
            ORDER BY amount DESC
        `);
        
        res.json({
            expensesByCategory: categories
        });
    } catch (error) {
        console.error('Error fetching expenses by category:', error);
        res.status(500).json({ 
            message: 'Failed to fetch expenses by category', 
            error: error.message 
        });
    }
});

// GET budget variance by project
router.get('/budget-variance', async (req, res) => {
    try {
        const projects = await dbAll(`
            SELECT 
                p.id,
                p.title as project,
                p.budget_estimated as budget,
                p.budget_actual as spent,
                (p.budget_actual - p.budget_estimated) / p.budget_estimated * 100 as variance
            FROM projects p
            WHERE p.budget_estimated > 0
            ORDER BY variance DESC
        `);
        
        res.json({
            projectBudgetVariance: projects
        });
    } catch (error) {
        console.error('Error fetching budget variance:', error);
        res.status(500).json({ 
            message: 'Failed to fetch budget variance', 
            error: error.message 
        });
    }
});

// GET budget forecast data (quarterly)
router.get('/budget-forecast', async (req, res) => {
    try {
        // This would typically come from a more complex forecasting algorithm
        // For now, we'll create some sample data based on historical expenses
        
        const currentYear = new Date().getFullYear();
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        
        // Get actual quarterly expenses for the year
        const actualExpenses = await dbAll(`
            SELECT 
                CASE
                    WHEN strftime('%m', date) BETWEEN '01' AND '03' THEN 'Q1'
                    WHEN strftime('%m', date) BETWEEN '04' AND '06' THEN 'Q2'
                    WHEN strftime('%m', date) BETWEEN '07' AND '09' THEN 'Q3'
                    ELSE 'Q4'
                END as quarter,
                strftime('%Y', date) as year,
                SUM(amount) as amount
            FROM expenses
            WHERE status = 'Approved'
            AND strftime('%Y', date) = ?
            GROUP BY quarter, year
            ORDER BY year, quarter
        `, [currentYear.toString()]);
        
        // Create a map of actual expenses by quarter
        const actualByQuarter = {};
        actualExpenses.forEach(row => {
            actualByQuarter[row.quarter] = row.amount;
        });
        
        // Generate forecast data with some variation from actual
        const forecastData = quarters.map(quarter => {
            const actual = actualByQuarter[quarter] || 0;
            // Forecast is actual plus 10-20% for future quarters
            const forecast = quarter > quarters[new Date().getMonth() / 3 | 0] 
                ? actual * (1 + (Math.random() * 0.1 + 0.1)) 
                : actual;
            
            return {
                quarter,
                year: currentYear,
                forecast: Math.round(forecast),
                actual
            };
        });
        
        res.json({
            forecastByQuarter: forecastData
        });
    } catch (error) {
        console.error('Error fetching budget forecast:', error);
        res.status(500).json({ 
            message: 'Failed to fetch budget forecast', 
            error: error.message 
        });
    }
});

// GET risk severity distribution
router.get('/risk-severity', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT 
                CASE
                    WHEN impact >= 4 OR risk_score >= 12 THEN 'Critical'
                    WHEN impact = 3 OR risk_score >= 8 THEN 'High'
                    WHEN impact = 2 OR risk_score >= 4 THEN 'Medium'
                    ELSE 'Low'
                END as severity,
                COUNT(*) as count
            FROM risks
            GROUP BY severity
            ORDER BY 
                CASE severity
                    WHEN 'Critical' THEN 1
                    WHEN 'High' THEN 2
                    WHEN 'Medium' THEN 3
                    ELSE 4
                END
        `);
        
        res.json({
            labels: rows.map(row => row.severity),
            counts: rows.map(row => row.count)
        });
    } catch (error) {
        console.error('Error fetching risk severity distribution:', error);
        res.status(500).json({ 
            message: 'Failed to fetch risk severity distribution', 
            error: error.message 
        });
    }
});

// GET risk by category
router.get('/risk-categories', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT 
                category,
                COUNT(*) as count
            FROM risks
            GROUP BY category
            ORDER BY count DESC
        `);
        
        res.json({
            categories: rows
        });
    } catch (error) {
        console.error('Error fetching risk categories:', error);
        res.status(500).json({ 
            message: 'Failed to fetch risk categories', 
            error: error.message 
        });
    }
});

// GET risk trends
router.get('/risk-trends', async (req, res) => {
    try {
        // Get new risks by month
        const newRisks = await dbAll(`
            SELECT 
                strftime('%m', identified_date) as month,
                strftime('%Y', identified_date) as year,
                COUNT(*) as count
            FROM risks
            GROUP BY year, month
            ORDER BY year, month
            LIMIT 12
        `);
        
        // Get closed risks by month
        const closedRisks = await dbAll(`
            SELECT 
                strftime('%m', updated_at) as month,
                strftime('%Y', updated_at) as year,
                COUNT(*) as count
            FROM risks
            WHERE status = 'Resolved' OR status = 'Closed'
            GROUP BY year, month
            ORDER BY year, month
            LIMIT 12
        `);
        
        // Format month names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Create an array of the last 12 months
        const today = new Date();
        const months = Array.from({length: 12}, (_, i) => {
            const d = new Date(today);
            d.setMonth(d.getMonth() - i);
            return {
                month: monthNames[d.getMonth()],
                year: d.getFullYear().toString()
            };
        }).reverse();
        
        // Map the data to the months
        const newRisksMap = {};
        newRisks.forEach(row => {
            const monthIndex = parseInt(row.month) - 1;
            const key = `${monthNames[monthIndex]} ${row.year}`;
            newRisksMap[key] = row.count;
        });
        
        const closedRisksMap = {};
        closedRisks.forEach(row => {
            const monthIndex = parseInt(row.month) - 1;
            const key = `${monthNames[monthIndex]} ${row.year}`;
            closedRisksMap[key] = row.count;
        });
        
        // Generate the final data structure
        const labels = months.map(m => `${m.month} ${m.year}`);
        const newRisksData = labels.map(label => newRisksMap[label] || 0);
        const closedRisksData = labels.map(label => closedRisksMap[label] || 0);
        
        res.json({
            labels,
            datasets: [
                {
                    label: 'New Risks',
                    data: newRisksData
                },
                {
                    label: 'Closed Risks',
                    data: closedRisksData
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching risk trends:', error);
        res.status(500).json({ 
            message: 'Failed to fetch risk trends', 
            error: error.message 
        });
    }
});

// GET risk exposure by project
router.get('/risk-exposure', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT 
                p.id,
                p.title,
                COUNT(r.id) as risk_count,
                AVG(r.risk_score) as avg_risk_score,
                SUM(CASE WHEN r.impact >= 4 OR r.risk_score >= 12 THEN 1 ELSE 0 END) as critical_risks
            FROM projects p
            LEFT JOIN risks r ON p.id = r.project_id
            GROUP BY p.id, p.title
            ORDER BY avg_risk_score DESC
        `);
        
        res.json({
            projectRiskExposure: rows
        });
    } catch (error) {
        console.error('Error fetching risk exposure by project:', error);
        res.status(500).json({ 
            message: 'Failed to fetch risk exposure by project', 
            error: error.message 
        });
    }
});

// GET top risks
router.get('/top-risks', async (req, res) => {
    try {
        const risks = await dbAll(`
            SELECT 
                r.id,
                r.title,
                r.project_id as projectId,
                r.category,
                CASE
                    WHEN r.impact >= 4 OR r.risk_score >= 12 THEN 'Critical'
                    WHEN r.impact = 3 OR r.risk_score >= 8 THEN 'High'
                    WHEN r.impact = 2 OR r.risk_score >= 4 THEN 'Medium'
                    ELSE 'Low'
                END as severity,
                r.status,
                u.name as owner,
                r.review_date as dueDate
            FROM risks r
            LEFT JOIN users u ON r.owner_id = u.id
            ORDER BY 
                CASE 
                    WHEN r.impact >= 4 OR r.risk_score >= 12 THEN 1
                    WHEN r.impact = 3 OR r.risk_score >= 8 THEN 2
                    WHEN r.impact = 2 OR r.risk_score >= 4 THEN 3
                    ELSE 4
                END
            LIMIT 10
        `);
        
        res.json(risks);
    } catch (error) {
        console.error('Error fetching top risks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch top risks', 
            error: error.message 
        });
    }
});

// GET risk summary data
router.get('/risk-summary', async (req, res) => {
    try {
        // Get total risks count
        const totalRisksRow = await dbGet('SELECT COUNT(*) as count FROM risks');
        const totalRisks = totalRisksRow.count || 0;
        
        // Get active risks count
        const activeRisksRow = await dbGet("SELECT COUNT(*) as count FROM risks WHERE status != 'Resolved' AND status != 'Closed'");
        const activeRisks = activeRisksRow.count || 0;
        
        // Get critical risks count
        const criticalRisksRow = await dbGet("SELECT COUNT(*) as count FROM risks WHERE (impact >= 4 OR risk_score >= 12) AND status != 'Resolved' AND status != 'Closed'");
        const criticalRisks = criticalRisksRow.count || 0;
        
        // Get mitigated risks count
        const mitigatedRisksRow = await dbGet("SELECT COUNT(*) as count FROM risks WHERE status = 'Resolved' OR status = 'Closed'");
        const mitigatedRisks = mitigatedRisksRow.count || 0;
        
        res.json({
            totalRisks,
            activeRisks,
            criticalRisks,
            mitigatedRisks
        });
    } catch (error) {
        console.error('Error fetching risk summary:', error);
        res.status(500).json({ 
            message: 'Failed to fetch risk summary', 
            error: error.message 
        });
    }
});

module.exports = router;