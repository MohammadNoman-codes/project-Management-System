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
  
  const [financialData, setFinancialData] = useState({});
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [risks, setRisks] = useState([]);

  // Load mock data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock projects data
      const mockProjects = [
        {
          id: 1,
          title: 'Project Management System',
          status: 'Active',
          completion: 45,
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          budget: 125000,
          spent: 60000,
          manager: 'Mohammad',
          department: 'IT',
          tasks: 32,
          completedTasks: 15
        },
        {
          id: 2,
          title: 'Hamad Twon Park (حديقة مدينة حمد)',
          status: 'Active',
          completion: 25,
          startDate: '2023-03-15',
          endDate: '2024-06-30',
          budget: 780000,
          spent: 210000,
          manager: 'Ali',
          department: 'Infrastructure',
          tasks: 48,
          completedTasks: 12
        },
        {
          id: 3,
          title: 'Public Park Development',
          status: 'Completed',
          completion: 100,
          startDate: '2022-05-10',
          endDate: '2023-02-28',
          budget: 450000,
          spent: 438000,
          manager: 'Ahmed',
          department: 'Public Works',
          tasks: 56,
          completedTasks: 56
        },
        {
          id: 4,
          title: 'الحديقة البيئية- ECO WALK',
          status: 'On Hold',
          completion: 35,
          startDate: '2022-08-15',
          endDate: '2023-09-30',
          budget: 320000,
          spent: 112000,
          manager: 'Abdullah',
          department: 'Transportation',
          tasks: 42,
          completedTasks: 15
        },
        {
          id: 5,
          title: 'Salman City Park (حديقة مدينة سلمان)',
          status: 'Active',
          completion: 65,
          startDate: '2023-02-01',
          endDate: '2023-11-15',
          budget: 280000,
          spent: 182000,
          manager: 'Mariam',
          department: 'Culture',
          tasks: 38,
          completedTasks: 25
        }
      ];

      // Mock resources data
      const mockResources = [
        {
          id: 1,
          name: 'Mohammad',
          department: 'Development',
          role: 'Senior Developer',
          utilization: 85,
          availability: 15,
          allocatedProjects: 3,
          skills: ['React', 'Node.js', 'MongoDB'],
          projects: [
            { name: 'Project Management System', allocation: 40 },
            { name: 'City Library Modernization', allocation: 45 }
          ],
          billableHours: 34,
          allocatedHours: 34,
          capacity: 40
        },
        {
          id: 2,
          name: 'Ahmed',
          department: 'Design',
          role: 'UI/UX Designer',
          utilization: 90,
          availability: 10,
          allocatedProjects: 2,
          skills: ['UI Design', 'Figma', 'User Research'],
          projects: [
            { name: 'Project Management System', allocation: 50 },
            { name: 'City Library Modernization', allocation: 40 }
          ],
          billableHours: 36,
          allocatedHours: 36,
          capacity: 40
        },
        {
          id: 3,
          name: 'Ali',
          department: 'Development',
          role: 'Backend Developer',
          utilization: 75,
          availability: 25,
          allocatedProjects: 2,
          skills: ['Java', 'Spring Boot', 'SQL'],
          projects: [
            { name: 'Project Management System', allocation: 35 },
            { name: 'Hospital Renovation', allocation: 40 }
          ],
          billableHours: 30,
          allocatedHours: 30,
          capacity: 40
        },
        {
          id: 4,
          name: 'Abdulla',
          department: 'QA',
          role: 'Test Engineer',
          utilization: 65,
          availability: 35,
          allocatedProjects: 3,
          skills: ['QA Automation', 'Selenium', 'Cucumber'],
          projects: [
            { name: 'Project Management System', allocation: 25 },
            { name: 'Hospital Renovation', allocation: 20 },
            { name: 'City Library Modernization', allocation: 20 }
          ],
          billableHours: 26,
          allocatedHours: 26,
          capacity: 40
        },
        {
          id: 5,
          name: 'Mariam',
          department: 'Development',
          role: 'Frontend Developer',
          utilization: 100,
          availability: 0,
          allocatedProjects: 1,
          skills: ['React', 'TypeScript', 'SCSS'],
          projects: [
            { name: 'Road Safety Improvements', allocation: 100 }
          ],
          billableHours: 40,
          allocatedHours: 40,
          capacity: 40
        },
        {
          id: 6,
          name: 'Salman',
          department: 'Project Management',
          role: 'Project Manager',
          utilization: 80,
          availability: 20,
          allocatedProjects: 2,
          skills: ['PRINCE2', 'Agile', 'MS Project'],
          projects: [
            { name: 'Road Safety Improvements', allocation: 40 },
            { name: 'Public Park Development', allocation: 40 }
          ],
          billableHours: 32,
          allocatedHours: 32,
          capacity: 40
        },
        {
          id: 7,
          name: 'Omar',
          department: 'QA',
          role: 'QA Lead',
          utilization: 95,
          availability: 5,
          allocatedProjects: 4,
          skills: ['Test Planning', 'Test Case Design', 'QA Processes'],
          projects: [
            { name: 'Project Management System', allocation: 25 },
            { name: 'Hospital Renovation', allocation: 25 },
            { name: 'Road Safety Improvements', allocation: 25 },
            { name: 'City Library Modernization', allocation: 20 }
          ],
          billableHours: 38,
          allocatedHours: 38,
          capacity: 40
        }
      ];

      // Mock risks data
      const mockRisks = [
        {
          id: 1,
          title: 'Budget overrun',
          project: 'Project Management System',
          projectId: 1,
          severity: 'High',
          probability: 'Medium',
          impact: 'High',
          status: 'Mitigating',
          owner: 'Mohammad',
          category: 'Financial',
          dueDate: '2023-12-15'
        },
        {
          id: 2,
          title: 'Schedule delay',
          project: 'Hospital Renovation',
          projectId: 2,
          severity: 'High',
          probability: 'High',
          impact: 'High',
          status: 'Active',
          owner: 'Ahmed',
          category: 'Timeline',
          dueDate: '2023-11-30'
        },
        {
          id: 3,
          title: 'Resource unavailability',
          project: 'City Library Modernization',
          projectId: 5,
          severity: 'Medium',
          probability: 'Medium',
          impact: 'Medium',
          status: 'Monitoring',
          owner: 'Ali',
          category: 'Resources',
          dueDate: '2023-10-15'
        },
        {
          id: 4,
          title: 'Scope creep',
          project: 'Road Safety Improvements',
          projectId: 4,
          severity: 'Medium',
          probability: 'High',
          impact: 'Medium',
          status: 'Active',
          owner: 'Abdulla',
          category: 'Scope',
          dueDate: '2023-09-20'
        },
        {
          id: 5,
          title: 'Technology compatibility issues',
          project: 'Project Management System',
          projectId: 1,
          severity: 'Low',
          probability: 'Medium',
          impact: 'Low',
          status: 'Resolved',
          owner: 'Mariam',
          category: 'Technical',
          dueDate: '2023-08-30'
        },
        {
          id: 6,
          title: 'Contractor disputes',
          project: 'Hospital Renovation',
          projectId: 2,
          severity: 'High',
          probability: 'Medium',
          impact: 'High',
          status: 'Mitigating',
          owner: 'Salman',
          category: 'External',
          dueDate: '2023-10-10'
        },
        {
          id: 7,
          title: 'Permit delays',
          project: 'Public Park Development',
          projectId: 3,
          severity: 'Medium',
          probability: 'Low',
          impact: 'High',
          status: 'Resolved',
          owner: 'Omar',
          category: 'Regulatory',
          dueDate: '2023-01-15'
        },
        {
          id: 8,
          title: 'Safety incidents',
          project: 'Road Safety Improvements',
          projectId: 4,
          severity: 'Critical',
          probability: 'Low',
          impact: 'Critical',
          status: 'Monitoring',
          owner: 'Mohammad',
          category: 'Safety',
          dueDate: '2023-11-05'
        }
      ];

      // Mock financial data
      const mockFinancialData = {
        totalBudget: 1955000,
        totalSpent: 1002000,
        totalCommitted: 350000,
        totalRemaining: 603000,
        expensesByMonth: [
          { month: 'Jan', year: 2023, amount: 82000 },
          { month: 'Feb', year: 2023, amount: 98000 },
          { month: 'Mar', year: 2023, amount: 120000 },
          { month: 'Apr', year: 2023, amount: 145000 },
          { month: 'May', year: 2023, amount: 132000 },
          { month: 'Jun', year: 2023, amount: 157000 },
          { month: 'Jul', year: 2023, amount: 168000 },
          { month: 'Aug', year: 2023, amount: 100000 },
        ],
        expensesByCategory: [
          { category: 'Labor', amount: 580000 },
          { category: 'Materials', amount: 230000 },
          { category: 'Equipment', amount: 105000 },
          { category: 'Services', amount: 72000 },
          { category: 'Miscellaneous', amount: 15000 }
        ],
        projectBudgetVariance: [
          { project: 'Project Management System', variance: -5 }, // Under budget
          { project: 'Hospital Renovation', variance: 3 }, // Over budget
          { project: 'Public Park Development', variance: -2.7 }, // Under budget
          { project: 'Road Safety Improvements', variance: 0 }, // On budget
          { project: 'City Library Modernization', variance: 0.3 } // Over budget
        ],
        forecastByQuarter: [
          { quarter: 'Q1', year: 2023, forecast: 300000, actual: 300000 },
          { quarter: 'Q2', year: 2023, forecast: 450000, actual: 434000 },
          { quarter: 'Q3', year: 2023, forecast: 400000, actual: 268000 },
          { quarter: 'Q4', year: 2023, forecast: 500000, actual: null },
          { quarter: 'Q1', year: 2024, forecast: 305000, actual: null }
        ]
      };
      
      // Create department distribution data
      const departments = {};
      mockProjects.forEach(project => {
        departments[project.department] = (departments[project.department] || 0) + 1;
      });
      
      // Create status distribution data
      const statuses = {};
      mockProjects.forEach(project => {
        statuses[project.status] = (statuses[project.status] || 0) + 1;
      });
      
      // Update dashboard KPIs
      const updatedKpis = {
        schedulePerformanceIndex: 0.93,
        costPerformanceIndex: 1.02,
        resourceUtilization: mockResources.reduce((sum, r) => sum + r.utilization, 0) / mockResources.length,
        budgetVariance: -2.1,
        qualityIndex: 88
      };
      
      // Update dashboard stats
      const updatedStats = {
        totalProjects: mockProjects.length,
        activeProjectPercentage: (mockProjects.filter(p => p.status === 'Active').length / mockProjects.length) * 100,
        totalTasks: mockProjects.reduce((sum, p) => sum + p.tasks, 0),
        completedTaskPercentage: (mockProjects.reduce((sum, p) => sum + p.completedTasks, 0) / mockProjects.reduce((sum, p) => sum + p.tasks, 0)) * 100,
        totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
        budgetUtilizationPercentage: (mockProjects.reduce((sum, p) => sum + p.spent, 0) / mockProjects.reduce((sum, p) => sum + p.budget, 0)) * 100,
        totalRisks: mockRisks.length,
        criticalRiskPercentage: (mockRisks.filter(r => r.severity === 'Critical').length / mockRisks.length) * 100
      };
      
      setProjects(mockProjects);
      setResources(mockResources);
      setRisks(mockRisks);
      setFinancialData(mockFinancialData);
      setProjectTypeDistribution(departments);
      setStatusDistribution(statuses);
      setKpis(updatedKpis);
      setDashboardStats(updatedStats);
      setLoading(false);
    }, 1000);
  }, []);

  // Derived chart data based on state
  const projectStatusData = {
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
  const taskCompletionData = {
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

  // Project task completion data
  const projectTaskCompletionData = {
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
  const projectTimelineData = {
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

  // Milestone achievement data
  const milestonesData = {
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

  // Project health data for cards
  const projectHealthData = projects.map(project => {
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
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="bi bi-person me-1"></i> Resources
              </button>
            </li>
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
              projectStatusData={projectStatusData}
              taskCompletionData={taskCompletionData}
              budgetData={budgetData}
              resourceData={resourceData}
              projectCompletionStats={projectCompletionStats}
            />}
            {activeTab === 'projects' && <ProjectsTab 
              projects={projects}
              chartColors={chartColors}
              hexToRgb={hexToRgb}
              projectTaskCompletionData={projectTaskCompletionData}
              projectTimelineData={projectTimelineData}
              milestonesData={milestonesData}
              projectPhasesDetailedData={projectPhasesDetailedData}
              projectRiskExposureData={projectRiskExposureData}
              projectHealthData={projectHealthData}
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
              projects={projects}
              financialData={financialData}
              expensesByCategoryData={expensesByCategoryData}
              monthlyExpensesData={monthlyExpensesData}
              filter={filter}
              handleFilterChange={handleFilterChange}
            />}
            {activeTab === 'risks' && <RisksTab 
              chartColors={chartColors}
              projects={projects}
              risks={risks}
              riskStatusData={riskStatusData}
              riskData={riskData}
              riskSeverityByProject={riskSeverityByProject}
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
