import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  RadialLinearScale,
  Tooltip, 
  Legend 
} from 'chart.js';
import analyticsService from '../../services/AnalyticsService.js';
// import analyticsService from '../../services/AnalyticsService.js';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale, // This is needed for Radar and PolarArea charts
  Tooltip,
  Legend
);

import FinancialTab from './tabs/FinancialTab';
import OverviewTab from './tabs/OverviewTab';
import ProjectsTab from './tabs/ProjectsTab';
import ResourcesTab from './tabs/ResourcesTab';
import RisksTab from './tabs/RisksTab';

// Define hexToRgb utility function outside the component
function hexToRgb(hex) {
  // Check for undefined/null input
  if (!hex) return '0, 0, 0'; // Return default RGB for undefined/null input
  
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

function ReportingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState({
    projectId: 'all',
    dateRange: 'month',
    department: 'all'
  });
  
  const [loading, setLoading] = useState(true);
  const [chartColors, setChartColors] = useState({
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    light: '#f8f9fa',
    dark: '#212529',
    completed: '#20c997',
    tertiary: '#fd7e14',
    quaternary: '#6f42c1',
    accent1: '#17a2b8',
    accent2: '#6610f2',
    accent3: '#e83e8c'
  });
  
  // Initialize state for data
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 24,
    activeProjectPercentage: 75,
    totalTasks: 186,
    completedTaskPercentage: 62,
    totalBudget: 4500000,
    budgetUtilizationPercentage: 45,
    totalRisks: 37,
    criticalRiskPercentage: 15
  });
  
  const [projectTypeDistribution, setProjectTypeDistribution] = useState({});
  const [statusDistribution, setStatusDistribution] = useState({});
  const [kpis, setKpis] = useState({});
  const [monthlyProgressData, setMonthlyProgressData] = useState({});
  const [projectPriorityDistribution, setProjectPriorityDistribution] = useState({});
  const [recentProjects, setRecentProjects] = useState([]);
  
  const [financialData, setFinancialData] = useState({});
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [risks, setRisks] = useState([]);

  // Add state for ProjectsTab data
  const [projectHealthData, setProjectHealthData] = useState([]);
  const [projectTaskCompletionData, setProjectTaskCompletionData] = useState({});
  const [milestonesData, setMilestonesData] = useState({});
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  // Add state for FinancialTab data
  const [financialSummary, setFinancialSummary] = useState({});
  const [expensesTrend, setExpensesTrend] = useState({});
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [budgetVariance, setBudgetVariance] = useState({});
  const [budgetForecast, setBudgetForecast] = useState({});

  // Add state for RisksTab data
  const [riskSeverity, setRiskSeverity] = useState({});
  const [riskCategories, setRiskCategories] = useState({});
  const [riskTrends, setRiskTrends] = useState({});
  const [riskExposure, setRiskExposure] = useState({});
  const [topRisks, setTopRisks] = useState([]);
  const [riskSummary, setRiskSummary] = useState({});

  // Load mock data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch data for OverviewTab using the report endpoints
        const [
          kpiData, 
          typeDistData, 
          statusDistData, 
          priorityDistData,
          timelineData
        ] = await Promise.all([
          analyticsService.getReportKPIs(),
          analyticsService.getProjectTypes(),
          analyticsService.getTaskStatus(),
          analyticsService.getProjectStatus(),
          analyticsService.getProjectsTimeline() // This fetches the project timeline data
        ]);
        
        console.log('Timeline data fetched:', timelineData); // Debug log to check the data format

        // Set dashboard stats from kpiData
        setDashboardStats(kpiData); 

        // Project Type Distribution
        setProjectTypeDistribution(
          typeDistData.labels.reduce((acc, label, idx) => {
            acc[label] = typeDistData.data[idx];
            return acc;
          }, {})
        );

        // Status Distribution
        setStatusDistribution(
          statusDistData.labels.reduce((acc, label, idx) => {
            acc[label] = statusDistData.data[idx];
            return acc;
          }, {})
        );
        
        // Project Priority Distribution
        setProjectPriorityDistribution(
          priorityDistData.labels.reduce((acc, label, idx) => {
            acc[label] = priorityDistData.data[idx];
            return acc;
          }, {})
        );

        // Set KPIs
        setKpis({ 
          schedulePerformanceIndex: kpiData.schedulePerformanceIndex || 1,
          costPerformanceIndex: kpiData.costPerformanceIndex || 1,
          resourceUtilization: kpiData.resourceUtilization || 80,
          budgetVariance: kpiData.budgetVariance || 0,
          qualityIndex: kpiData.qualityIndex || 90
        });

        // Set Monthly Progress Data (dummy for now, or fetch if available)
        setMonthlyProgressData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Planned Progress', data: [10, 20, 40, 60, 80, 100], borderColor: chartColors.primary, backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 },
            { label: 'Actual Progress', data: [8, 18, 35, 55, 75, 90], borderColor: chartColors.accent1, backgroundColor: 'transparent', borderWidth: 2, tension: 0.4 }
          ]
        });
        
        // Set Recent Projects for Timeline Summary
        setRecentProjects(timelineData || []);

        // Only fetch ProjectsTab data when that tab is selected or is about to be selected
        if (activeTab === 'projects' || activeTab === 'overview') {
          // Fetch data for ProjectsTab
          const [
            projectHealth,
            taskCompletionData, 
            milestonesStatusData,
            upcomingTasksData,
            completedTasksData
          ] = await Promise.all([
            analyticsService.getProjectHealth(),
            analyticsService.getTaskCompletion(),
            analyticsService.getMilestoneStatus(),
            analyticsService.getUpcomingTasks(),
            analyticsService.getCompletedTasks()
          ]);
          
          setProjectHealthData(projectHealth || []);
          setProjectTaskCompletionData(taskCompletionData || { labels: [], datasets: [] });
          setMilestonesData(milestonesStatusData || { labels: [], datasets: [] });
          setUpcomingTasks(upcomingTasksData || []);
          setCompletedTasks(completedTasksData || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reporting data:", error);
        setLoading(false);
        // Set default values in case of error
        setDashboardStats(null);
        setProjectTypeDistribution({});
        setStatusDistribution({});
        setKpis({ schedulePerformanceIndex: 0, costPerformanceIndex: 0, resourceUtilization: 0, budgetVariance: 0, qualityIndex: 0 });
        setMonthlyProgressData({ labels: [], datasets: [] });
        setProjectPriorityDistribution({});
        setRecentProjects([]);
        
        // Set default values for projects tab
        setProjectHealthData([]);
        setProjectTaskCompletionData({ labels: [], datasets: [] });
        setMilestonesData({ labels: [], datasets: [] });
        setUpcomingTasks([]);
        setCompletedTasks([]);
      }
    };

    fetchAllData();
  }, [filter, activeTab]); // Re-fetch if filter changes or active tab changes

  // When active tab changes, fetch data for the new tab if needed
  useEffect(() => {
    if (activeTab === 'projects' && projectHealthData.length === 0) {
      const fetchProjectsData = async () => {
        setLoading(true);
        try {
          const [
            projectHealth,
            taskCompletionData, 
            milestonesStatusData,
            upcomingTasksData,
            completedTasksData
          ] = await Promise.all([
            analyticsService.getProjectHealth(),
            analyticsService.getTaskCompletion(),
            analyticsService.getMilestoneStatus(),
            analyticsService.getUpcomingTasks(),
            analyticsService.getCompletedTasks()
          ]);
          
          setProjectHealthData(projectHealth || []);
          setProjectTaskCompletionData(taskCompletionData || { labels: [], datasets: [] });
          setMilestonesData(milestonesStatusData || { labels: [], datasets: [] });
          setUpcomingTasks(upcomingTasksData || []);
          setCompletedTasks(completedTasksData || []);
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching projects data:", error);
          setLoading(false);
        }
      };
      
      fetchProjectsData();
    }

    // Add Financial data fetching
    if (activeTab === 'financial' && Object.keys(financialSummary).length === 0) {
      const fetchFinancialData = async () => {
        setLoading(true);
        try {
          const [
            summaryData,
            expensesTrendData,
            expensesByCategoryData,
            budgetVarianceData,
            budgetForecastData
          ] = await Promise.all([
            analyticsService.getFinancialSummary(),
            analyticsService.getExpensesTrend(),
            analyticsService.getExpensesByCategory(),
            analyticsService.getBudgetVariance(),
            analyticsService.getBudgetForecast()
          ]);
          
          setFinancialSummary(summaryData || {});
          setExpensesTrend(expensesTrendData || {});
          setExpensesByCategory(expensesByCategoryData || {});
          setBudgetVariance(budgetVarianceData || {});
          setBudgetForecast(budgetForecastData || {});
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching financial data:", error);
          setLoading(false);
        }
      };
      
      fetchFinancialData();
    }

    // Add Risks data fetching
    if (activeTab === 'risks' && topRisks.length === 0) {
      const fetchRisksData = async () => {
        setLoading(true);
        try {
          // Add console logs to debug the data fetching process
          console.log("Fetching risk data...");
          
          const [
            severityData,
            categoriesData,
            trendsData,
            exposureData,
            risksData,
            summaryData
          ] = await Promise.all([
            analyticsService.getRiskSeverity(),
            analyticsService.getRiskCategories(),
            analyticsService.getRiskTrendsData(),
            analyticsService.getRiskExposure(),
            analyticsService.getTopRisks(),
            analyticsService.getRiskSummary()
          ]);
          
          // Log the received data to see what we're getting from the API
          console.log("Risk severity data:", severityData);
          console.log("Risk categories data:", categoriesData);
          console.log("Risk trends data:", trendsData);
          console.log("Risk exposure data:", exposureData);
          console.log("Top risks data:", risksData);
          console.log("Risk summary data from Reporting Dashbaord:", summaryData);
          
          setRiskSeverity(severityData || {});
          setRiskCategories(categoriesData || {});
          setRiskTrends(trendsData || {});
          setRiskExposure(exposureData || {});
          setTopRisks(risksData || []);
          setRiskSummary(summaryData || {});
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching risks data:", error);
          setLoading(false);
        }
      };
      
      fetchRisksData();
    }
  }, [activeTab, projectHealthData.length, financialSummary, topRisks.length]);

  // Derived chart data based on state - Rename variables that conflict with state
  const projectStatusChartData = {
    labels: ['Active', 'Completed', 'On Hold', 'Cancelled'],
    datasets: [
      {
        label: 'Projects by Status',
        data: [
          projects.filter(p => p.status === 'Active').length,
          projects.filter(p => p.status === 'Completed').length,
          projects.filter(p => p.status === 'On Hold').length,
          projects.filter(p => p.status === 'Cancelled').length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Task completion trend data
  const taskCompletionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [12, 19, 15, 28, 22, 30],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Created Tasks',
        data: [15, 20, 18, 25, 30, 35],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Budget data
  const budgetData = {
    labels: projects.map(p => p.title),
    datasets: [
      {
        label: 'Planned Budget',
        data: projects.map(p => p.budget),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Actual Expenses',
        data: projects.map(p => p.spent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };

  // Resource allocation data
  const resourceData = {
    labels: ['Development', 'Design', 'QA', 'Project Management', 'Other'],
    datasets: [
      {
        label: 'Resource Allocation',
        data: [
          resources.filter(r => r.department === 'Development').length,
          resources.filter(r => r.department === 'Design').length,
          resources.filter(r => r.department === 'QA').length,
          resources.filter(r => r.department === 'Project Management').length,
          resources.filter(r => !['Development', 'Design', 'QA', 'Project Management'].includes(r.department)).length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Resource utilization chart data
  const resourceUtilizationData = {
    labels: resources.map(r => r.name),
    datasets: [
      {
        label: 'Utilization %',
        data: resources.map(r => r.utilization),
        backgroundColor: resources.map(r => 
          r.utilization > 90 ? 'rgba(255, 99, 132, 0.6)' :
          r.utilization > 75 ? 'rgba(255, 206, 86, 0.6)' :
          'rgba(75, 192, 192, 0.6)'
        ),
        borderWidth: 1
      }
    ]
  };

  // Risk distribution data
  const riskData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Risks by Severity',
        data: [
          risks.filter(r => r.severity === 'Low').length,
          risks.filter(r => r.severity === 'Medium').length,
          risks.filter(r => r.severity === 'High').length,
          risks.filter(r => r.severity === 'Critical').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Project completion stats
  const projectCompletionStats = {
    labels: projects.map(p => p.title),
    datasets: [{
      label: 'Completion Percentage',
      data: projects.map(p => p.completion),
      backgroundColor: projects.map(p => 
        p.completion > 75 ? 'rgba(75, 192, 192, 0.6)' : 
        p.completion > 50 ? 'rgba(54, 162, 235, 0.6)' :
        p.completion > 25 ? 'rgba(255, 206, 86, 0.6)' :
        'rgba(255, 99, 132, 0.6)'
      )
    }]
  };

  // Financial data - Monthly expenses
  const monthlyExpensesData = {
    labels: financialData.expensesByMonth?.map(item => `${item.month} ${item.year}`) || [],
    datasets: [{
      label: 'Monthly Expenses',
      data: financialData.expensesByMonth?.map(item => item.amount) || [],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };

  // Financial data - Expenses by category
  const expensesByCategoryData = {
    labels: financialData.expensesByCategory?.map(item => item.category) || [],
    datasets: [{
      label: 'Amount',
      data: financialData.expensesByCategory?.map(item => item.amount) || [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  };

  // Risk status chart
  const riskStatusData = {
    labels: ['Active', 'Monitoring', 'Mitigating', 'Resolved'],
    datasets: [{
      label: 'Risks by Status',
      data: [
        risks.filter(r => r.status === 'Active').length,
        risks.filter(r => r.status === 'Monitoring').length,
        risks.filter(r => r.status === 'Mitigating').length,
        risks.filter(r => r.status === 'Resolved').length
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)'
      ]
    }]
  };

  // Risk severity by project
  const riskSeverityByProject = {
    labels: [...new Set(risks.map(r => r.project))],
    datasets: [
      {
        label: 'Critical',
        data: [...new Set(risks.map(r => r.project))].map(
          project => risks.filter(r => r.project === project && r.severity === 'Critical').length
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      },
      {
        label: 'High',
        data: [...new Set(risks.map(r => r.project))].map(
          project => risks.filter(r => r.project === project && r.severity === 'High').length
        ),
        backgroundColor: 'rgba(255, 206, 86, 0.6)'
      },
      {
        label: 'Medium',
        data: [...new Set(risks.map(r => r.project))].map(
          project => risks.filter(r => r.project === project && r.severity === 'Medium').length
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Low',
        data: [...new Set(risks.map(r => r.project))].map(
          project => risks.filter(r => r.project === project && r.severity === 'Low').length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  // Update monthly progress data based on our projects
  const updatedMonthlyProgressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Planned',
        data: [5, 10, 15, 25, 35, 45, 55, 65, 75, 85, 95, 100],
        borderColor: chartColors.primary,
        tension: 0.3,
        fill: false
      },
      {
        label: 'Actual',
        data: [4, 8, 14, 22, 37, 48, 58, 67, 76, null, null, null],
        borderColor: chartColors.success,
        tension: 0.3,
        fill: false
      }
    ]
  };

  // Project task completion data - RENAME to avoid conflict with state
  const staticTaskCompletionData = {
    labels: projects.map(p => p.title),
    datasets: [
      {
        label: 'Completed Tasks',
        data: projects.map(p => p.completedTasks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Total Tasks',
        data: projects.map(p => p.tasks),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  // Project timeline data (progress vs elapsed time)
  const projectTimelineChartData = {
    labels: projects.map(p => p.title),
    datasets: [
      {
        label: 'Completion',
        data: projects.map(p => p.completion),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Elapsed Time',
        data: projects.map(p => {
          const startDate = new Date(p.startDate);
          const endDate = new Date(p.endDate);
          const today = new Date();
          const totalDuration = endDate - startDate;
          const elapsed = today - startDate;
          return totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 0;
        }),
        backgroundColor: 'rgba(255, 206, 86, 0.6)'
      }
    ]
  };

  // Milestone achievement data - RENAME to avoid conflict with state
  const staticMilestonesData = {
    labels: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
    datasets: [
      {
        label: 'Milestone Status',
        data: [12, 19, 25, 5], // Mock data - replace with actual milestone statistics
        backgroundColor: [
          'rgba(108, 117, 125, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Project phases detailed data
  const projectPhasesDetailedData = {
    labels: ['Planning', 'Design', 'Development', 'Testing', 'Deployment'],
    datasets: projects.slice(0, 3).map((project, index) => {
      // Generate different completion percentages for each phase
      const baseCompletion = project.completion;
      const phaseCompletions = [
        Math.min(100, baseCompletion + 20), 
        Math.min(100, baseCompletion + 10), 
        baseCompletion, 
        Math.max(0, baseCompletion - 15), 
        Math.max(0, baseCompletion - 30)
      ];
      
      return {
        label: project.title,
        data: phaseCompletions,
        backgroundColor: `rgba(${hexToRgb(Object.values(chartColors)[index + 1])}, 0.6)`
      };
    })
  };

  // Risk exposure data for radar chart
  const projectRiskExposureData = {
    labels: ['Schedule Risk', 'Budget Risk', 'Scope Risk', 'Resource Risk', 'Technical Risk', 'Quality Risk'],
    datasets: projects.slice(0, 3).map((project, index) => {
      // Generate risk scores between 1-10
      const getRandomRiskScore = () => Math.floor(Math.random() * 10) + 1;
      
      return {
        label: project.title,
        data: [
          getRandomRiskScore(),
          getRandomRiskScore(),
          getRandomRiskScore(),
          getRandomRiskScore(),
          getRandomRiskScore(),
          getRandomRiskScore()
        ],
        fill: true,
        backgroundColor: `rgba(${hexToRgb(Object.values(chartColors)[index + 2])}, 0.2)`,
        borderColor: Object.values(chartColors)[index + 2],
        pointBackgroundColor: Object.values(chartColors)[index + 2],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: Object.values(chartColors)[index + 2]
      };
    })
  };

  // Project health data for cards - RENAME to avoid conflict with state
  const staticProjectHealthData = projects.map(project => {
    // Calculate health metrics based on project data
    const timelineAdherence = Math.min(100, Math.max(60, 
      100 - Math.abs(project.completion - (project.completedTasks / project.tasks) * 100))
    );
    
    const budgetAdherence = Math.min(100, Math.max(60, 
      100 - ((Math.abs(project.spent - (project.budget * project.completion / 100)) / project.budget) * 100)
    ));
    
    const taskEfficiency = (project.completedTasks / project.tasks) * 100;
    
    // Quality score is a random value between 65-98 for demonstration
    const qualityScore = Math.floor(Math.random() * 33) + 65;
    
    // Overall health is an average of the metrics
    const overallHealth = Math.round((timelineAdherence + budgetAdherence + taskEfficiency + qualityScore) / 4);
    
    return {
      ...project,
      timelineAdherence,
      budgetAdherence,
      taskEfficiency,
      qualityScore,
      overallHealth
    };
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="reporting-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Reporting & Analytics</h1>
        <div className="d-flex">
          <div className="me-2">
            <select 
              className="form-select form-select-sm rounded-pill"
              name="dateRange"
              value={filter.dateRange}
              onChange={handleFilterChange}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-sliders me-1"></i> Custom Report
          </button>
          <button className="btn btn-primary rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading data...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <ul className="nav nav-tabs nav-fill mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-1"></i> Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="bi bi-kanban me-1"></i> Projects
              </button>
            </li>
            {/* <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="bi bi-person me-1"></i> Resources
              </button>
            </li> */}
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'financial' ? 'active' : ''}`}
                onClick={() => setActiveTab('financial')}
              >
                <i className="bi bi-currency-dollar me-1"></i> Financial
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'risks' ? 'active' : ''}`}
                onClick={() => setActiveTab('risks')}
              >
                <i className="bi bi-exclamation-triangle me-1"></i> Risks
              </button>
            </li>
          </ul>
          <div className="tab-content">
            {activeTab === 'overview' && <OverviewTab 
              chartColors={chartColors} 
              dashboardStats={dashboardStats}
              projectTypeDistribution={projectTypeDistribution}
              statusDistribution={statusDistribution}
              kpis={kpis}
              monthlyProgressData={updatedMonthlyProgressData}
              projectPriorityDistribution={projectPriorityDistribution}
              recentProjects={recentProjects} // Explicitly passing the timeline data to OverviewTab
              projectStatusData={projectStatusChartData}
              taskCompletionData={taskCompletionChartData}
              budgetData={budgetData}
              resourceData={resourceData}
              projectCompletionStats={projectCompletionStats}
            />}
            {activeTab === 'projects' && <ProjectsTab 
              projects={recentProjects} // Use the same projects data from timeline
              chartColors={chartColors}
              hexToRgb={hexToRgb}
              // Use the API data with fallback to static data if empty
              projectTaskCompletionData={projectTaskCompletionData.labels?.length > 0 ? 
                                   projectTaskCompletionData : staticTaskCompletionData}
              projectTimelineData={projectTimelineChartData}
              milestonesData={milestonesData.labels?.length > 0 ? 
                        milestonesData : staticMilestonesData}
              projectPhasesDetailedData={projectPhasesDetailedData}
              projectRiskExposureData={projectRiskExposureData}
              // Use API data with fallback to static data if empty
              projectHealthData={projectHealthData.length > 0 ? 
                           projectHealthData : staticProjectHealthData}
              upcomingTasks={upcomingTasks}
              completedTasks={completedTasks}
              filter={filter}
              handleFilterChange={handleFilterChange}
            />}
            {activeTab === 'resources' && <ResourcesTab 
              chartColors={chartColors}
              resources={resources}
              resourceUtilizationData={resourceUtilizationData}
              resourceAllocationByDepartmentData={{
                labels: [...new Set(resources.map(r => r.department))],
                datasets: [
                  {
                    label: 'Allocated Hours',
                    data: [...new Set(resources.map(r => r.department))].map(
                      dept => resources.filter(r => r.department === dept)
                        .reduce((sum, r) => sum + r.allocatedHours, 0)
                    ),
                    backgroundColor: chartColors.primary
                  },
                  {
                    label: 'Available Hours',
                    data: [...new Set(resources.map(r => r.department))].map(
                      dept => resources.filter(r => r.department === dept)
                        .reduce((sum, r) => sum + (r.capacity - r.allocatedHours), 0)
                    ),
                    backgroundColor: chartColors.success
                  }
                ]
              }}
              resourceCapacityData={{
                labels: resources.map(r => r.name),
                datasets: [
                  {
                    label: 'Allocated',
                    data: resources.map(r => r.allocatedHours),
                    backgroundColor: chartColors.primary
                  },
                  {
                    label: 'Remaining',
                    data: resources.map(r => r.capacity - r.allocatedHours),
                    backgroundColor: chartColors.success
                  }
                ]
              }}
              resourceSkillCoverageData={{
                labels: Array.from(new Set(resources.flatMap(r => r.skills))),
                datasets: [{
                  label: 'Number of Resources',
                  data: Array.from(new Set(resources.flatMap(r => r.skills))).map(
                    skill => resources.filter(r => r.skills.includes(skill)).length
                  ),
                  backgroundColor: chartColors.primary
                }]
              }}
              resourceTrendData={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [
                  {
                    label: 'Development',
                    data: [75, 78, 80, 82, 85, 88, 90, 92, 95],
                    borderColor: chartColors.primary,
                    backgroundColor: 'transparent'
                  },
                  {
                    label: 'QA',
                    data: [65, 68, 70, 72, 75, 78, 80, 85, 90],
                    borderColor: chartColors.success,
                    backgroundColor: 'transparent'
                  },
                  {
                    label: 'Design',
                    data: [85, 88, 90, 92, 95, 96, 97, 98, 99],
                    borderColor: chartColors.warning,
                    backgroundColor: 'transparent'
                  }
                ]
              }}
              filter={filter}
              handleFilterChange={handleFilterChange}
            />}
            {activeTab === 'financial' && <FinancialTab 
              chartColors={chartColors}
              projects={recentProjects} // Use the same project data from timeline
              financialData={{
                // Combine all financial data into one object
                ...financialSummary,
                ...expensesTrend,
                ...expensesByCategory,
                ...budgetVariance,
                ...budgetForecast
              }}
              filter={filter}
              handleFilterChange={handleFilterChange}
            />}
            {activeTab === 'risks' && <RisksTab 
              chartColors={chartColors}
              projects={recentProjects} // Use the same project data from timeline
              risks={topRisks}
              riskSeverityData={{
                labels: riskSeverity.labels || [],
                counts: riskSeverity.counts || []
              }}
              riskCategoriesData={riskCategories.categories || []}
              riskTrendsData={riskTrends}
              riskExposureData={riskExposure.projectRiskExposure || []}
              riskSummary={riskSummary}
              filter={filter}
              handleFilterChange={handleFilterChange}
            />}
          </div>
        </>
      )}
    </div>
  );
}

export default ReportingDashboard;
