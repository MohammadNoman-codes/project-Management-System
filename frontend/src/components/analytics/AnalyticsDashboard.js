import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
         BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AnalyticsService from '../../services/AnalyticsService';
import ProjectForecastWidget from './ProjectForecastWidget';
import PerformanceTrendWidget from './PerformanceTrendWidget';
import ResourceForecastWidget from './ResourceForecastWidget';
import BudgetForecastWidget from './BudgetForecastWidget';
import KPITrendWidget from './KPITrendWidget';
import '../../styles/analytics.css';

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard({ projectId }) {
  // Purple-themed color palette for charts to match Dashboard
  const purpleColors = {
    // Primary purple shades
    primary: '#6a4c93',      // Deep purple
    secondary: '#8363ac',    // Medium purple
    tertiary: '#9d80c3',     // Light purple
    quaternary: '#b39ddb',   // Lavender
    quinary: '#d1c4e9',      // Very light purple
    
    // Complementary colors
    accent1: '#4d4398',      // Blue-purple
    accent2: '#7e57c2',      // Brighter purple
    accent3: '#5e35b1',     // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
    underBudget: '#7986cb',  // Blue-purple for under budget
    onBudget: '#9575cd',     // Medium purple for on budget
    overBudget: '#8559da',   // Bright purple for over budget
    
    // Risk colors
    lowRisk: '#b39ddb',      // Light purple for low risk
    mediumRisk: '#9575cd',   // Medium purple for medium risk
    highRisk: '#7e57c2',     // Brighter purple for high risk
    criticalRisk: '#5e35b1', // Deep purple for critical risk
  };
  
  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('year');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [risks, setRisks] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(projectId || 'all');

  // Load data (simulated)
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Simulate API calls to load data
    Promise.all([
      fetchProjects(),
      fetchTasks(),
      fetchResources(),
      fetchAssignments(),
      fetchExpenses(),
      fetchRisks()
    ])
      .then(() => {
        return generateAnalytics();
      })
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, [projectId, dateRange, selectedProject]);

  // Fetch project data (simulated)
  const fetchProjects = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockProjects = [
        {
          id: '1',
          title: 'Website Redesign',
          status: 'In Progress',
          startDate: '2023-01-15',
          endDate: '2023-08-30',
          budget: 85000,
          progress: 0.65,
          priority: 'High'
        },
        {
          id: '2',
          title: 'Mobile App Development',
          status: 'In Progress',
          startDate: '2023-03-01',
          endDate: '2023-12-15',
          budget: 120000,
          progress: 0.4,
          priority: 'Critical'
        },
        {
          id: '3',
          title: 'ERP Implementation',
          status: 'In Progress',
          startDate: '2023-02-10',
          endDate: '2024-02-10',
          budget: 250000,
          progress: 0.25,
          priority: 'High'
        },
        {
          id: '4',
          title: 'Marketing Campaign',
          status: 'Completed',
          startDate: '2023-01-05',
          endDate: '2023-04-15',
          budget: 45000,
          progress: 1.0,
          priority: 'Medium'
        }
      ];
      
      setProjects(mockProjects);
    }, 300);
    
    return true;
  };

  // Fetch tasks data (simulated)
  const fetchTasks = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockTasks = [
        // Project 1 tasks
        { id: '101', projectId: '1', name: 'UX Research', status: 'Completed', progress: 1, duration: 14 },
        { id: '102', projectId: '1', name: 'Wireframing', status: 'Completed', progress: 1, duration: 10 },
        { id: '103', projectId: '1', name: 'UI Design', status: 'In Progress', progress: 0.8, duration: 20 },
        { id: '104', projectId: '1', name: 'Frontend Development', status: 'In Progress', progress: 0.6, duration: 30 },
        { id: '105', projectId: '1', name: 'Backend Integration', status: 'Not Started', progress: 0, duration: 25 },
        { id: '106', projectId: '1', name: 'Testing', status: 'Not Started', progress: 0, duration: 15 },
        
        // Project 2 tasks
        { id: '201', projectId: '2', name: 'Requirements Gathering', status: 'Completed', progress: 1, duration: 12 },
        { id: '202', projectId: '2', name: 'App Design', status: 'Completed', progress: 1, duration: 20 },
        { id: '203', projectId: '2', name: 'Frontend Development', status: 'In Progress', progress: 0.5, duration: 35 },
        { id: '204', projectId: '2', name: 'Backend Development', status: 'In Progress', progress: 0.3, duration: 40 },
        { id: '205', projectId: '2', name: 'Testing', status: 'Not Started', progress: 0, duration: 20 },
        { id: '206', projectId: '2', name: 'Deployment', status: 'Not Started', progress: 0, duration: 10 },
        
        // Project 3 tasks
        { id: '301', projectId: '3', name: 'Planning', status: 'Completed', progress: 1, duration: 30 },
        { id: '302', projectId: '3', name: 'Requirements Analysis', status: 'Completed', progress: 1, duration: 45 },
        { id: '303', projectId: '3', name: 'System Design', status: 'In Progress', progress: 0.4, duration: 60 },
        { id: '304', projectId: '3', name: 'Implementation', status: 'Not Started', progress: 0, duration: 120 },
        { id: '305', projectId: '3', name: 'Testing', status: 'Not Started', progress: 0, duration: 45 },
        { id: '306', projectId: '3', name: 'Training', status: 'Not Started', progress: 0, duration: 30 },
        
        // Project 4 tasks
        { id: '401', projectId: '4', name: 'Campaign Planning', status: 'Completed', progress: 1, duration: 15 },
        { id: '402', projectId: '4', name: 'Content Creation', status: 'Completed', progress: 1, duration: 25 },
        { id: '403', projectId: '4', name: 'Campaign Execution', status: 'Completed', progress: 1, duration: 40 },
        { id: '404', projectId: '4', name: 'Analysis & Reporting', status: 'Completed', progress: 1, duration: 20 }
      ];
      
      setTasks(mockTasks);
    }, 300);
    
    return true;
  };

  // Fetch resources data (simulated)
  const fetchResources = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockResources = [
        { id: '1', name: 'John Smith', role: 'Project Manager', department: 'Management', costRate: 75, weeklyCapacity: 40 },
        { id: '2', name: 'Sarah Johnson', role: 'UX Designer', department: 'Design', costRate: 60, weeklyCapacity: 35 },
        { id: '3', name: 'Michael Brown', role: 'Developer', department: 'Engineering', costRate: 65, weeklyCapacity: 40 },
        { id: '4', name: 'Emily Davis', role: 'QA Engineer', department: 'Quality', costRate: 55, weeklyCapacity: 40 },
        { id: '5', name: 'David Wilson', role: 'Developer', department: 'Engineering', costRate: 65, weeklyCapacity: 40 },
        { id: '6', name: 'Jennifer Lee', role: 'Business Analyst', department: 'Business', costRate: 60, weeklyCapacity: 35 },
        { id: '7', name: 'Robert Taylor', role: 'DevOps Engineer', department: 'Engineering', costRate: 70, weeklyCapacity: 40 },
        { id: '8', name: 'Amanda Martinez', role: 'UI Designer', department: 'Design', costRate: 60, weeklyCapacity: 35 }
      ];
      
      setResources(mockResources);
    }, 300);
    
    return true;
  };

  // Fetch resource assignments (simulated)
  const fetchAssignments = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockAssignments = [
        // Project 1
        { id: '1001', projectId: '1', taskId: '101', resourceId: '2', hours: 56 },
        { id: '1002', projectId: '1', taskId: '102', resourceId: '2', hours: 40 },
        { id: '1003', projectId: '1', taskId: '103', resourceId: '8', hours: 80 },
        { id: '1004', projectId: '1', taskId: '104', resourceId: '3', hours: 120 },
        { id: '1005', projectId: '1', taskId: '105', resourceId: '5', hours: 100 },
        { id: '1006', projectId: '1', taskId: '106', resourceId: '4', hours: 60 },
        
        // Project 2
        { id: '2001', projectId: '2', taskId: '201', resourceId: '6', hours: 48 },
        { id: '2002', projectId: '2', taskId: '202', resourceId: '2', hours: 80 },
        { id: '2003', projectId: '2', taskId: '203', resourceId: '3', hours: 140 },
        { id: '2004', projectId: '2', taskId: '204', resourceId: '5', hours: 160 },
        { id: '2005', projectId: '2', taskId: '205', resourceId: '4', hours: 80 },
        { id: '2006', projectId: '2', taskId: '206', resourceId: '7', hours: 40 },
        
        // Project 3
        { id: '3001', projectId: '3', taskId: '301', resourceId: '1', hours: 120 },
        { id: '3002', projectId: '3', taskId: '302', resourceId: '6', hours: 180 },
        { id: '3003', projectId: '3', taskId: '303', resourceId: '3', hours: 240 },
        { id: '3004', projectId: '3', taskId: '304', resourceId: '5', hours: 480 }
      ];
      
      setAssignments(mockAssignments);
    }, 300);
    
    return true;
  };

  // Fetch expense data (simulated)
  const fetchExpenses = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockExpenses = [
        // Project 1
        { id: '10001', projectId: '1', category: 'Labor', description: 'UX Design', amount: 8500, date: '2023-01-20' },
        { id: '10002', projectId: '1', category: 'Labor', description: 'Frontend Development', amount: 12000, date: '2023-03-05' },
        { id: '10003', projectId: '1', category: 'Software', description: 'Design Tools', amount: 1500, date: '2023-01-18' },
        { id: '10004', projectId: '1', category: 'Hosting', description: 'Development Environment', amount: 800, date: '2023-02-10' },
        { id: '10005', projectId: '1', category: 'Labor', description: 'UI Design', amount: 7500, date: '2023-04-15' },
        
        // Project 2
        { id: '20001', projectId: '2', category: 'Labor', description: 'Requirements Analysis', amount: 7200, date: '2023-03-10' },
        { id: '20002', projectId: '2', category: 'Labor', description: 'App Design', amount: 10000, date: '2023-04-05' },
        { id: '20003', projectId: '2', category: 'Software', description: 'Development Tools', amount: 2800, date: '2023-03-15' },
        { id: '20004', projectId: '2', category: 'Hardware', description: 'Testing Devices', amount: 4500, date: '2023-05-01' },
        
        // Project 3
        { id: '30001', projectId: '3', category: 'Labor', description: 'Planning Phase', amount: 25000, date: '2023-02-15' },
        { id: '30002', projectId: '3', category: 'Labor', description: 'Requirements Analysis', amount: 35000, date: '2023-04-20' },
        { id: '30003', projectId: '3', category: 'Software', description: 'ERP License', amount: 15000, date: '2023-03-01' },
        { id: '30004', projectId: '3', category: 'Hardware', description: 'Server Infrastructure', amount: 12000, date: '2023-03-25' },
        
        // Project 4
        { id: '40001', projectId: '4', category: 'Marketing', description: 'Content Creation', amount: 12000, date: '2023-01-10' },
        { id: '40002', projectId: '4', category: 'Marketing', description: 'Digital Ads', amount: 18000, date: '2023-02-15' },
        { id: '40003', projectId: '4', category: 'Labor', description: 'Campaign Management', amount: 8500, date: '2023-03-10' },
        { id: '40004', projectId: '4', category: 'Tools', description: 'Analytics Software', amount: 1200, date: '2023-01-20' }
      ];
      
      setExpenses(mockExpenses);
    }, 300);
    
    return true;
  };

  // Fetch risk data (simulated)
  const fetchRisks = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockRisks = [
        // Project 1
        { id: '1001', projectId: '1', title: 'Browser Compatibility Issues', probability: 3, impact: 4, riskScore: 12, status: 'Monitoring' },
        { id: '1002', projectId: '1', title: 'Delayed Content Delivery', probability: 2, impact: 4, riskScore: 8, status: 'Mitigated' },
        { id: '1003', projectId: '1', title: 'Performance Bottlenecks', probability: 3, impact: 3, riskScore: 9, status: 'Monitoring' },
        
        // Project 2
        { id: '2001', projectId: '2', title: 'API Integration Challenges', probability: 4, impact: 4, riskScore: 16, status: 'Monitoring' },
        { id: '2002', projectId: '2', title: 'User Adoption Issues', probability: 3, impact: 5, riskScore: 15, status: 'Monitoring' },
        { id: '2003', projectId: '2', title: 'Security Vulnerabilities', probability: 2, impact: 5, riskScore: 10, status: 'Mitigated' },
        
        // Project 3
        { id: '3001', projectId: '3', title: 'Data Migration Issues', probability: 4, impact: 5, riskScore: 20, status: 'Monitoring' },
        { id: '3002', projectId: '3', title: 'Integration with Legacy Systems', probability: 3, impact: 4, riskScore: 12, status: 'Monitoring' },
        { id: '3003', projectId: '3', title: 'User Training Challenges', probability: 3, impact: 3, riskScore: 9, status: 'Monitoring' },
        { id: '3004', projectId: '3', title: 'Resistance to Change', probability: 4, impact: 4, riskScore: 16, status: 'Monitoring' },
        
        // Project 4
        { id: '4001', projectId: '4', title: 'Budget Overrun', probability: 2, impact: 3, riskScore: 6, status: 'Closed' },
        { id: '4002', projectId: '4', title: 'Campaign Timing Issues', probability: 3, impact: 3, riskScore: 9, status: 'Closed' }
      ];
      
      setRisks(mockRisks);
    }, 300);
    
    return true;
  };

  // Generate analytics and forecasts
  const generateAnalytics = async () => {
    // Generate KPIs
    const projectKpis = generateProjectKPIs();
    setKpis(projectKpis);
    
    // Generate forecasts
    const forecasts = generateForecasts();
    setForecastData(forecasts);
    
    return true;
  };

  // Generate project KPIs
  const generateProjectKPIs = () => {
    // Filter data based on selected project if needed
    const filteredProjects = selectedProject === 'all' ? projects : projects.filter(p => p.id === selectedProject);
    const filteredTasks = selectedProject === 'all' ? tasks : tasks.filter(t => t.projectId === selectedProject);
    const filteredExpenses = selectedProject === 'all' ? expenses : expenses.filter(e => e.projectId === selectedProject);
    
    // Calculate overall KPIs
    const totalBudget = filteredProjects.reduce((sum, project) => sum + project.budget, 0);
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Calculate task metrics
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress').length;
    const notStartedTasks = filteredTasks.filter(t => t.status === 'Not Started').length;
    const totalTasks = filteredTasks.length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate schedule performance
    let schedulePerformanceIndex = 1.0;
    if (filteredProjects.length === 1) {
      const project = filteredProjects[0];
      const totalDuration = (new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
      const elapsedDuration = (new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
      const plannedProgress = Math.min(1, elapsedDuration / totalDuration);
      schedulePerformanceIndex = plannedProgress > 0 ? project.progress / plannedProgress : 1;
    }
    
    // Calculate cost performance
    let costPerformanceIndex = 1.0;
    if (filteredProjects.length === 1) {
      const project = filteredProjects[0];
      const plannedValue = project.budget * project.progress;
      const earnedValue = project.budget * project.progress;
      const actualCost = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1;
    }
    
    return {
      projectCount: filteredProjects.length,
      totalBudget,
      totalSpent,
      budgetUtilization,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      totalTasks,
      taskCompletionRate,
      schedulePerformanceIndex,
      costPerformanceIndex,
      criticalRisks: filteredProjects.length > 0 
        ? risks.filter(r => r.riskScore >= 15 && (selectedProject === 'all' || r.projectId === selectedProject)).length 
        : 0
    };
  };

  // Generate forecasts
  const generateForecasts = () => {
    const forecasts = {};
    
    // Only generate project-specific forecasts if a project is selected
    if (selectedProject !== 'all') {
      const project = projects.find(p => p.id === selectedProject);
      
      if (project) {
        // Get project tasks
        const projectTasks = tasks.filter(t => t.projectId === selectedProject);
        
        // Get project expenses
        const projectExpenses = expenses.filter(e => e.projectId === selectedProject);
        
        // Generate completion forecast
        forecasts.completion = AnalyticsService.simulateCompletionForecast(
          projectTasks,
          project.endDate
        );
        
        // Generate budget forecast
        forecasts.budget = AnalyticsService.simulateBudgetForecast(
          projectExpenses,
          project.budget,
          { startDate: project.startDate, endDate: project.endDate }
        );
        
        // Generate Monte Carlo simulation for completion
        forecasts.monteCarloCompletion = AnalyticsService.generateMonteCarloSimulation(
          projectTasks
        );
      }
    }
    
    // Generate resource capacity forecast (always for all resources)
    forecasts.resourceCapacity = AnalyticsService.simulateResourceCapacityForecast(
      resources,
      assignments,
      { startDate: new Date().toISOString().split('T')[0] }
    );
    
    return forecasts;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="analytics-dashboard">
        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Analytics Dashboard</h1>
        </div> */}
        <div className="text-center my-5 py-5">
          <div className="spinner-border" role="status" style={{ color: purpleColors.primary }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="analytics-dashboard">
        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Analytics Dashboard</h1>
        </div> */}
        <div className="alert" style={{ 
          backgroundColor: `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.1)`,
          color: '#333',
          border: `1px solid rgba(${safeHexToRgb(purpleColors.accent2)}, 0.3)`,
          borderRadius: '8px'
        }}>
          <div className="d-flex">
            <div className="me-3">
              <i className="bi bi-exclamation-triangle-fill fs-4" style={{ color: purpleColors.accent2 }}></i>
            </div>
            <div>
              <h5 style={{ color: purpleColors.accent2 }}>Error</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* <h1 className="fw-bold">Analytics Dashboard</h1> */}
        <div className="d-flex">
          <div className="me-2" style={{ width: '220px' }} align="right">
            <select
              className="form-select rounded-pill"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ borderColor: purpleColors.primary }}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          <div style={{ width: '150px' }}>
            <select
              className="form-select rounded-pill"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ borderColor: purpleColors.primary }}
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={activeTab === 'overview' ? 
              { color: purpleColors.primary, borderColor: `transparent transparent ${purpleColors.primary} transparent`, borderWidth: '0 0 2px 0', fontWeight: '500' } : 
              { color: '#555' }}
          >
            <i className="bi bi-speedometer2 me-1"></i> Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'forecasts' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecasts')}
            style={activeTab === 'forecasts' ? 
              { color: purpleColors.primary, borderColor: `transparent transparent ${purpleColors.primary} transparent`, borderWidth: '0 0 2px 0', fontWeight: '500' } : 
              { color: '#555' }}
          >
            <i className="bi bi-graph-up-arrow me-1"></i> Forecasts & Predictions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
            style={activeTab === 'performance' ? 
              { color: purpleColors.primary, borderColor: `transparent transparent ${purpleColors.primary} transparent`, borderWidth: '0 0 2px 0', fontWeight: '500' } : 
              { color: '#555' }}
          >
            <i className="bi bi-bar-chart me-1"></i> Performance Trends
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
            style={activeTab === 'resources' ? 
              { color: purpleColors.primary, borderColor: `transparent transparent ${purpleColors.primary} transparent`, borderWidth: '0 0 2px 0', fontWeight: '500' } : 
              { color: '#555' }}
          >
            <i className="bi bi-people me-1"></i> Resource Analytics
          </button>
        </li>
      </ul>
      
      {activeTab === 'overview' && (
        <div className="analytics-overview">
          {/* KPI Cards Row */}
          <div className="row mb-4">
            <div className="col-md-3 mb-4">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Budget Utilization</h6>
                    <h2 className="kpi-value">{kpis.budgetUtilization.toFixed(1)}%</h2>
                  </div>
                  <div className="kpi-icon" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(
                      kpis.budgetUtilization > 90 ? purpleColors.accent2 : 
                      kpis.budgetUtilization > 75 ? purpleColors.tertiary : 
                      purpleColors.completed
                    )}, 0.1)` 
                  }}>
                    <i className="bi bi-currency-dollar fs-3" style={{ 
                      color: kpis.budgetUtilization > 90 ? purpleColors.accent2 : 
                             kpis.budgetUtilization > 75 ? purpleColors.tertiary : 
                             purpleColors.completed
                    }}></i>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="progress progress-thin">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ 
                        width: `${Math.min(100, kpis.budgetUtilization)}%`,
                        backgroundColor: kpis.budgetUtilization > 90 ? purpleColors.accent2 : 
                                       kpis.budgetUtilization > 75 ? purpleColors.tertiary : 
                                       purpleColors.completed
                      }}
                      aria-valuenow={kpis.budgetUtilization}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Spent: BHD {kpis.totalSpent.toLocaleString()}</small>
                    <small className="text-muted">Budget: BHD {kpis.totalBudget.toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Task Completion</h6>
                    <h2 className="kpi-value">{kpis.taskCompletionRate.toFixed(1)}%</h2>
                  </div>
                  <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)` }}>
                    <i className="bi bi-check2-square fs-3" style={{ color: purpleColors.primary }}></i>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="progress progress-thin">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${kpis.taskCompletionRate}%`, backgroundColor: purpleColors.primary }}
                      aria-valuenow={kpis.taskCompletionRate}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Completed: {kpis.completedTasks}</small>
                    <small className="text-muted">Total: {kpis.totalTasks}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Schedule Performance</h6>
                    <h2 className="kpi-value">{kpis.schedulePerformanceIndex.toFixed(2)}</h2>
                  </div>
                  <div className="kpi-icon" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(
                      kpis.schedulePerformanceIndex < 0.9 ? purpleColors.accent2 : 
                      kpis.schedulePerformanceIndex > 1.1 ? purpleColors.completed : 
                      purpleColors.tertiary
                    )}, 0.1)` 
                  }}>
                    <i className="bi bi-calendar-check fs-3" style={{ 
                      color: kpis.schedulePerformanceIndex < 0.9 ? purpleColors.accent2 : 
                            kpis.schedulePerformanceIndex > 1.1 ? purpleColors.completed : 
                            purpleColors.tertiary
                    }}></i>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="progress progress-thin">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ 
                            width: `${Math.min(100, kpis.schedulePerformanceIndex * 50)}%`,
                            backgroundColor: kpis.schedulePerformanceIndex < 0.9 ? purpleColors.accent2 : 
                                         kpis.schedulePerformanceIndex > 1.1 ? purpleColors.completed : 
                                         purpleColors.tertiary
                          }}
                          aria-valuenow={kpis.schedulePerformanceIndex}
                          aria-valuemin="0"
                          aria-valuemax="2"
                        ></div>
                      </div>
                    </div>
                    <div className="ms-2" style={{ width: '32px' }}>
                      <small className="text-muted">SPI</small>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      {kpis.schedulePerformanceIndex < 0.9 ? 'Behind schedule' : 
                      kpis.schedulePerformanceIndex > 1.1 ? 'Ahead of schedule' : 'On schedule'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Cost Performance</h6>
                    <h2 className="kpi-value">{kpis.costPerformanceIndex.toFixed(2)}</h2>
                  </div>
                  <div className="kpi-icon" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(
                      kpis.costPerformanceIndex < 0.9 ? purpleColors.accent2 : 
                      kpis.costPerformanceIndex > 1.1 ? purpleColors.completed : 
                      purpleColors.tertiary
                    )}, 0.1)` 
                  }}>
                    <i className="bi bi-cash-stack fs-3" style={{ 
                      color: kpis.costPerformanceIndex < 0.9 ? purpleColors.accent2 : 
                            kpis.costPerformanceIndex > 1.1 ? purpleColors.completed : 
                            purpleColors.tertiary
                    }}></i>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="progress progress-thin">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ 
                            width: `${Math.min(100, kpis.costPerformanceIndex * 50)}%`,
                            backgroundColor: kpis.costPerformanceIndex < 0.9 ? purpleColors.accent2 : 
                                         kpis.costPerformanceIndex > 1.1 ? purpleColors.completed : 
                                         purpleColors.tertiary
                          }}
                          aria-valuenow={kpis.costPerformanceIndex}
                          aria-valuemin="0"
                          aria-valuemax="2"
                        ></div>
                      </div>
                    </div>
                    <div className="ms-2" style={{ width: '32px' }}>
                      <small className="text-muted">CPI</small>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      {kpis.costPerformanceIndex < 0.9 ? 'Over budget' : 
                      kpis.costPerformanceIndex > 1.1 ? 'Under budget' : 'On budget'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Analytics Widgets */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="dashboard-card h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-check2-square me-2"></i>Task Status Distribution
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-5">
                      {kpis.totalTasks > 0 ? (
                        <Doughnut
                          data={{
                            labels: ['Completed', 'In Progress', 'Not Started'],
                            datasets: [
                              {
                                data: [kpis.completedTasks, kpis.inProgressTasks, kpis.notStartedTasks],
                                backgroundColor: [purpleColors.completed, purpleColors.inProgress, purpleColors.quaternary],
                                hoverOffset: 4
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  boxWidth: 12,
                                  padding: 15,
                                  font: {
                                    size: 11
                                  }
                                }
                              }
                            },
                            cutout: '70%'
                          }}
                        />
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-clipboard-x" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
                          <p className="text-muted mt-3">No task data available</p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-7">
                      <div className="task-status-stats">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.completed, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>Completed</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{kpis.completedTasks}</span>
                            <span className="text-muted ms-2">
                              ({kpis.totalTasks > 0 ? Math.round((kpis.completedTasks / kpis.totalTasks) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.inProgress, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>In Progress</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{kpis.inProgressTasks}</span>
                            <span className="text-muted ms-2">
                              ({kpis.totalTasks > 0 ? Math.round((kpis.inProgressTasks / kpis.totalTasks) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.quaternary, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>Not Started</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{kpis.notStartedTasks}</span>
                            <span className="text-muted ms-2">
                              ({kpis.totalTasks > 0 ? Math.round((kpis.notStartedTasks / kpis.totalTasks) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                        
                        <hr />
                        
                        <div className="text-center">
                          <div className="text-muted mb-2">Total Tasks</div>
                          <h3 style={{ color: purpleColors.primary }}>{kpis.totalTasks}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="dashboard-card h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-shield-exclamation me-2"></i>Risk Assessment Overview
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-5">
                      {risks.length > 0 ? (
                        <Pie
                          data={{
                            labels: ['Low', 'Medium', 'High', 'Critical'],
                            datasets: [
                              {
                                data: [
                                  risks.filter(r => r.riskScore < 6).length,
                                  risks.filter(r => r.riskScore >= 6 && r.riskScore < 10).length,
                                  risks.filter(r => r.riskScore >= 10 && r.riskScore < 15).length,
                                  risks.filter(r => r.riskScore >= 15).length
                                ],
                                backgroundColor: [
                                  purpleColors.lowRisk,
                                  purpleColors.mediumRisk, 
                                  purpleColors.highRisk, 
                                  purpleColors.criticalRisk
                                ],
                                hoverOffset: 4,
                                borderWidth: 1,
                                borderColor: '#ffffff'
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  boxWidth: 12,
                                  padding: 15,
                                  font: {
                                    size: 11
                                  }
                                }
                              }
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-shield-check" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
                          <p className="text-muted mt-3">No risk data available</p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-7">
                      <div className="risk-severity-stats">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.criticalRisk, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>Critical (15-25)</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{risks.filter(r => r.riskScore >= 15).length}</span>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.highRisk, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>High (10-14)</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{risks.filter(r => r.riskScore >= 10 && r.riskScore < 15).length}</span>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.mediumRisk, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>Medium (6-9)</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{risks.filter(r => r.riskScore >= 6 && r.riskScore < 10).length}</span>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <div className="status-dot me-2" style={{ backgroundColor: purpleColors.lowRisk, width: '12px', height: '12px', borderRadius: '50%' }}></div>
                              <div>Low (1-5)</div>
                            </div>
                          </div>
                          <div>
                            <span className="fw-bold">{risks.filter(r => r.riskScore < 6).length}</span>
                          </div>
                        </div>
                        
                        <hr />
                        
                        <div className="text-center">
                          <div className="text-muted mb-2">Active Risks</div>
                          <h3 style={{ color: purpleColors.primary }}>{risks.filter(r => r.status !== 'Closed').length}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12 mb-4">
              <KPITrendWidget dateRange={dateRange} colors={purpleColors} />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'forecasts' && (
        <div className="analytics-forecasts">
          {selectedProject === 'all' ? (
            <div className="alert" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
              color: '#333',
              border: `1px solid rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.2)`,
              borderRadius: '8px'
            }}>
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-info-circle-fill" style={{ color: purpleColors.tertiary }}></i>
                </div>
                <div>
                  Project-specific forecasts are available when you select a specific project from the dropdown above.
                </div>
              </div>
            </div>
          ) : (
            <>
              <ProjectForecastWidget forecastData={forecastData} colors={purpleColors} />
              <BudgetForecastWidget forecastData={forecastData} colors={purpleColors} />
            </>
          )}
          <ResourceForecastWidget forecastData={forecastData} colors={purpleColors} />
        </div>
      )}
      
      {activeTab === 'performance' && (
        <div className="analytics-performance">
          <PerformanceTrendWidget dateRange={dateRange} colors={purpleColors} />
          
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="dashboard-card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-speedometer2 me-2"></i>Project Performance Index
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table dashboard-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>SPI</th>
                          <th>CPI</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(project => {
                          // Calculate SPI for this project
                          const totalDuration = (new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
                          const elapsedDuration = (new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24);
                          const plannedProgress = Math.min(1, elapsedDuration / totalDuration);
                          const spi = plannedProgress > 0 ? project.progress / plannedProgress : 1;
                          
                          // Calculate CPI for this project
                          const projectExpenses = expenses.filter(e => e.projectId === project.id);
                          const totalSpent = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                          const plannedValue = project.budget * project.progress;
                          const earnedValue = project.budget * project.progress;
                          const cpi = totalSpent > 0 ? earnedValue / totalSpent : 1;
                          
                          return (
                            <tr key={project.id}>
                              <td>{project.title}</td>
                              <td>
                                <span className="badge" style={{ 
                                  backgroundColor: spi < 0.9 ? purpleColors.accent2 : 
                                                 spi > 1.1 ? purpleColors.completed : 
                                                 purpleColors.tertiary,
                                  borderRadius: '12px',
                                  padding: '4px 8px'
                                }}>
                                  {spi.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                <span className="badge" style={{ 
                                  backgroundColor: cpi < 0.9 ? purpleColors.accent2 : 
                                                 cpi > 1.1 ? purpleColors.completed : 
                                                 purpleColors.tertiary,
                                  borderRadius: '12px',
                                  padding: '4px 8px'
                                }}>
                                  {cpi.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                <div className="progress progress-thin">
                                  <div 
                                    className="progress-bar" 
                                    role="progressbar" 
                                    style={{ 
                                      width: `${project.progress * 100}%`,
                                      backgroundColor: purpleColors.primary
                                    }}
                                  ></div>
                                </div>
                                <small className="text-muted">{Math.round(project.progress * 100)}% complete</small>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="dashboard-card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-currency-exchange me-2"></i>Budget Variance Analysis
                  </h5>
                </div>
                <div className="card-body">
                  <Bar 
                    data={{
                      labels: projects.map(p => p.title),
                      datasets: [
                        {
                          label: 'Planned Budget',
                          data: projects.map(p => p.budget),
                          backgroundColor: purpleColors.primary,
                        },
                        {
                          label: 'Actual Spending',
                          data: projects.map(p => {
                            const projectExpenses = expenses.filter(e => e.projectId === p.id);
                            return projectExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                          }),
                          backgroundColor: purpleColors.tertiary,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Amount ($)',
                            font: {
                              size: 12,
                              weight: 'normal'
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          align: 'end',
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'resources' && (
        <div className="analytics-resources">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="dashboard-card mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-building me-2"></i>Resource Utilization by Department
                  </h5>
                </div>
                <div className="card-body">
                  <Bar 
                    data={{
                      labels: ['Management', 'Engineering', 'Design', 'Quality', 'Business'],
                      datasets: [
                        {
                          label: 'Allocated Hours',
                          data: [120, 780, 420, 150, 230],
                          backgroundColor: purpleColors.tertiary,
                        },
                        {
                          label: 'Available Capacity',
                          data: [160, 960, 500, 200, 280],
                          backgroundColor: purpleColors.quaternary,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Hours',
                            font: {
                              size: 12,
                              weight: 'normal'
                            }
                          },
                          grid: {
                            color: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          align: 'end',
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="dashboard-card mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-briefcase me-2"></i>Resource Allocation by Project
                  </h5>
                </div>
                <div className="card-body">
                  <Pie 
                    data={{
                      labels: projects.map(p => p.title),
                      datasets: [
                        {
                          data: projects.map(p => {
                            const projectAssignments = assignments.filter(a => a.projectId === p.id);
                            return projectAssignments.reduce((sum, assignment) => sum + assignment.hours, 0);
                          }),
                          backgroundColor: [
                            purpleColors.primary,
                            purpleColors.secondary,
                            purpleColors.tertiary,
                            purpleColors.quaternary
                          ],
                          borderWidth: 1,
                          borderColor: '#ffffff'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12 mb-4">
              <div className="dashboard-card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-people me-2"></i>Resource Workload Analysis
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table dashboard-table">
                      <thead>
                        <tr>
                          <th>Resource</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Allocated Hours</th>
                          <th>Capacity</th>
                          <th>Utilization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map(resource => {
                          const resourceAssignments = assignments.filter(a => a.resourceId === resource.id);
                          const allocatedHours = resourceAssignments.reduce((sum, assignment) => sum + assignment.hours, 0);
                          const capacity = resource.weeklyCapacity * 12; // 12 weeks (3 months)
                          const utilization = capacity > 0 ? allocatedHours / capacity : 0;
                          
                          return (
                            <tr key={resource.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-circle me-2" style={{ 
                                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                                    color: purpleColors.primary,
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                  }}>
                                    {resource.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  {resource.name}
                                </div>
                              </td>
                              <td>{resource.role}</td>
                              <td>{resource.department}</td>
                              <td>{allocatedHours} hours</td>
                              <td>{capacity} hours</td>
                              <td>
                                <div className="progress progress-thin">
                                  <div 
                                    className="progress-bar" 
                                    style={{ 
                                      width: `${Math.min(100, utilization * 100)}%`,
                                      backgroundColor: utilization > 1 ? purpleColors.accent2 : 
                                                     utilization > 0.8 ? purpleColors.tertiary : purpleColors.completed
                                    }}
                                  ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                  <small style={{ 
                                    color: utilization > 1 ? purpleColors.accent2 : 
                                           utilization > 0.8 ? purpleColors.tertiary : purpleColors.completed
                                  }}>
                                    {Math.round(utilization * 100)}%
                                  </small>
                                  {utilization > 1 && (
                                    <small className="text-danger">Overallocated</small>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
