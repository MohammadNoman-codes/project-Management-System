const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

// Utility functions to promisify database operations
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// GET dashboard KPI data
router.get('/kpis', async (req, res) => {
  try {
    // Count active projects
    const activeProjectsRow = await dbGet('SELECT COUNT(*) as count FROM projects WHERE status != "Completed"');
    const activeProjects = activeProjectsRow.count;
    
    // Calculate task completion rate
    const taskCompletionRow = await dbAll(
      `SELECT 
        (SELECT COUNT(*) FROM tasks WHERE status = 'Completed') as completed,
        COUNT(*) as total 
       FROM tasks`
    );
    const row = taskCompletionRow[0];
    const taskCompletionRate = row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0;
    
    // Calculate on-time delivery rate
    const deliveryRateRow = await dbAll(
      `SELECT 
        COUNT(*) as onTime,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Completed') as total
       FROM tasks 
       WHERE status = 'Completed'
       AND due_date >= updated_at`
    );
    const deliveryRow = deliveryRateRow[0];
    const onTimeDeliveryRate = deliveryRow.total > 0 ? Math.round((deliveryRow.onTime / deliveryRow.total) * 100) : 0;
    
    // Count active risks
    const activeRisksRow = await dbGet(
      `SELECT COUNT(*) as count 
       FROM tasks 
       WHERE status != 'Completed'
       AND (priority = 'High' OR priority = 'Critical')`
    );
    const activeRisks = activeRisksRow.count;
    
    // Count critical risks
    const criticalRisksRow = await dbGet(
      `SELECT COUNT(*) as count 
       FROM tasks 
       WHERE status != 'Completed'
       AND priority = 'Critical'`
    );
    const criticalRisks = criticalRisksRow.count;
    
    // Calculate total budget
    const totalBudgetRow = await dbGet('SELECT SUM(budget_estimated) as total FROM projects');
    // consoling the total budget
    //console.log('Total Budget:', totalBudgetRow.total);
    const totalBudget = totalBudgetRow.total || 0;
    
    // Calculate spent to date
    const spentToDateRow = await dbGet('SELECT SUM(budget_actual) as total FROM projects');
    const spentToDate = spentToDateRow.total || 0;
    
    // Calculate forecasted amount
    const forecastedAmount = Math.round(totalBudget * 0.93); // Forecasted as 93% of total budget
    
    res.status(200).json({
      activeProjects,
      taskCompletionRate,
      onTimeDeliveryRate,
      activeRisks,
      criticalRisks,
      totalBudget,
      spentToDate,
      forecastedAmount
    });
  } catch (err) {
    console.error('Error fetching dashboard KPIs:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard KPIs' });
  }
});

// GET project status distribution
router.get('/projects/status', async (req, res) => {
  try {
    const rows = await dbAll('SELECT status, COUNT(*) as count FROM projects GROUP BY status');
    
    // Transform to expected format
    const labels = [];
    const data = [];
    
    rows.forEach(row => {
      labels.push(row.status);
      data.push(row.count);
    });
    
    res.status(200).json({
      labels,
      data
    });
  } catch (err) {
    console.error('Error fetching project status distribution:', err);
    res.status(500).json({ error: 'Failed to fetch project status distribution' });
  }
});

// GET task status distribution
router.get('/tasks/status', async (req, res) => {
  try {
    const rows = await dbAll('SELECT status, COUNT(*) as count FROM tasks GROUP BY status');
    
    // Transform to expected format
    const labels = [];
    const data = [];
    
    rows.forEach(row => {
      labels.push(row.status);
      data.push(row.count);
    });
    
    res.status(200).json({
      labels,
      data
    });
  } catch (err) {
    console.error('Error fetching task status distribution:', err);
    res.status(500).json({ error: 'Failed to fetch task status distribution' });
  }
});

// GET budget allocation
router.get('/budget/allocation', async (req, res) => {
  try {
    const rows = await dbAll(
      `SELECT 
         CASE 
           WHEN description LIKE '%infrastructure%' THEN 'Infrastructure'
           WHEN description LIKE '%IT%' OR description LIKE '%software%' THEN 'IT'
           WHEN description LIKE '%public%' OR description LIKE '%park%' THEN 'Public Works'
           WHEN description LIKE '%transport%' OR description LIKE '%road%' THEN 'Transportation'
           ELSE 'Other'
         END as category,
         SUM(budget_estimated) as total
       FROM projects
       GROUP BY category`
    );
    
    // Calculate total budget
    const totalBudget = rows.reduce((sum, row) => sum + row.total, 0);
    
    // Transform to expected format with percentages
    const labels = [];
    const data = [];
    
    rows.forEach(row => {
      labels.push(row.category);
      // Calculate percentage of total budget
      const percentage = totalBudget > 0 ? Math.round((row.total / totalBudget) * 100) : 0;
      data.push(percentage);
    });
    
    res.status(200).json({
      labels,
      data
    });
  } catch (err) {
    console.error('Error fetching budget allocation:', err);
    res.status(500).json({ error: 'Failed to fetch budget allocation' });
  }
});

