import React from 'react';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';
import '../../../styles/dashboard.css';

function OverviewTab({ 
  dashboardStats, 
  projectTypeDistribution, 
  statusDistribution, 
  kpis,
  monthlyProgressData,
  projectPriorityDistribution,
  recentProjects = [] // Now we're receiving this as a prop
}) {
  // Purple-themed color palette for charts to match Dashboard
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
    
    // Functional colors
    success: '#7986cb',      // Blue-ish purple for success
    info: '#9575cd',         // Medium purple for info
    warning: '#5c6bc0',      // Blue-purple for warning
    danger: '#673ab7',       // Deep purple for danger
    completed: '#7986cb',    // Blue-ish purple
  };

  const hexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Return default RGB for undefined/null input
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Dummy data for project priority chart
  const priorityData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Projects',
        data: [3, 8, 6, 2],
        backgroundColor: [
          chartColors.quaternary,
          chartColors.tertiary,
          chartColors.secondary,
          chartColors.primary,
        ],
        borderWidth: 1
      }
    ]
  };

  // If data hasn't been loaded yet, show a loading indicator
  if (!dashboardStats || !kpis) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading dashboard data...</span>
        </div>
        <p className="mt-2">Loading overview data...</p>
      </div>
    );
  }

  // Format date for display (MM YYYY format)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  // Calculate project duration in months
  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calculate months between dates
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth()) + 
                    (end.getDate() >= start.getDate() ? 0 : -1);
      
      return months <= 0 ? '<1 month' : 
             months === 1 ? '1 month' : 
             `${months} months`;
    } catch (error) {
      console.error('Error calculating duration:', startDate, endDate, error);
      return 'N/A';
    }
  };

  // Determine the appropriate color and badge class based on status and completion
  const getStatusStyle = (status, completion) => {
    // Default to neutral style
    let badgeClass = 'bg-secondary';
    let barColor = chartColors.secondary;
    
    // Determine badge and color based on status and completion
    if (status && status.toLowerCase() === 'completed') {
      badgeClass = 'bg-primary';
      barColor = chartColors.primary;
    } else if (status && status.toLowerCase() === 'delayed') {
      badgeClass = 'bg-danger';
      barColor = chartColors.danger;
    } else if (status && status.toLowerCase().includes('risk')) {
      badgeClass = 'bg-warning text-dark';
      barColor = chartColors.warning;
    } else if (status && status.toLowerCase().includes('progress')) {
      // Check if on track based on completion
      if (completion > 60) {
        badgeClass = 'bg-success';
        barColor = chartColors.success;
      } else {
        badgeClass = 'bg-info';
        barColor = chartColors.info;
      }
    } else if (status && status.toLowerCase() === 'not started') {
      badgeClass = 'bg-light text-dark';
      barColor = chartColors.light;
    }
    
    return { badgeClass, barColor };
  };

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Overview</h1>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle rounded-pill" type="button" id="overviewActions" data-bs-toggle="dropdown">
              <i className="bi bi-gear me-1"></i> Options
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Filter Data</a></li>
              <li><a className="dropdown-item" href="#">Customize View</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Projects</h6>
                <h2 className="kpi-value">{dashboardStats.activeProjects}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${hexToRgb(chartColors.primary)}, 0.1)` }}>
                <i className="bi bi-folder fs-3" style={{ color: chartColors.primary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Active projects in progress</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${dashboardStats.activeProjectPercentage}%`, backgroundColor: chartColors.primary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Tasks</h6>
                <h2 className="kpi-value">{dashboardStats.totalTasks}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${hexToRgb(chartColors.info)}, 0.1)` }}>
                <i className="bi bi-check2-square fs-3" style={{ color: chartColors.info }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Across all active projects</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${dashboardStats.completedTaskPercentage}%`, backgroundColor: chartColors.info }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Budget</h6>
                <h2 className="kpi-value">${dashboardStats.totalBudget.toLocaleString()}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${hexToRgb(chartColors.success)}, 0.1)` }}>
                <i className="bi bi-cash fs-3" style={{ color: chartColors.success }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Total allocated budget</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${dashboardStats.budgetUtilizationPercentage}%`, backgroundColor: dashboardStats.budgetUtilizationPercentage > 90 ? chartColors.danger : chartColors.success }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Risk Status</h6>
                <h2 className="kpi-value">{dashboardStats.totalRisks}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${hexToRgb(chartColors.danger)}, 0.1)` }}>
                <i className="bi bi-exclamation-triangle fs-3" style={{ color: chartColors.danger }}></i>
              </div>
            </div>
            <p className="text-danger mt-2 mb-0 small"><i className="bi bi-arrow-up"></i> {dashboardStats.criticalRiskPercentage}% critical risks</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: `${dashboardStats.criticalRiskPercentage}%`, backgroundColor: chartColors.danger }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>Project Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Doughnut 
                  data={{
                    labels: Object.keys(projectTypeDistribution),
                    datasets: [
                      {
                        data: Object.values(projectTypeDistribution),
                        backgroundColor: [
                          chartColors.primary,
                          chartColors.secondary,
                          chartColors.tertiary,
                          chartColors.quaternary,
                          chartColors.accent1
                        ],
                        borderWidth: 1,
                        cutout: '65%',
                        borderColor: '#ffffff'
                      }
                    ]
                  }}
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
              </div>
              <div className="mt-3 small text-center">
                <span className="legend-value">
                  Total Projects: <span className="fw-bold">{dashboardStats.totalProjects}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-clipboard-data me-2"></i>Status Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <PolarArea 
                  data={{
                    labels: Object.keys(statusDistribution),
                    datasets: [
                      {
                        data: Object.values(statusDistribution),
                        backgroundColor: [
                          chartColors.success,
                          chartColors.primary,
                          chartColors.warning,
                          chartColors.danger,
                          chartColors.secondary
                        ],
                        borderWidth: 1,
                        borderColor: '#ffffff'
                      }
                    ]
                  }}
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
              </div>
              <div className="mt-3 text-center small">
                <div className="d-flex justify-content-center flex-wrap">
                  <span className="badge bg-success mx-1">Completed</span>
                  <span className="badge bg-primary mx-1">In Progress</span>
                  <span className="badge bg-warning text-dark mx-1">At Risk</span>
                  <span className="badge bg-danger mx-1">Delayed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bar-chart me-2"></i>Project Priority
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Bar
                  data={priorityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
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
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-3 text-center">
                <div className="d-flex justify-content-center flex-wrap small">
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: chartColors.quaternary, borderRadius: '2px' }}></span>
                    Low: 3
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: chartColors.tertiary, borderRadius: '2px' }}></span>
                    Medium: 8
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: chartColors.secondary, borderRadius: '2px' }}></span>
                    High: 6
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: chartColors.primary, borderRadius: '2px' }}></span>
                    Critical: 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Row */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up me-2"></i>Monthly Progress
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Line 
                  data={monthlyProgressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        },
                        title: {
                          display: true,
                          text: 'Completion %',
                          font: {
                            size: 12
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

        <div className="col-md-6 mb-3">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-speedometer2 me-2"></i>Performance KPIs
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="kpi-detail">
                    <h6 className="text-muted">Schedule Performance (SPI)</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{kpis.schedulePerformanceIndex.toFixed(2)}</h3>
                      <span className={`badge ${kpis.schedulePerformanceIndex < 0.9 ? 'bg-danger' : kpis.schedulePerformanceIndex > 1.1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {kpis.schedulePerformanceIndex < 1 ? 'Behind' : 'Ahead'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ 
                        width: `${Math.min(100, kpis.schedulePerformanceIndex * 50)}%`,
                        backgroundColor: kpis.schedulePerformanceIndex < 0.9 ? chartColors.danger : kpis.schedulePerformanceIndex > 1.1 ? chartColors.success : chartColors.warning 
                      }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="kpi-detail">
                    <h6 className="text-muted">Cost Performance (CPI)</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{kpis.costPerformanceIndex.toFixed(2)}</h3>
                      <span className={`badge ${kpis.costPerformanceIndex < 0.9 ? 'bg-danger' : kpis.costPerformanceIndex > 1.1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {kpis.costPerformanceIndex < 1 ? 'Over Budget' : 'Under Budget'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ 
                        width: `${Math.min(100, kpis.costPerformanceIndex * 50)}%`,
                        backgroundColor: kpis.costPerformanceIndex < 0.9 ? chartColors.danger : kpis.costPerformanceIndex > 1.1 ? chartColors.success : chartColors.warning 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="kpi-detail">
                    <h6 className="text-muted">Resource Utilization</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{kpis.resourceUtilization}%</h3>
                      <span className={`badge ${kpis.resourceUtilization > 95 ? 'bg-danger' : kpis.resourceUtilization < 70 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {kpis.resourceUtilization > 95 ? 'Overallocated' : kpis.resourceUtilization < 70 ? 'Underutilized' : 'Optimal'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ 
                        width: `${Math.min(100, kpis.resourceUtilization)}%`,
                        backgroundColor: kpis.resourceUtilization > 95 ? chartColors.danger : kpis.resourceUtilization < 70 ? chartColors.warning : chartColors.success
                      }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="kpi-detail">
                    <h6 className="text-muted">Budget Variance</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{kpis.budgetVariance}%</h3>
                      <span className={`badge ${kpis.budgetVariance < -10 ? 'bg-danger' : kpis.budgetVariance < -5 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {kpis.budgetVariance < 0 ? 'Over Budget' : 'Under Budget'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ 
                        width: `${Math.min(100, (Math.abs(kpis.budgetVariance) / 20) * 100)}%`,
                        backgroundColor: kpis.budgetVariance < -10 ? chartColors.danger : kpis.budgetVariance < -5 ? chartColors.warning : chartColors.success
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="kpi-detail">
                    <h6 className="text-muted">Quality Index</h6>
                    <div className="d-flex align-items-center">
                      <h3 className="mb-0 me-2">{kpis.qualityIndex}%</h3>
                      <span className={`badge ${kpis.qualityIndex < 80 ? 'bg-danger' : kpis.qualityIndex < 90 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {kpis.qualityIndex < 80 ? 'Poor' : kpis.qualityIndex < 90 ? 'Average' : 'Good'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ 
                        width: `${Math.min(100, kpis.qualityIndex)}%`,
                        backgroundColor: kpis.qualityIndex < 80 ? chartColors.danger : kpis.qualityIndex < 90 ? chartColors.warning : chartColors.success
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Timeline - Updated to use dynamic data */}
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-calendar3 me-2"></i>Project Timeline Summary
          </h5>
          <div>
            <span className="badge bg-success me-1">On Track</span>
            <span className="badge bg-warning text-dark me-1">At Risk</span>
            <span className="badge bg-danger me-1">Delayed</span>
            <span className="badge bg-primary">Completed</span>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects && recentProjects.length > 0 ? (
                  recentProjects.map(project => {
                    const { badgeClass, barColor } = getStatusStyle(project.status, project.completion);
                    return (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{formatDate(project.start_date)}</td>
                        <td>{formatDate(project.end_date)}</td>
                        <td>{getDuration(project.start_date, project.end_date)}</td>
                        <td>
                          <div className="progress progress-thin">
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${project.completion || 0}%`, 
                                backgroundColor: barColor 
                              }}
                            ></div>
                          </div>
                          <small>{project.completion || 0}%</small>
                        </td>
                        <td><span className={`badge ${badgeClass}`}>{project.status}</span></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No projects found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;