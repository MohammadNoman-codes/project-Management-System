import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import dashboardService from '../services/dashboardService';
import '../styles/dashboard.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  // Purple-themed color palette for charts
  const chartColors = {
    // Primary purple shades
    primary: '#6a4c93',      // Deep purple
    secondary: '#8363ac',    // Medium purple
    tertiary: '#9d80c3',     // Light purple
    quaternary: '#b39ddb',   // Lavender
    quinary: '#d1c4e9',      // Very light purple
    
    // Complementary colors
    accent1: '#4d4398',      // Blue-purple
    accent2: '#7e57c2',      // Brighter purple
    accent3: '#5e35b1',      // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
    underBudget: '#7986cb',  // Blue-purple
    onBudget: '#9575cd',     // Medium purple
    overBudget: '#8559da',   // Bright purple
  };

  // State variables for data from database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // KPI States
  const [activeProjects, setActiveProjects] = useState(0);
  const [taskCompletionRate, setTaskCompletionRate] = useState(0);
  const [onTimeDeliveryRate, setOnTimeDeliveryRate] = useState(0);
  const [activeRisks, setActiveRisks] = useState(0);
  const [criticalRisks, setCriticalRisks] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [spentToDate, setSpentToDate] = useState(0);
  const [forecastedAmount, setForecastedAmount] = useState(0);
  
  // Chart data states
  const [projectStatusData, setProjectStatusData] = useState(null);
  const [taskCompletionData, setTaskCompletionData] = useState(null);
  const [budgetAllocationData, setBudgetAllocationData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  
  // Table data state
  const [topProjects, setTopProjects] = useState([]);
  
  // Notification data states
  const [notifications, setNotifications] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Fetch all dashboard data from the database
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch KPI data
        const kpiData = await dashboardService.getKPIs();
        setActiveProjects(kpiData.activeProjects);
        setTaskCompletionRate(kpiData.taskCompletionRate);
        setOnTimeDeliveryRate(kpiData.onTimeDeliveryRate);
        setActiveRisks(kpiData.activeRisks);
        setCriticalRisks(kpiData.criticalRisks);
        setTotalBudget(kpiData.totalBudget);
        setSpentToDate(kpiData.spentToDate);
        setForecastedAmount(kpiData.forecastedAmount);
        
        // Fetch chart data
        const projectStatus = await dashboardService.getProjectStatusDistribution();
        setProjectStatusData({
          labels: projectStatus.labels,
          datasets: [
            {
              label: 'Project Status',
              data: projectStatus.data,
              backgroundColor: [
                chartColors.inProgress,
                chartColors.tertiary,
                chartColors.completed,
              ],
              borderWidth: 1,
            },
          ],
        });
        
        const taskStatus = await dashboardService.getTaskStatusDistribution();
        setTaskCompletionData({
          labels: taskStatus.labels,
          datasets: [
            {
              label: 'Task Status',
              data: taskStatus.data,
              backgroundColor: [
                chartColors.completed,
                chartColors.inProgress,
                chartColors.review,
                chartColors.todo,
              ],
              borderWidth: 1,
            },
          ],
        });
        
        const budgetAllocation = await dashboardService.getBudgetAllocation();
        setBudgetAllocationData({
          labels: budgetAllocation.labels,
          datasets: [
            {
              label: 'Budget Allocation',
              data: budgetAllocation.data,
              backgroundColor: [
                chartColors.primary,
                chartColors.secondary,
                chartColors.tertiary,
                chartColors.quaternary,
                chartColors.quinary,
              ],
              borderWidth: 1,
            },
          ],
        });
        
        const riskDistribution = await dashboardService.getRiskDistribution();
        setRiskData({
          labels: riskDistribution.labels,
          datasets: [
            {
              label: 'Risks by Severity',
              data: riskDistribution.data,
              backgroundColor: [
                chartColors.quaternary,
                chartColors.tertiary,
                chartColors.secondary,
                chartColors.primary,
              ],
              borderWidth: 1,
            },
          ],
        });
        
        // Fetch table data
        const projects = await dashboardService.getTopProjectsByBudgetVariance();
        setTopProjects(projects);
        
        // Fetch notification data
        const recentNotifications = await dashboardService.getRecentNotifications();
        setNotifications(recentNotifications);
        
        // Fetch upcoming tasks
        const upcoming = await dashboardService.getUpcomingTasks();
        setUpcomingTasks(upcoming);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <div className="spinner-border" style={{ color: chartColors.primary }} role="status">
            <span className="visually-hidden">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <div className="dashboard">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Dashboard</h1>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle rounded-pill" type="button" id="dashboardActions" data-bs-toggle="dropdown">
              <i className="bi bi-gear me-1"></i> Options
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Filter Data</a></li>
              <li><a className="dropdown-item" href="#">Customize View</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Summary KPI Cards with data from database */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Active Projects</h6>
                <h2 className="kpi-value">{activeProjects}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(106, 76, 147, 0.1)' }}>
                <i className="bi bi-briefcase fs-3" style={{ color: chartColors.primary }}></i>
              </div>
            </div>
            <p className="text-success mt-2 mb-0 small"><i className="bi bi-arrow-up"></i> +{activeProjects - 3} since last month</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '56%', backgroundColor: chartColors.primary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Task Completion</h6>
                <h2 className="kpi-value">{taskCompletionRate}%</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(179, 157, 219, 0.1)' }}>
                <i className="bi bi-check-circle fs-3" style={{ color: chartColors.completed }}></i>
              </div>
            </div>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${taskCompletionRate}%`, backgroundColor: chartColors.completed }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">On-time Delivery</h6>
                <h2 className="kpi-value">{onTimeDeliveryRate}%</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(157, 128, 195, 0.1)' }}>
                <i className="bi bi-clock fs-3" style={{ color: chartColors.tertiary }}></i>
              </div>
            </div>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${onTimeDeliveryRate}%`, backgroundColor: chartColors.tertiary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Active Risks</h6>
                <h2 className="kpi-value">{activeRisks}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(126, 87, 194, 0.1)' }}>
                <i className="bi bi-exclamation-triangle fs-3" style={{ color: chartColors.accent2 }}></i>
              </div>
            </div>
            <p className="text-danger mt-2 mb-0 small"><i className="bi bi-arrow-up"></i> {criticalRisks} critical risks need attention</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '75%', backgroundColor: chartColors.accent2 }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial KPIs with data from database */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-body">
              <h6 className="kpi-title">Total Budget</h6>
              <h2 className="kpi-value">BHD {(totalBudget / 1000).toFixed(0)}K</h2>
              <p className="text-muted mb-3">Across all active projects</p>
              <div className="progress progress-thin mt-2">
                <div className="progress-bar" style={{ width: '100%', backgroundColor: chartColors.primary }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-body">
              <h6 className="kpi-title">Spent to Date</h6>
              <h2 className="kpi-value">BHD {(spentToDate / 1000).toFixed(0)}K</h2>
              <p style={{ color: chartColors.tertiary }} className="mb-3">{((spentToDate / totalBudget) * 100).toFixed(1)}% of total budget</p>
              <div className="progress progress-thin mt-2">
                <div className="progress-bar" style={{ width: `${(spentToDate / totalBudget) * 100}%`, backgroundColor: chartColors.tertiary }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-body">
              <h6 className="kpi-title">Forecasted EOY</h6>
              <h2 className="kpi-value">BHD {(forecastedAmount / 1000).toFixed(0)}K</h2>
              <p style={{ color: chartColors.completed }} className="mb-3">{((1 - forecastedAmount / totalBudget) * 100).toFixed(1)}% under budget</p>
              <div className="progress progress-thin mt-2">
                <div className="progress-bar" style={{ width: `${(forecastedAmount / totalBudget) * 100}%`, backgroundColor: chartColors.completed }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project and Task Status charts with data from database */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-clipboard-data me-2"></i>Project Status
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {projectStatusData && (
                  <Pie 
                    data={projectStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 8
                        }
                      }
                    }}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Average Completion Rate</span>
                  <span>{taskCompletionRate}%</span>
                </div>
                <div className="progress progress-thin">
                  <div className="progress-bar" style={{ width: `${taskCompletionRate}%`, backgroundColor: chartColors.primary }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-list-check me-2"></i>Task Status Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {taskCompletionData && (
                  <Bar
                    data={taskCompletionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 8
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          },
                          title: {
                            display: true,
                            text: 'Number of Tasks',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          ticks: {
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
              {taskCompletionData && (
                <div className="mt-3 small">
                  <div className="row text-center">
                    {taskCompletionData.labels.map((label, index) => (
                      <div className="col-3" key={label}>
                        <div className="status-indicator" style={{ backgroundColor: taskCompletionData.datasets[0].backgroundColor[index] }}></div>
                        <div>{label}: {taskCompletionData.datasets[0].data[index]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget and Risk Statistics with data from database */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-cash-coin me-2"></i>Budget Allocation
              </h5>
              <span className="badge" style={{ backgroundColor: chartColors.primary }}>BHD {(totalBudget / 1000).toFixed(0)}K Total</span>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {budgetAllocationData && (
                  <Doughnut 
                    data={budgetAllocationData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let value = context.raw;
                              let percentage = context.parsed;
                              return `${context.label}: ${value}% (BHD ${Math.round(totalBudget * value / 100 / 1000)}K)`;
                            }
                          },
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 8
                        }
                      },
                      cutout: '70%'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-shield-exclamation me-2"></i>Risk Analysis
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                {riskData && (
                  <Pie
                    data={riskData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 8
                        }
                      }
                    }}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-1 small">
                  <span>Critical & High Risks</span>
                  <span className="badge" style={{ backgroundColor: chartColors.primary }}>{criticalRisks} Active</span>
                </div>
                <div className="progress progress-thin">
                  <div className="progress-bar" style={{ width: `${(criticalRisks / activeRisks) * 100}%`, backgroundColor: chartColors.primary }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Projects Table with data from database */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-graph-up-arrow me-2"></i>Top Projects by Budget Variance
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Budget (BHD)</th>
                  <th>Actual (BHD)</th>
                  <th>Variance</th>
                  <th>Completion</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((project) => {
                  const variance = project.actual - project.budget;
                  const variancePercent = (variance / project.budget) * 100;
                  const isOverBudget = variance > 0;
                  
                  return (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.budget.toLocaleString()}</td>
                      <td>{project.actual.toLocaleString()}</td>
                      <td className={isOverBudget ? "text-danger" : "text-success"}>
                        {isOverBudget ? '+' : ''}{variance.toLocaleString()} ({Math.abs(variancePercent).toFixed(1)}% {isOverBudget ? 'over' : 'under'})
                      </td>
                      <td>
                        <div className="progress progress-thin">
                          <div className="progress-bar" style={{ width: `${project.completion}%`, backgroundColor: getStatusColor(project.status, chartColors) }}></div>
                        </div>
                        <small>{project.completion}%</small>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getBudgetStatusColor(variance, chartColors) }}>
                          {isOverBudget ? 'Over Budget' : 'Under Budget'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Alert Cards and Notifications with data from database */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bell me-2"></i>Recent Notifications
              </h5>
            </div>
            <div className="card-body">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item" style={{ borderLeftColor: getNotificationColor(notification.type, chartColors) }}>
                  <div className="d-flex">
                    <div className="me-2 flex-shrink-0">
                      <i className={`bi ${getNotificationIcon(notification.type)}`} style={{ color: getNotificationColor(notification.type, chartColors) }}></i>
                    </div>
                    <div>
                      <strong>{notification.title}</strong> {notification.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>Upcoming Tasks
              </h5>
            </div>
            <div className="card-body">
              <ul className="task-list">
                {upcomingTasks.map((task) => (
                  <li key={task.id} className="task-list-item">
                    <div>
                      <h6 className="mb-1">{task.name}</h6>
                      <p className="text-muted small mb-0">Due: {formatDate(task.dueDate)}</p>
                    </div>
                    <span className="badge" style={{ 
                      backgroundColor: `rgba(${hexToRgb(getTaskUrgencyColor(task.daysRemaining, chartColors))}, 0.1)`, 
                      color: getTaskUrgencyColor(task.daysRemaining, chartColors) 
                    }}>
                      {task.daysRemaining} days left
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert hex color to RGB for rgba usage
function hexToRgb(hex) {
  // Check for undefined/null input
  if (!hex) return '0, 0, 0';
  
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

// Helper function to determine project status color
function getStatusColor(status, colors) {
  switch (status) {
    case 'Completed': return colors.completed;
    case 'Active': return colors.primary;
    case 'At Risk': return colors.accent2;
    case 'On Hold': return colors.tertiary;
    default: return colors.quaternary;
  }
}

// Helper function to determine budget status color
function getBudgetStatusColor(variance, colors) {
  if (variance > 0) return colors.primary; // Over budget
  if (variance < 0) return colors.completed; // Under budget
  return colors.tertiary; // On budget
}

// Helper function to determine notification color
function getNotificationColor(type, colors) {
  switch (type) {
    case 'warning': return colors.accent2;
    case 'info': return colors.tertiary;
    case 'success': return colors.completed;
    default: return colors.primary;
  }
}

// Helper function to determine notification icon
function getNotificationIcon(type) {
  switch (type) {
    case 'warning': return 'bi-exclamation-triangle-fill';
    case 'info': return 'bi-info-circle-fill';
    case 'success': return 'bi-check-circle-fill';
    default: return 'bi-bell-fill';
  }
}

// Helper function to determine task urgency color
function getTaskUrgencyColor(daysRemaining, colors) {
  if (daysRemaining <= 3) return colors.accent2;
  if (daysRemaining <= 7) return colors.tertiary;
  return colors.quaternary;
}

// Helper function to format date
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default Dashboard;
