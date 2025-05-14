import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';

function ResourcesTab({ 
  chartColors, 
  resources, 
  resourceUtilizationData, 
  resourceAllocationByDepartmentData,
  resourceCapacityData,
  resourceSkillCoverageData,
  resourceTrendData,
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

  return (
    <div className="resources-analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Resource Allocation & Management</h4>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <select 
            className="form-select form-select-sm rounded-pill" 
            name="department" 
            onChange={handleFilterChange}
            value={filter.department}
            style={{ width: '200px' }}
          >
            <option value="all">All Departments</option>
            {[...new Set(resources.map(r => r.department))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Total Resources</h6>
                <h2 className="kpi-value">{resources.length}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)` }}>
                <i className="bi bi-people fs-3" style={{ color: colors.primary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Across all departments</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: colors.primary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Avg. Utilization</h6>
                <h2 className="kpi-value">
                  {Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length)}%
                </h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)` }}>
                <i className="bi bi-speedometer fs-3" style={{ color: colors.tertiary }}></i>
              </div>
            </div>
            <div className="progress progress-thin mt-3">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min(100, Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length))}%`,
                  backgroundColor: colors.tertiary
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Overallocated</h6>
                <h2 className="kpi-value">{resources.filter(r => r.utilization > 100).length}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)` }}>
                <i className="bi bi-exclamation-triangle fs-3" style={{ color: colors.accent2 }}></i>
              </div>
            </div>
            <p className="text-danger mt-2 mb-0 small"><i className="bi bi-arrow-up"></i> Needs attention</p>
            <div className="progress progress-thin mt-3">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${(resources.filter(r => r.utilization > 100).length / resources.length) * 100}%`,
                  backgroundColor: colors.accent2
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Availability</h6>
                <h2 className="kpi-value">{Math.round(resources.reduce((sum, r) => sum + r.availability, 0) / resources.length)}%</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)` }}>
                <i className="bi bi-calendar-check fs-3" style={{ color: colors.completed }}></i>
              </div>
            </div>
            <div className="progress progress-thin mt-3">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.round(resources.reduce((sum, r) => sum + r.availability, 0) / resources.length)}%`,
                  backgroundColor: colors.completed
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-people me-2"></i>Resource Utilization
              </h5>
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                {resources.length} Resources
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...resourceUtilizationData,
                    datasets: resourceUtilizationData.datasets.map(dataset => ({
                      ...dataset,
                      backgroundColor: resources.map(r => 
                        r.utilization > 100 ? colors.accent2 :
                        r.utilization > 85 ? colors.tertiary :
                        colors.completed
                      )
                    }))
                  }}
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
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 120,
                        title: {
                          display: true,
                          text: 'Utilization (%)',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          },
                          font: {
                            size: 10
                          }
                        }
                      },
                      x: {
                        ticks: {
                          font: {
                            size: 10
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <h6>Resource Allocation Threshold</h6>
                  <div>
                    <span className="badge me-1" style={{ backgroundColor: colors.completed }}>Optimal: 75-85%</span>
                    <span className="badge me-1" style={{ backgroundColor: colors.tertiary }}>Warning: 85-100%</span>
                    <span className="badge" style={{ backgroundColor: colors.accent2 }}>Overallocated: &gt;100%</span>
                  </div>
                </div>
                <div className="progress" style={{ height: '5px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '75%', backgroundColor: colors.completed }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                  <div className="progress-bar" role="progressbar" style={{ width: '10%', backgroundColor: colors.tertiary }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                  <div className="progress-bar" role="progressbar" style={{ width: '15%', backgroundColor: colors.accent2 }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-building me-2"></i>Resource Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Pie 
                  data={{
                    labels: resources && resources.length > 0 
                      ? [...new Set(resources.map(r => r.department))].map(
                          dept => `${dept} (${resources.filter(r => r.department === dept).length})`)
                      : [],
                    datasets: [
                      {
                        data: resources && resources.length > 0
                          ? [...new Set(resources.map(r => r.department))].map(
                              dept => resources.filter(r => r.department === dept).length)
                          : [],
                        backgroundColor: [
                          colors.primary,
                          colors.secondary,
                          colors.tertiary,
                          colors.quaternary,
                          colors.accent1,
                          colors.accent2
                        ],
                        hoverOffset: 10
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-list-check me-2"></i>Department Allocation
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...resourceAllocationByDepartmentData,
                    datasets: resourceAllocationByDepartmentData.datasets.map((dataset, index) => ({
                      ...dataset,
                      backgroundColor: index === 0 ? colors.primary : colors.completed
                    }))
                  }}
                  options={{
                    indexAxis: 'y',
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
                      x: {
                        stacked: true,
                        title: {
                          display: true,
                          text: 'Hours',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        }
                      },
                      y: {
                        stacked: true,
                        ticks: {
                          font: {
                            size: 10
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
        
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bar-chart-steps me-2"></i>Capacity vs. Allocation
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...resourceCapacityData,
                    datasets: resourceCapacityData.datasets.map((dataset, index) => ({
                      ...dataset,
                      backgroundColor: index === 0 ? colors.primary : colors.completed
                    }))
                  }}
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
                        title: {
                          display: true,
                          text: 'Hours',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          font: {
                            size: 10
                          }
                        }
                      },
                      x: {
                        ticks: {
                          font: {
                            size: 10
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
      
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-diagram-2 me-2"></i>Skill Coverage
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...resourceSkillCoverageData,
                    datasets: resourceSkillCoverageData.datasets.map(dataset => ({
                      ...dataset,
                      backgroundColor: colors.primary
                    }))
                  }}
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
                            return `${context.parsed.x} resources with ${context.label} skills`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Resources',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          font: {
                            size: 10
                          }
                        }
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 10
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
        
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up-arrow me-2"></i>Utilization Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Line 
                  data={{
                    ...resourceTrendData,
                    datasets: resourceTrendData.datasets.map((dataset, index) => ({
                      ...dataset,
                      borderColor: [colors.primary, colors.completed, colors.tertiary][index % 3],
                      backgroundColor: 'transparent'
                    }))
                  }}
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
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 120,
                        title: {
                          display: true,
                          text: 'Utilization (%)',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          },
                          font: {
                            size: 10
                          }
                        }
                      },
                      x: {
                        ticks: {
                          font: {
                            size: 10
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
      
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-list-ul me-2"></i>Resource Allocation Details
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Project Allocations</th>
                      <th>Billable Hours</th>
                      <th>Total Allocated</th>
                      <th>Capacity</th>
                      <th>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resources || [])
                      .filter(r => filter.department === 'all' || r.department === filter.department)
                      .map(resource => (
                        <tr key={resource.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2" style={{ backgroundColor: colors.primary }}>
                                {resource.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              {resource.name}
                            </div>
                          </td>
                          <td>{resource.department}</td>
                          <td>{resource.role}</td>
                          <td>
                            {resource.projects.map((project, index) => (
                              <span key={index} className="badge me-1 mb-1" 
                                style={{ 
                                  backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`, 
                                  color: colors.primary,
                                  borderRadius: '12px',
                                  padding: '4px 10px'
                                }}>
                                {project.name} ({project.allocation}%)
                              </span>
                            ))}
                          </td>
                          <td>{resource.billableHours}</td>
                          <td>{resource.allocatedHours}</td>
                          <td>{resource.capacity}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${Math.min(100, resource.utilization)}%`,
                                    backgroundColor: resource.utilization > 100 ? colors.accent2 : 
                                                  resource.utilization > 85 ? colors.tertiary : colors.completed
                                  }}
                                ></div>
                              </div>
                              <span style={{ 
                                color: resource.utilization > 100 ? colors.accent2 : 
                                      resource.utilization > 85 ? colors.tertiary : colors.completed 
                              }}>
                                {resource.utilization}%
                              </span>
                            </div>
                          </td>
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

export default ResourcesTab;