import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  DoughnutController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  DoughnutController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
);

function RisksTab({ 
  chartColors, 
  projects, 
  risks = [], // Set default empty array to prevent null errors
  filter,
  handleFilterChange
}) {
  // Purple-themed color palette for charts to match Dashboard
  const purpleChartColors = {
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

  // Use our purple color palette
  const colors = purpleChartColors;

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

  // Dummy data for when real data is not available
  const dummyRiskData = {
    activeRisksCount: 12,
    criticalRisksCount: 4,
    mitigatedRisksCount: 15,
    totalRisksCount: 35,
    severityDistribution: {
      Critical: 4,
      High: 8, 
      Medium: 15,
      Low: 6,
      'Very Low': 2
    },
    statusDistribution: {
      Open: 8,
      'In Progress': 4,
      Mitigated: 10,
      Closed: 5,
      Accepted: 8
    },
    categories: [
      {name: 'Technical', count: 12},
      {name: 'Schedule', count: 8},
      {name: 'Resource', count: 6},
      {name: 'Scope', count: 5},
      {name: 'Budget', count: 4}
    ]
  };

  // Risk severity distribution data with purple palette
  const riskSeverityData = {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Very Low'],
    datasets: [
      {
        data: risks.length > 0 ? [
          risks.filter(r => r.severity === 'Critical').length || 0,
          risks.filter(r => r.severity === 'High').length || 0,
          risks.filter(r => r.severity === 'Medium').length || 0,
          risks.filter(r => r.severity === 'Low').length || 0,
          risks.filter(r => r.severity === 'Very Low').length || 0,
        ] : [
          dummyRiskData.severityDistribution.Critical,
          dummyRiskData.severityDistribution.High,
          dummyRiskData.severityDistribution.Medium,
          dummyRiskData.severityDistribution.Low,
          dummyRiskData.severityDistribution['Very Low']
        ],
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.tertiary,
          colors.quaternary,
          colors.quinary,
        ],
        borderColor: ['white', 'white', 'white', 'white', 'white'],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  // Risk by category data
  const riskByCategoryData = {
    labels: risks.length > 0 ? 
      [...new Set(risks.map(r => r.category) || [])] : 
      dummyRiskData.categories.map(c => c.name),
    datasets: [
      {
        label: 'Number of Risks',
        data: risks.length > 0 ? 
          [...new Set(risks.map(r => r.category) || [])].map(
            category => risks.filter(r => r.category === category).length || 0
          ) : 
          dummyRiskData.categories.map(c => c.count),
        backgroundColor: colors.primary,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        barPercentage: 0.7
      }
    ]
  };

  // Risk trend over time with purple palette
  const riskTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Risks',
        data: [5, 7, 4, 6, 8, 9, 7, 5, 6, 4, 7, 5],
        fill: false,
        borderColor: colors.primary,
        tension: 0.3,
        pointBackgroundColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Closed Risks',
        data: [2, 4, 3, 5, 6, 7, 5, 4, 5, 3, 6, 4],
        fill: false,
        borderColor: colors.completed,
        tension: 0.3,
        pointBackgroundColor: colors.completed,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Risk exposure by project with purple palette
  const riskExposureData = {
    labels: projects.map(p => p.title),
    datasets: [
      {
        label: 'Risk Score',
        data: projects.map(() => Math.floor(Math.random() * 80) + 20),
        backgroundColor: projects.map(() => {
          const score = Math.floor(Math.random() * 80) + 20;
          return score > 75 ? colors.primary : // high risk
                score > 50 ? colors.secondary : // medium-high risk
                score > 30 ? colors.tertiary : // medium risk
                colors.quaternary; // low risk
        }),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        barPercentage: 0.7
      }
    ]
  };

  // Get risk status badge color using purple palette
  const getRiskStatusColor = (status) => {
    switch (status) {
      case 'Open': return colors.primary;
      case 'In Progress': return colors.secondary;
      case 'Mitigated': return colors.tertiary;
      case 'Closed': return colors.completed;
      case 'Accepted': return colors.accent1;
      default: return colors.quaternary;
    }
  };

  // Calculate metrics with fallback to dummy data
  const totalRisksCount = risks?.length || dummyRiskData.totalRisksCount;
  const activeRisksCount = risks?.filter(r => r.status === 'Open' || r.status === 'In Progress').length || dummyRiskData.activeRisksCount;
  const criticalRisksCount = risks?.filter(r => r.severity === 'Critical' && (r.status === 'Open' || r.status === 'In Progress')).length || dummyRiskData.criticalRisksCount;
  const mitigatedRisksCount = risks?.filter(r => r.status === 'Mitigated' || r.status === 'Closed').length || dummyRiskData.mitigatedRisksCount;

  // Calculate percentages based on actual or dummy data
  const mitigationRatePercent = risks?.length ? 
    Math.round((mitigatedRisksCount / totalRisksCount) * 100) : 
    Math.round((dummyRiskData.mitigatedRisksCount / dummyRiskData.totalRisksCount) * 100);

  const activeRisksPercent = risks?.length ?
    Math.round((activeRisksCount / totalRisksCount) * 100) :
    Math.round((dummyRiskData.activeRisksCount / dummyRiskData.totalRisksCount) * 100);

  return (
    <div className="risks-analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Risk Management Dashboard</h4>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <select 
            className="form-select form-select-sm rounded-pill me-2" 
            name="projectId" 
            onChange={handleFilterChange}
            value={filter.projectId}
            style={{ width: '200px' }}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <select 
            className="form-select form-select-sm rounded-pill" 
            name="dateRange" 
            onChange={handleFilterChange}
            value={filter.dateRange}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      
      {/* KPI Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Total Risks</h6>
                <h2 className="kpi-value">{totalRisksCount}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)` }}>
                <i className="bi bi-shield-exclamation fs-3" style={{ color: colors.primary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Across all projects</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: colors.primary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Active Risks</h6>
                <h2 className="kpi-value">{activeRisksCount}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.secondary)}, 0.1)` }}>
                <i className="bi bi-exclamation-triangle fs-3" style={{ color: colors.secondary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">
              {activeRisksPercent}% need attention
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${activeRisksPercent}%`, 
                backgroundColor: colors.secondary 
              }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Critical Risks</h6>
                <h2 className="kpi-value">{criticalRisksCount}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)` }}>
                <i className="bi bi-exclamation-circle fs-3" style={{ color: colors.accent2 }}></i>
              </div>
            </div>
            <p className="text-danger mt-2 mb-0 small">
              <i className="bi bi-arrow-up"></i> Requires immediate attention
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${(criticalRisksCount / totalRisksCount) * 100}%`, 
                backgroundColor: colors.accent2 
              }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Mitigation Rate</h6>
                <h2 className="kpi-value">{mitigationRatePercent}%</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)` }}>
                <i className="bi bi-check-circle fs-3" style={{ color: colors.completed }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">{mitigatedRisksCount} risks resolved</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${mitigationRatePercent}%`, 
                backgroundColor: colors.completed 
              }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts - First Row */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>Risk Severity Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Pie 
                  data={riskSeverityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-center flex-wrap small">
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.primary, borderRadius: '2px' }}></span>
                    Critical
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.secondary, borderRadius: '2px' }}></span>
                    High
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.tertiary, borderRadius: '2px' }}></span>
                    Medium
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.quaternary, borderRadius: '2px' }}></span>
                    Low
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bar-chart me-2"></i>Risks by Category
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={riskByCategoryData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.x} risks`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: {
                          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
                        },
                        title: {
                          display: true,
                          text: 'Number of Risks',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        }
                      },
                      y: {
                        grid: {
                          display: false
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
      
      {/* Charts - Second Row - Modified to remove Risk Status chart */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up me-2"></i>Risk Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Line 
                  data={riskTrendData}
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
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
                        },
                        title: {
                          display: true,
                          text: 'Number of Risks',
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
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Risk Exposure */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bar-chart me-2"></i>Project Risk Exposure
              </h5>
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                Higher Score = Higher Risk
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={riskExposureData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
                        },
                        title: {
                          display: true,
                          text: 'Risk Score',
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
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>Top Risks
              </h5>
              <button className="btn btn-sm btn-outline-primary rounded-pill">
                <i className="bi bi-download me-1"></i> Export
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Risk</th>
                      <th>Project</th>
                      <th>Category</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Owner</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks
                      ?.filter(risk => filter.projectId === 'all' || parseInt(filter.projectId) === risk.projectId)
                      .sort((a, b) => {
                        // Sort by severity (Critical first)
                        const severityOrder = { 'Critical': 5, 'High': 4, 'Medium': 3, 'Low': 2, 'Very Low': 1 };
                        return severityOrder[b.severity] - severityOrder[a.severity];
                      })
                      .slice(0, 10)
                      .map(risk => (
                        <tr key={risk.id}>
                          <td>R-{risk.id.toString().padStart(3, '0')}</td>
                          <td>{risk.title}</td>
                          <td>
                            {projects.find(p => p.id === risk.projectId)?.title}
                          </td>
                          <td>{risk.category}</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: 
                                risk.severity === 'Critical' ? colors.primary :
                                risk.severity === 'High' ? colors.secondary :
                                risk.severity === 'Medium' ? colors.tertiary :
                                risk.severity === 'Low' ? colors.quaternary : colors.quinary
                            }}>
                              {risk.severity}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: getRiskStatusColor(risk.status) }}>
                              {risk.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2" style={{ backgroundColor: colors.primary, width: '24px', height: '24px', fontSize: '12px' }}>
                                {risk.owner?.charAt(0)}
                              </div>
                              {risk.owner}
                            </div>
                          </td>
                          <td>{risk.dueDate}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RisksTab;