import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AnalyticsService {
  // Get project performance metrics
  async getProjectPerformance(projectId, dateRange = 'all') {
    try {
      const response = await axios.get(`${API_URL}/analytics/performance`, {
        params: { projectId, dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching project performance:', error);
      throw error;
    }
  }

  // Get resource utilization metrics
  async getResourceUtilization(dateRange = 'all', departmentId = null) {
    try {
      const response = await axios.get(`${API_URL}/analytics/resources`, {
        params: { dateRange, departmentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching resource utilization:', error);
      throw error;
    }
  }

  // Get budget forecasts
  async getBudgetForecasts(projectId) {
    try {
      const response = await axios.get(`${API_URL}/analytics/budget-forecast`, {
        params: { projectId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget forecasts:', error);
      throw error;
    }
  }

  // Calculate project completion forecasts
  async getCompletionForecasts(projectId) {
    try {
      const response = await axios.get(`${API_URL}/analytics/completion-forecast`, {
        params: { projectId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching completion forecasts:', error);
      throw error;
    }
  }

  // Get risk trends
  async getRiskTrends(projectId, period = 'monthly') {
    try {
      const response = await axios.get(`${API_URL}/analytics/risk-trends`, {
        params: { projectId, period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching risk trends:', error);
      throw error;
    }
  }

  // Get key performance indicators
  async getKPIs(projectId = null) {
    try {
      const response = await axios.get(`${API_URL}/analytics/kpis`, {
        params: { projectId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  }

  // Report-specific API methods
  async getReportKPIs() {
    try {
      const response = await axios.get(`${API_URL}/reports/kpis`);
      console.log('Report KPIs:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching report KPIs:', error);
      throw error;
    }
  }

  async getProjectTypes() {
    try {
      const response = await axios.get(`${API_URL}/reports/project-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project types:', error);
      throw error;
    }
  }

  async getTaskStatus() {
    try {
      const response = await axios.get(`${API_URL}/reports/task-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task status:', error);
      throw error;
    }
  }

  async getProjectStatus() {
    try {
      const response = await axios.get(`${API_URL}/reports/project-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project status:', error);
      throw error;
    }
  }

  async getProjectsTimeline() {
    try {
      const response = await axios.get(`${API_URL}/reports/projects-timeline`);
      console.log('Projects Timeline:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects timeline:', error);
      throw error;
    }
  }

  // Additional Report API methods for Projects Tab
  async getProjectHealth() {
    try {
      const response = await axios.get(`${API_URL}/reports/project-health`);
      console.log('Project health data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching project health data:', error);
      throw error;
    }
  }

  async getTaskCompletion() {
    try {
      const response = await axios.get(`${API_URL}/reports/task-completion`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task completion data:', error);
      throw error;
    }
  }

  async getMilestoneStatus() {
    try {
      const response = await axios.get(`${API_URL}/reports/milestone-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching milestone status data:', error);
      throw error;
    }
  }

  async getUpcomingTasks() {
    try {
      const response = await axios.get(`${API_URL}/reports/upcoming-tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      throw error;
    }
  }

  async getCompletedTasks() {
    try {
      const response = await axios.get(`${API_URL}/reports/completed-tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      throw error;
    }
  }

  // Financial Report API methods
  async getFinancialSummary() {
    try {
      const response = await axios.get(`${API_URL}/reports/financial-summary`);
      console.log('Financial summary data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      throw error;
    }
  }

  async getExpensesTrend() {
    try {
      const response = await axios.get(`${API_URL}/reports/expenses-trend`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses trend:', error);
      throw error;
    }
  }

  async getExpensesByCategory() {
    try {
      const response = await axios.get(`${API_URL}/reports/expenses-by-category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    }
  }

  async getBudgetVariance() {
    try {
      const response = await axios.get(`${API_URL}/reports/budget-variance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget variance:', error);
      throw error;
    }
  }

  async getBudgetForecast() {
    try {
      const response = await axios.get(`${API_URL}/reports/budget-forecast`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget forecast:', error);
      throw error;
    }
  }

  // SIMULATED METHODS FOR FRONTEND DEMONSTRATION (without actual API)
  
  // Simulate project completion forecast using historical data
  simulateCompletionForecast(tasks, plannedEndDate) {
    // Check if we have completed tasks to base forecast on
    const completedTasks = tasks.filter(task => task.status === 'Completed');
    if (completedTasks.length === 0) {
      return { 
        forecastDate: plannedEndDate,
        confidence: 'medium',
        deviation: 0
      };
    }
    
    // Calculate average completion rates
    const totalTasks = tasks.length;
    const completedCount = completedTasks.length;
    const completionRate = completedCount / totalTasks;
    
    // Calculate average time per task (simulated)
    const averageTaskDuration = 5; // days per task, simplified
    
    // Calculate remaining work
    const remainingTasks = totalTasks - completedCount;
    const estimatedRemainingDays = remainingTasks * averageTaskDuration;
    
    // Create projected completion date
    const today = new Date();
    const projectedDate = new Date(today);
    projectedDate.setDate(today.getDate() + estimatedRemainingDays);
    
    // Calculate deviation from planned end date
    const plannedEnd = new Date(plannedEndDate);
    const deviationDays = Math.round((projectedDate - plannedEnd) / (1000 * 60 * 60 * 24));
    
    // Determine confidence level
    let confidence = 'medium';
    if (completionRate > 0.7) confidence = 'high';
    if (completionRate < 0.3) confidence = 'low';
    
    return {
      forecastDate: projectedDate.toISOString().split('T')[0],
      confidence,
      deviation: deviationDays,
      completionRate: Math.round(completionRate * 100)
    };
  }
  
  // Simulate budget forecast using expense data
  simulateBudgetForecast(expenses, budget, timeline) {
    if (!expenses || expenses.length === 0) {
      return {
        forecastTotal: budget,
        variance: 0,
        confidence: 'medium'
      };
    }
    
    // Calculate burn rate (average expense per day)
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const elapsedDays = this.calculateElapsedDays(timeline.startDate);
    const burnRate = totalSpent / (elapsedDays || 1);
    
    // Calculate remaining timeline
    const totalDays = this.calculateTotalDays(timeline.startDate, timeline.endDate);
    const remainingDays = totalDays - elapsedDays;
    
    // Project final cost
    const projectedAdditionalCost = burnRate * remainingDays;
    const projectedTotalCost = totalSpent + projectedAdditionalCost;
    
    // Calculate variance
    const varianceAmount = projectedTotalCost - budget;
    const variancePercent = (varianceAmount / budget) * 100;
    
    // Determine confidence level
    let confidence = 'medium';
    if (elapsedDays < totalDays * 0.2) confidence = 'low';
    if (elapsedDays > totalDays * 0.6) confidence = 'high';
    
    return {
      forecastTotal: Math.round(projectedTotalCost),
      variance: Math.round(varianceAmount),
      variancePercent: Math.round(variancePercent),
      burnRate: Math.round(burnRate),
      confidence,
      totalSpent,
      projectedAdditionalCost: Math.round(projectedAdditionalCost)
    };
  }
  
  // Calculate elapsed days from a start date
  calculateElapsedDays(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    return Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  }
  
  // Calculate total days between two dates
  calculateTotalDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  }
  
  // Generate Monte Carlo simulation for project completion
  generateMonteCarloSimulation(tasks) {
    // Simplified Monte Carlo simulation
    const iterations = 1000;
    const results = [];
    
    // Get incomplete tasks
    const incompleteTasks = tasks.filter(task => task.status !== 'Completed');
    
    if (incompleteTasks.length === 0) {
      return {
        p50: new Date().toISOString().split('T')[0],
        p75: new Date().toISOString().split('T')[0],
        p90: new Date().toISOString().split('T')[0],
        simulation: []
      };
    }
    
    // Run simulation iterations
    for (let i = 0; i < iterations; i++) {
      let totalDuration = 0;
      
      // For each incomplete task, simulate duration with uncertainty
      incompleteTasks.forEach(task => {
        const plannedDuration = task.duration || 5; // default 5 days if not specified
        
        // Add random variation (between 0.7 and 1.5 times the planned duration)
        const multiplier = 0.7 + (Math.random() * 0.8);
        totalDuration += plannedDuration * multiplier;
      });
      
      // Add result to array
      results.push(Math.round(totalDuration));
    }
    
    // Sort results for percentiles
    results.sort((a, b) => a - b);
    
    // Calculate p50, p75, p90 dates
    const today = new Date();
    const p50Index = Math.floor(iterations * 0.5);
    const p75Index = Math.floor(iterations * 0.75);
    const p90Index = Math.floor(iterations * 0.9);
    
    const p50Date = new Date(today);
    p50Date.setDate(today.getDate() + results[p50Index]);
    
    const p75Date = new Date(today);
    p75Date.setDate(today.getDate() + results[p75Index]);
    
    const p90Date = new Date(today);
    p90Date.setDate(today.getDate() + results[p90Index]);
    
    // Create histogram for visualization
    const minDays = Math.min(...results);
    const maxDays = Math.max(...results);
    const binSize = Math.ceil((maxDays - minDays) / 10); // 10 bins
    
    const histogram = [];
    for (let bin = minDays; bin <= maxDays; bin += binSize) {
      const count = results.filter(days => days >= bin && days < bin + binSize).length;
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + bin + Math.floor(binSize/2));
      
      histogram.push({
        binStart: bin,
        binEnd: bin + binSize - 1,
        count,
        frequency: count / iterations,
        date: endDate.toISOString().split('T')[0]
      });
    }
    
    return {
      p50: p50Date.toISOString().split('T')[0],
      p75: p75Date.toISOString().split('T')[0],
      p90: p90Date.toISOString().split('T')[0],
      simulation: histogram
    };
  }
  
  // Generate resource capacity forecast
  simulateResourceCapacityForecast(resources, assignments, timeline, weeks = 12) {
    const forecast = [];
    const today = new Date();
    
    // Create data for each future week
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Calculate capacity vs demand for this week
      const totalCapacity = resources.reduce((sum, resource) => {
        // Assume 40 hours per week unless otherwise specified
        const weeklyCapacity = resource.weeklyCapacity || 40;
        return sum + weeklyCapacity;
      }, 0);
      
      // Forecast demand based on assignments
      // This is a simplified calculation
      const demandMultiplier = 0.8 + (Math.random() * 0.4); // Random variation
      const forecastDemand = Math.round(totalCapacity * demandMultiplier);
      
      // Calculate utilization
      const utilization = forecastDemand / totalCapacity;
      
      forecast.push({
        weekStarting: weekStart.toISOString().split('T')[0],
        weekEnding: weekEnd.toISOString().split('T')[0],
        capacity: totalCapacity,
        demand: forecastDemand,
        utilization: Math.min(utilization, 1), // Cap at 100%
        overallocated: utilization > 1
      });
    }
    
    return forecast;
  }
}

export default new AnalyticsService();