// GET risk distribution
router.get('/risks/distribution', async (req, res) => {
  try {
    const rows = await dbAll(
      `SELECT 
         priority as level,
         COUNT(*) as count
       FROM tasks
       WHERE status != 'Completed'
       GROUP BY priority
       ORDER BY 
         CASE priority
           WHEN 'Low' THEN 1
           WHEN 'Medium' THEN 2
           WHEN 'High' THEN 3
           WHEN 'Critical' THEN 4
           ELSE 5
         END`
    );
    
    // Transform to expected format
    const labels = [];
    const data = [];
    
    rows.forEach(row => {
      labels.push(row.level);
      data.push(row.count);
    });
    
    res.status(200).json({
      labels,
      data
    });
  } catch (err) {
    console.error('Error fetching risk distribution:', err);
    res.status(500).json({ error: 'Failed to fetch risk distribution' });
  }
});

// GET top projects by budget variance
router.get('/projects/budget-variance', async (req, res) => {
  try {
    const rows = await dbAll(
      `SELECT 
         p.id,
         p.title as name,
         p.budget_estimated as budget,
         p.budget_actual as actual,
         p.completion,
         p.status
       FROM projects p
       ORDER BY ABS(p.budget_actual - p.budget_estimated) DESC
       LIMIT 5`
    );
    
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching top projects by budget variance:', err);
    res.status(500).json({ error: 'Failed to fetch top projects by budget variance' });
  }
});

// GET recent notifications
router.get('/notifications', async (req, res) => {
  try {
    // Find over-budget projects
    const overBudgetRows = await dbAll(
      `SELECT 
         id,
         title,
         budget_estimated,
         budget_actual
       FROM projects
       WHERE budget_actual > budget_estimated
       ORDER BY (budget_actual / budget_estimated) DESC
       LIMIT 2`
    );
    
    const budgetAlerts = overBudgetRows.map((row, index) => ({
      id: 1 + index,
      type: 'warning',
      title: 'Budget Alert:',
      message: `${row.title} is ${Math.round((row.budget_actual - row.budget_estimated) / row.budget_estimated * 100)}% over budget.`,
      timestamp: new Date(Date.now() - (3600000 * (index + 1)))
    }));
    
    // Find recently completed milestones
    const milestoneRows = await dbAll(
      `SELECT 
         m.id,
         m.name,
         p.title as project_title
       FROM milestones m
       JOIN projects p ON m.project_id = p.id
       WHERE m.status = 'Completed'
       ORDER BY m.updated_at DESC
       LIMIT 1`
    );
    
    const milestones = milestoneRows.map((row, index) => ({
      id: 3 + index,
      type: 'info',
      title: 'Milestone Reached:',
      message: `${row.project_title} completed ${row.name} successfully.`,
      timestamp: new Date(Date.now() - (86400000 * (index + 1)))
    }));
    
    // Find recently completed projects
    const completedProjectRows = await dbAll(
      `SELECT 
         id,
         title
       FROM projects
       WHERE status = 'Completed'
       ORDER BY updated_at DESC
       LIMIT 1`
    );
    
    const completedProjects = completedProjectRows.map((row, index) => ({
      id: 5 + index,
      type: 'success',
      title: 'Project Completed:',
      message: `${row.title} has been successfully delivered.`,
      timestamp: new Date(Date.now() - (172800000 * (index + 1)))
    }));
    
    // Add a fixed resource constraint notification
    const resourceConstraint = {
      id: 7,
      type: 'warning',
      title: 'Resource Constraint:',
      message: 'Design team is at maximum capacity.',
      timestamp: new Date(Date.now() - 259200000)
    };
    
    // Combine all notifications
    const allNotifications = [...budgetAlerts, ...milestones, ...completedProjects, resourceConstraint];
    
    // Sort by timestamp (newest first)
    allNotifications.sort((a, b) => b.timestamp - a.timestamp);
    
    res.status(200).json(allNotifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET upcoming tasks
router.get('/tasks/upcoming', async (req, res) => {
  try {
    const today = new Date();
    
    const rows = await dbAll(
      `SELECT 
         t.id,
         t.name,
         t.due_date as dueDate,
         t.project_id as projectId,
         u.name as assignee
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.status != 'Completed'
       AND t.due_date >= date('now')
       ORDER BY t.due_date ASC
       LIMIT 5`
    );
    
    // Calculate days remaining for each task
    const tasks = rows.map(row => {
      const dueDate = new Date(row.dueDate);
      const timeDiff = dueDate - today;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      return {
        ...row,
        daysRemaining: Math.max(0, daysRemaining)
      };
    });
    
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching upcoming tasks:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming tasks' });
  }
});

module.exports = router;
