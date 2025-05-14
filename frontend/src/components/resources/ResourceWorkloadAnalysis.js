import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function ResourceWorkloadAnalysis({ purpleColors }) {
  // Purple-themed color palette for styling to match Dashboard
  const colors = purpleColors || {
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

  const [resources, setResources] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'
  const [showOverallocatedOnly, setShowOverallocatedOnly] = useState(false);
  const [reallocationSuggestions, setReallocationSuggestions] = useState([]);

  // Fetch resources and allocations (would be API calls in a real app)
  useEffect(() => {
    // Mock data for resources
    const resourceData = [
      { id: 1, name: 'Mohammad', type: 'Human', department: 'Development', role: 'Senior Developer', avatar: 'https://via.placeholder.com/40', utilizationTarget: 80 },
      { id: 2, name: 'Ahmed', type: 'Human', department: 'Design', role: 'UI/UX Designer', avatar: 'https://via.placeholder.com/40', utilizationTarget: 75 },
      { id: 3, name: 'Ali', type: 'Human', department: 'Development', role: 'Backend Developer', avatar: 'https://via.placeholder.com/40', utilizationTarget: 85 },
      { id: 4, name: 'Abdulla', type: 'Human', department: 'QA', role: 'Test Engineer', avatar: 'https://via.placeholder.com/40', utilizationTarget: 70 },
      { id: 5, name: 'Omar', type: 'Human', department: 'Development', role: 'Frontend Developer', avatar: 'https://via.placeholder.com/40', utilizationTarget: 80 }
    ];
    
    // Mock allocation data
    const allocationData = [
      // For John Doe (id: 1)
      { resourceId: 1, projectId: 101, projectName: 'Project Alpha', percentage: 50, startDate: '2023-05-01', endDate: '2023-06-15' },
      { resourceId: 1, projectId: 102, projectName: 'Project Beta', percentage: 50, startDate: '2023-05-15', endDate: '2023-07-30' },
      
      // For Jane Smith (id: 2)
      { resourceId: 2, projectId: 101, projectName: 'Project Alpha', percentage: 100, startDate: '2023-05-01', endDate: '2023-05-31' },
      { resourceId: 2, projectId: 103, projectName: 'Project Gamma', percentage: 75, startDate: '2023-06-01', endDate: '2023-07-15' },
      
      // For Robert Johnson (id: 3)
      { resourceId: 3, projectId: 102, projectName: 'Project Beta', percentage: 70, startDate: '2023-05-01', endDate: '2023-08-31' },
      { resourceId: 3, projectId: 103, projectName: 'Project Gamma', percentage: 30, startDate: '2023-05-15', endDate: '2023-07-31' },
      
      // For Emily Davis (id: 4)
      { resourceId: 4, projectId: 101, projectName: 'Project Alpha', percentage: 60, startDate: '2023-06-01', endDate: '2023-06-30' },
      
      // For Michael Wilson (id: 5)
      { resourceId: 5, projectId: 102, projectName: 'Project Beta', percentage: 100, startDate: '2023-05-01', endDate: '2023-05-31' },
      { resourceId: 5, projectId: 103, projectName: 'Project Gamma', percentage: 50, startDate: '2023-06-01', endDate: '2023-08-15' }
    ];
    
    setResources(resourceData);
    setAllocations(allocationData);
  }, []);

  // Calculate utilization for the selected time period
  useEffect(() => {
    if (resources.length === 0 || allocations.length === 0) return;
    
    // Calculate start and end dates for the selected time period
    let periodStart, periodEnd;
    
    if (timeRange === 'month') {
      periodStart = new Date(selectedYear, selectedMonth, 1);
      periodEnd = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month
    } else if (timeRange === 'quarter') {
      const quarterStartMonth = Math.floor(selectedMonth / 3) * 3;
      periodStart = new Date(selectedYear, quarterStartMonth, 1);
      periodEnd = new Date(selectedYear, quarterStartMonth + 3, 0);
    } else if (timeRange === 'year') {
      periodStart = new Date(selectedYear, 0, 1);
      periodEnd = new Date(selectedYear, 11, 31);
    }
    
    // Calculate utilization for each resource
    const utilizationData = resources.map(resource => {
      // Filter allocations for this resource and time period
      const resourceAllocations = allocations.filter(allocation => {
        const allocationStart = new Date(allocation.startDate);
        const allocationEnd = new Date(allocation.endDate);
        
        return allocation.resourceId === resource.id &&
          allocationStart <= periodEnd &&
          allocationEnd >= periodStart;
      });
      
      // Calculate days in selected period
      const totalDaysInPeriod = (periodEnd - periodStart) / (1000 * 60 * 60 * 24) + 1;
      
      // Calculate total allocation
      let totalAllocation = 0;
      resourceAllocations.forEach(allocation => {
        const allocationStart = new Date(Math.max(periodStart, new Date(allocation.startDate)));
        const allocationEnd = new Date(Math.min(periodEnd, new Date(allocation.endDate)));
        
        const daysAllocated = (allocationEnd - allocationStart) / (1000 * 60 * 60 * 24) + 1;
        
        totalAllocation += (daysAllocated / totalDaysInPeriod) * allocation.percentage;
      });
      
      // Check if overallocated
      const isOverallocated = totalAllocation > 100;
      
      // Create project allocations array
      const projectAllocations = resourceAllocations.map(allocation => {
        const allocationStart = new Date(Math.max(periodStart, new Date(allocation.startDate)));
        const allocationEnd = new Date(Math.min(periodEnd, new Date(allocation.endDate)));
        
        const daysAllocated = (allocationEnd - allocationStart) / (1000 * 60 * 60 * 24) + 1;
        const effectiveAllocation = (daysAllocated / totalDaysInPeriod) * allocation.percentage;
        
        return {
          projectId: allocation.projectId,
          projectName: allocation.projectName,
          allocation: parseFloat(effectiveAllocation.toFixed(1))
        };
      });
      
      return {
        resourceId: resource.id,
        resourceName: resource.name,
        role: resource.role,
        avatar: resource.avatar,
        utilizationTarget: resource.utilizationTarget,
        totalAllocation: parseFloat(totalAllocation.toFixed(1)),
        isOverallocated: isOverallocated,
        utilizedPercentage: Math.min(totalAllocation, resource.utilizationTarget),
        underutilizedPercentage: Math.max(0, resource.utilizationTarget - totalAllocation),
        overutilizedPercentage: Math.max(0, totalAllocation - resource.utilizationTarget),
        projects: projectAllocations
      };
    });
    
    setUtilization(utilizationData);
    
    // Generate reallocation suggestions for overallocated resources
    const suggestions = [];
    const overallocatedResources = utilizationData.filter(u => u.isOverallocated);
    const underutilizedResources = utilizationData.filter(u => u.totalAllocation < u.utilizationTarget);
    
    overallocatedResources.forEach(overRes => {
      const overAmount = overRes.totalAllocation - 100;
      
      if (underutilizedResources.length > 0) {
        // Find resources with similar skills (in a real app, this would check skills)
        const potentialResources = underutilizedResources.filter(underRes => 
          // Simplified skill matching - in a real app this would be more sophisticated
          underRes.role.includes(overRes.role.split(' ')[0]) ||
          overRes.role.includes(underRes.role.split(' ')[0])
        );
        
        if (potentialResources.length > 0) {
          // Sort by available capacity (most available first)
          potentialResources.sort((a, b) => 
            (b.utilizationTarget - b.totalAllocation) - 
            (a.utilizationTarget - a.totalAllocation)
          );
          
          const targetResource = potentialResources[0];
          const availableCapacity = targetResource.utilizationTarget - targetResource.totalAllocation;
          const suggestedTransfer = Math.min(overAmount, availableCapacity);
          
          suggestions.push({
            fromResourceId: overRes.resourceId,
            fromResourceName: overRes.resourceName,
            toResourceId: targetResource.resourceId,
            toResourceName: targetResource.resourceName,
            amount: parseFloat(suggestedTransfer.toFixed(1)),
            reason: `${overRes.resourceName} is overallocated by ${overAmount.toFixed(1)}% and ${targetResource.resourceName} has ${availableCapacity.toFixed(1)}% available capacity`,
            suggestedProjects: overRes.projects
              .sort((a, b) => b.allocation - a.allocation)
              .slice(0, 2)
              .map(p => p.projectName)
          });
        }
      }
    });
    
    setReallocationSuggestions(suggestions);
  }, [resources, allocations, timeRange, selectedMonth, selectedYear]);

  // Prepare chart data for utilization with purple theme
  const utilizationChartData = {
    labels: utilization.map(u => u.resourceName),
    datasets: [
      {
        label: 'Utilized (Within Target)',
        data: utilization.map(u => u.utilizedPercentage),
        backgroundColor: colors.completed,
        stack: 'Stack 0',
      },
      {
        label: 'Under-utilized',
        data: utilization.map(u => u.underutilizedPercentage),
        backgroundColor: colors.quaternary,
        stack: 'Stack 0',
      },
      {
        label: 'Over-utilized',
        data: utilization.map(u => u.overutilizedPercentage),
        backgroundColor: colors.accent2,
        stack: 'Stack 0',
      }
    ]
  };

  // Chart options with improved styling
  const chartOptions = {
    scales: {
      x: {
        stacked: true,
        grid: {
          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
        }
      },
      y: {
        stacked: true,
        max: 150,
        grid: {
          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
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
      },
      tooltip: {
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      }
    }
  };

  // Get month options for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get filtered resources
  const filteredResources = showOverallocatedOnly
    ? utilization.filter(u => u.isOverallocated)
    : utilization;

  // Helper function to determine utilization color
  const getUtilizationColor = (allocation, target) => {
    if (allocation > 100) return colors.accent2; // Overallocated
    if (allocation > target) return colors.tertiary; // Above target but below 100%
    if (allocation > target - 20) return colors.completed; // Within 20% of target
    return colors.quaternary; // Underutilized
  };

  return (
    <div className="resource-workload-analysis">
      <div className="dashboard-card mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-diagram-3 me-2"></i>Resource Workload Analysis
            </h5>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'} rounded-start`}
                onClick={() => setViewMode('chart')}
                style={viewMode === 'chart' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                <i className="bi bi-bar-chart-fill me-1"></i> Chart
              </button>
              <button 
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'} rounded-end`}
                onClick={() => setViewMode('table')}
                style={viewMode === 'table' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                <i className="bi bi-table me-1"></i> Table
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 mb-2">
              <label className="form-label">Time Period</label>
              <div className="input-group">
                <span className="input-group-text" style={{ color: colors.primary }}>
                  <i className="bi bi-clock-history"></i>
                </span>
                <select 
                  className="form-select"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </div>
            
            {timeRange === 'month' && (
              <div className="col-md-3 mb-2">
                <label className="form-label">Month</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: colors.primary }}>
                    <i className="bi bi-calendar-month"></i>
                  </span>
                  <select 
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="col-md-3 mb-2">
              <label className="form-label">Year</label>
              <div className="input-group">
                <span className="input-group-text" style={{ color: colors.primary }}>
                  <i className="bi bi-calendar-event"></i>
                </span>
                <select 
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2 d-flex align-items-end">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="showOverallocatedOnly" 
                  checked={showOverallocatedOnly}
                  onChange={(e) => setShowOverallocatedOnly(e.target.checked)}
                  style={{ borderColor: colors.primary }}
                />
                <label className="form-check-label" htmlFor="showOverallocatedOnly">
                  Show overallocated resources only
                </label>
              </div>
            </div>
          </div>
          
          {viewMode === 'chart' && (
            <div className="resource-chart mb-4" style={{ height: '400px' }}>
              <Bar data={utilizationChartData} options={chartOptions} />
            </div>
          )}
          
          {viewMode === 'table' && (
            <div className="table-responsive mb-4">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Role</th>
                    <th>Projects</th>
                    <th className="text-center">Target</th>
                    <th className="text-center">Allocated</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(resource => (
                    <tr key={resource.resourceId} className={resource.isOverallocated ? 'table-danger' : ''}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                            color: colors.primary,
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {resource.resourceName.split(' ').map(n => n[0]).join('')}
                          </div>
                          {resource.resourceName}
                        </div>
                      </td>
                      <td>{resource.role}</td>
                      <td>
                        {resource.projects.map(project => (
                          <div key={project.projectId} className="d-flex justify-content-between mb-1">
                            <span>{project.projectName}</span>
                            <span className="badge" style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                              color: colors.primary,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              {project.allocation}%
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="text-center">{resource.utilizationTarget}%</td>
                      <td className="text-center">
                        <span style={{ 
                          color: resource.isOverallocated ? colors.accent2 : 
                                resource.totalAllocation > resource.utilizationTarget ? colors.tertiary : colors.primary,
                          fontWeight: resource.isOverallocated ? '500' : 'normal'
                        }}>
                          {resource.totalAllocation}%
                        </span>
                      </td>
                      <td>
                        <div className="progress progress-thin" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                              width: `${Math.min(resource.totalAllocation, resource.utilizationTarget)}%`,
                              backgroundColor: getUtilizationColor(
                                Math.min(resource.totalAllocation, resource.utilizationTarget),
                                resource.utilizationTarget
                              )
                            }}
                            aria-valuenow={Math.min(resource.totalAllocation, resource.utilizationTarget)}
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                          {resource.isOverallocated && (
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ 
                                width: `${resource.totalAllocation - resource.utilizationTarget}%`,
                                backgroundColor: colors.accent2
                              }}
                              aria-valuenow={resource.totalAllocation - resource.utilizationTarget}
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          )}
                        </div>
                        <div className="d-flex justify-content-between mt-1 small">
                          <span style={{ fontSize: '0.75rem' }}>
                            {Math.min(resource.totalAllocation, resource.utilizationTarget)}%
                          </span>
                          {resource.isOverallocated && (
                            <span style={{ color: colors.accent2, fontSize: '0.75rem' }}>
                              +{(resource.totalAllocation - resource.utilizationTarget).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {reallocationSuggestions.length > 0 && (
            <div className="workload-balancing-suggestions">
              <h6 className="fw-bold mb-3" style={{ color: colors.primary }}>
                <i className="bi bi-arrow-left-right me-2"></i>Resource Reallocation Suggestions
              </h6>
              
              <div className="list-group">
                {reallocationSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="list-group-item list-group-item-action"
                    style={{ 
                      borderLeft: `3px solid ${colors.primary}`,
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="suggestion-details">
                        <h6 className="mb-1">
                          Transfer <span style={{ color: colors.accent2 }}>{suggestion.amount}%</span> allocation 
                          from <strong>{suggestion.fromResourceName}</strong> to <strong>{suggestion.toResourceName}</strong>
                        </h6>
                        <p className="mb-1 text-muted small">{suggestion.reason}</p>
                        <p className="mb-0 small">
                          <span className="fw-bold">Suggested projects to transfer:</span> {suggestion.suggestedProjects.join(', ')}
                        </p>
                      </div>
                      <div>
                        <button 
                          className="btn btn-sm btn-primary rounded-pill" 
                          style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                        >
                          <i className="bi bi-arrow-left-right me-1"></i> Balance
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-card">
        <div className="card-header bg-white">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-graph-up me-2"></i>Workload Insights
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Overallocated Resources</h6>
                    <h2 className="kpi-value">{utilization.filter(u => u.isOverallocated).length}</h2>
                  </div>
                  <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)` }}>
                    <i className="bi bi-exclamation-triangle fs-3" style={{ color: colors.accent2 }}></i>
                  </div>
                </div>
                <p className="text-muted mt-2 mb-0 small">Resources allocated over 100%</p>
                <div className="progress progress-thin mt-3">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(utilization.filter(u => u.isOverallocated).length / utilization.length) * 100}%`,
                      backgroundColor: colors.accent2
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Underutilized Resources</h6>
                    <h2 className="kpi-value">
                      {utilization.filter(u => u.totalAllocation < u.utilizationTarget - 20).length}
                    </h2>
                  </div>
                  <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)` }}>
                    <i className="bi bi-battery-half fs-3" style={{ color: colors.quaternary }}></i>
                  </div>
                </div>
                <p className="text-muted mt-2 mb-0 small">Resources more than 20% below target</p>
                <div className="progress progress-thin mt-3">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(utilization.filter(u => u.totalAllocation < u.utilizationTarget - 20).length / utilization.length) * 100}%`,
                      backgroundColor: colors.quaternary
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="kpi-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="kpi-title">Optimal Utilization</h6>
                    <h2 className="kpi-value">
                      {utilization.filter(u => 
                        u.totalAllocation >= u.utilizationTarget - 20 && 
                        u.totalAllocation <= 100
                      ).length}
                    </h2>
                  </div>
                  <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)` }}>
                    <i className="bi bi-check-circle fs-3" style={{ color: colors.completed }}></i>
                  </div>
                </div>
                <p className="text-muted mt-2 mb-0 small">Resources at optimal capacity</p>
                <div className="progress progress-thin mt-3">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(utilization.filter(u => u.totalAllocation >= u.utilizationTarget - 20 && u.totalAllocation <= 100).length / utilization.length) * 100}%`,
                      backgroundColor: colors.completed
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className="alert mt-3" 
            style={{
              backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)`,
              borderColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.2)`,
              color: '#333'
            }}
          >
            <div className="d-flex">
              <div className="me-3">
                <i className="bi bi-info-circle-fill fs-4" style={{ color: colors.tertiary }}></i>
              </div>
              <div>
                <h5 className="mb-1" style={{ color: colors.primary }}>Workload Balancing Tips</h5>
                <ul className="mb-0">
                  <li>Resources should ideally be allocated between 70% and 100% of their time</li>
                  <li>Overallocation leads to burnout and decreased productivity</li>
                  <li>Aim to keep at least 20% of time available for unforeseen tasks and admin work</li>
                  <li>Consider cross-training to distribute workload more evenly across the team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceWorkloadAnalysis;
