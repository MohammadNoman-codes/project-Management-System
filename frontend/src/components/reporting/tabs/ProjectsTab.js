import React, { useState } from 'react';
import { Bar, PolarArea, Radar, Line, Doughnut } from 'react-chartjs-2';

function ProjectsTab({ 
  projects, 
  chartColors, 
  hexToRgb, 
  projectTaskCompletionData, 
  projectTimelineData, 
  milestonesData,
  projectPhasesDetailedData,
  projectRiskExposureData,
  projectHealthData,
  upcomingTasks = [], // Add default empty array
  completedTasks = [], // Add default empty array
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

  // Use either passed chartColors or our purpleChartColors
  const colors = purpleChartColors;
  
  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      if (typeof hexToRgb === 'function') {
        return hexToRgb(hex);
      } else {
        // Fallback implementation if hexToRgb is not provided
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };

  // Data for completed tasks trend chart with enhanced styling
  const completedTasksData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [12, 19, 15, 22, 18, 25],
        fill: true,
        borderColor: colors.primary,
        backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };
  
  // Data for upcoming tasks chart with consistent colors
  const upcomingTasksData = {
    labels: ['This Week', 'Next Week', 'In 2 Weeks', 'In 3+ Weeks'],
    datasets: [
      {
        label: 'Upcoming Tasks',
        data: [8, 12, 6, 9],
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.tertiary,
          colors.quaternary
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
        hoverOffset: 10
      }
    ]
  };

  // New state variables for task list filters
  const [upcomingTasksProjectFilter, setUpcomingTasksProjectFilter] = useState('all');
  const [completedTasksProjectFilter, setCompletedTasksProjectFilter] = useState('all');
  
  // Sample upcoming tasks data
  const upcomingTasksDummyData = [
    {
      id: 1,
      name: "Financial Approval for Tender Award",
      project: "Municipal Infrastructure Development",
      projectId: 1,
      dueDate: "2024-01-12",
      priority: "Critical",
      assignee: "Mohammad",
      status: "In Progress"
    },
    {
      id: 2,
      name: "Tender Award",
      project: "Municipal Infrastructure Development",
      projectId: 1,
      dueDate: "2024-01-15",
      priority: "Critical",
      assignee: "Mohammad",
      status: "To Do"
    },
    {
      id: 3,
      name: "Contract Commencement",
      project: "Municipal Infrastructure Development",
      projectId: 1,
      dueDate: "2024-01-30",
      priority: "High",
      assignee: "Ahmed",
      status: "To Do"
    },
    {
      id: 4,
      name: "Site Survey",
      project: "Public Park Development",
      projectId: 2,
      dueDate: "2024-01-18",
      priority: "Medium",
      assignee: "Ali",
      status: "In Progress"
    },
    {
      id: 5,
      name: "Environmental Assessment",
      project: "Road Safety Improvements",
      projectId: 3,
      dueDate: "2024-01-22",
      priority: "High",
      assignee: "Fatima",
      status: "To Do"
    }
  ];
  
  // Sample recently completed tasks data
  const completedTasksDummyData = [
    {
      id: 101,
      name: "Preliminary Design Review",
      project: "Municipal Infrastructure Development",
      projectId: 1,
      completedDate: "2024-01-05",
      completedBy: "Mohammad",
      status: "Completed"
    },
    {
      id: 102,
      name: "Budget Approval",
      project: "Public Park Development",
      projectId: 2,
      completedDate: "2024-01-06",
      completedBy: "Ahmed",
      status: "Completed"
    },
    {
      id: 103,
      name: "Stakeholder Consultation",
      project: "Road Safety Improvements",
      projectId: 3,
      completedDate: "2024-01-04",
      completedBy: "Fatima",
      status: "Completed"
    },
    {
      id: 104,
      name: "Equipment Procurement",
      project: "Municipal Infrastructure Development",
      projectId: 1,
      completedDate: "2024-01-03",
      completedBy: "Ali",
      status: "Completed"
    },
    {
      id: 105,
      name: "Quality Assurance Planning",
      project: "Hospital Renovation",
      projectId: 4,
      completedDate: "2024-01-07",
      completedBy: "Layla",
      status: "Completed"
    }
  ];
  
  // Get the number of days until a task is due
  const getDaysUntilDue = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Get appropriate badge styling based on due date
  const getDueDateBadgeStyle = (dueDateStr) => {
    const daysUntilDue = getDaysUntilDue(dueDateStr);
    
    if (daysUntilDue < 0) {
      return {
        backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)`,
        color: colors.accent2,
        text: `${Math.abs(daysUntilDue)} days overdue`
      };
    } else if (daysUntilDue <= 3) {
      return {
        backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)`,
        color: colors.accent2,
        text: daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''} left`
      };
    } else if (daysUntilDue <= 7) {
      return {
        backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)`,
        color: colors.tertiary,
        text: `${daysUntilDue} days left`
      };
    } else {
      return {
        backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)`,
        color: colors.completed,
        text: `${daysUntilDue} days left`
      };
    }
  };
  
  // Get days since completion for a task
  const getDaysSinceCompletion = (completedDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedDate = new Date(completedDateStr);
    const diffTime = today - completedDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // If we have upcoming tasks data from API, use it. Otherwise, use the dummy data
  // Make sure tasks have all required properties
  const displayUpcomingTasks = upcomingTasks.length > 0 
    ? upcomingTasks.map(task => ({
        id: task.id || Math.random().toString(36).substr(2, 9),
        name: task.name || 'Unnamed Task',
        project: task.project || 'Unknown Project',
        projectId: task.projectId || 0,
        dueDate: task.dueDate || new Date().toISOString().split('T')[0],
        priority: task.priority || 'Medium',
        assignee: task.assignee || null,
        status: task.status || 'To Do'
      }))
    : upcomingTasksDummyData;
  
  // If we have completed tasks data from API, use it. Otherwise, use the dummy data
  // Make sure completed tasks have all required properties  
  const displayCompletedTasks = completedTasks.length > 0 
    ? completedTasks.map(task => ({
        id: task.id || Math.random().toString(36).substr(2, 9),
        name: task.name || 'Unnamed Task',
        project: task.project || 'Unknown Project',
        projectId: task.projectId || 0,
        completedDate: task.completedDate || new Date().toISOString().split('T')[0],
        completedBy: task.completedBy || null,
        status: task.status || 'Completed'
      }))
    : completedTasksDummyData;

  return (
    <div className="projects-analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Project Health Dashboard</h4>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <select 
            className="form-select form-select-sm rounded-pill me-2" 
            name="projectId" 
            onChange={handleFilterChange}
            value={filter.projectId}
            style={{ minWidth: '200px' }}
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
            name="department" 
            onChange={handleFilterChange}
            value={filter.department}
          >
            <option value="all">All Departments</option>
            {[...new Set(projects.map(p => p.department))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Health Cards with data from API */}
      <div className="row g-4 mb-4">
        {projectHealthData
          .filter(p => filter.projectId === 'all' || parseInt(filter.projectId) === p.id)
          .map(project => (
            <div key={project.id} className="col-md-4">
              <div className="kpi-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{project.title}</h5>
                  <span className="badge" style={{ 
                    backgroundColor: project.status === 'Active' ? colors.primary : 
                                    project.status === 'Completed' ? colors.completed : 
                                    project.status === 'On Hold' ? colors.tertiary : colors.accent2
                  }}>
                    {project.status}
                  </span>
                </div>
                <div className="health-indicators">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="text-muted">Timeline Adherence</div>
                      <div className="badge" style={{ 
                        backgroundColor: project.timelineAdherence >= 90 ? colors.completed : 
                                      project.timelineAdherence >= 75 ? colors.tertiary : colors.accent2
                      }}>
                        {Math.round(project.timelineAdherence)}%
                      </div>
                    </div>
                    <div className="progress progress-thin">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${project.timelineAdherence}%`,
                          backgroundColor: project.timelineAdherence >= 90 ? colors.completed : 
                                        project.timelineAdherence >= 75 ? colors.tertiary : colors.accent2
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="text-muted">Budget Adherence</div>
                      <div className="badge" style={{ 
                        backgroundColor: project.budgetAdherence >= 90 ? colors.completed : 
                                      project.budgetAdherence >= 75 ? colors.tertiary : colors.accent2
                      }}>
                        {Math.round(project.budgetAdherence)}%
                      </div>
                    </div>
                    <div className="progress progress-thin">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${project.budgetAdherence}%`,
                          backgroundColor: project.budgetAdherence >= 90 ? colors.completed : 
                                        project.budgetAdherence >= 75 ? colors.tertiary : colors.accent2
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="text-muted">Task Efficiency</div>
                      <div className="badge" style={{ 
                        backgroundColor: project.taskEfficiency >= 90 ? colors.completed : 
                                      project.taskEfficiency >= 75 ? colors.tertiary : colors.accent2
                      }}>
                        {Math.round(project.taskEfficiency)}%
                      </div>
                    </div>
                    <div className="progress progress-thin">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${project.taskEfficiency}%`,
                          backgroundColor: project.taskEfficiency >= 90 ? colors.completed : 
                                        project.taskEfficiency >= 75 ? colors.tertiary : colors.accent2
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="mt-4 text-center">
                  <div className="text-muted mb-2">Overall Health</div>
                  <div className="d-flex align-items-center justify-content-center">
                    <div 
                      className="health-meter-ring" 
                      style={{
                        background: `conic-gradient(
                          ${project.overallHealth >= 90 ? colors.completed : 
                            project.overallHealth >= 75 ? colors.tertiary : colors.accent2} 
                          ${project.overallHealth * 3.6}deg, 
                          rgba(${safeHexToRgb(colors.quinary)}, 0.3) ${project.overallHealth * 3.6}deg 360deg
                        )`
                      }}
                    >
                      <div className="health-meter-center">
                        <h3 className="mb-0" style={{ color: project.overallHealth >= 75 ? colors.primary : colors.accent2 }}>
                          {project.overallHealth}%
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {/* Featured charts for completed tasks and upcoming tasks */}
      <h5 className="text-muted fw-bold mb-3">Task Management Overview</h5>
      <div className="row mb-4 g-4">
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-check2-all me-2"></i>Completed Tasks Trend
              </h5>
              <div className="badge" style={{ backgroundColor: colors.primary }}>
                <i className="bi bi-arrow-up me-1"></i> 12% Increase
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: "320px" }}>
                <Line 
                  data={completedTasksData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 13
                        },
                        callbacks: {
                          label: function(context) {
                            return `Completed: ${context.parsed.y} tasks`;
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
                          text: 'Tasks Completed',
                          font: {
                            size: 13,
                            weight: '500'
                          },
                          color: colors.primary
                        },
                        ticks: {
                          precision: 0,
                          font: {
                            size: 12
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center small text-muted">
                  <div>Total completed this quarter: <span className="fw-bold text-dark">111</span></div>
                  <div>Avg. completion rate: <span className="fw-bold text-dark">18.5 tasks/month</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>Upcoming Tasks
              </h5>
              <div className="badge" style={{ backgroundColor: colors.secondary }}>
                <i className="bi bi-arrow-right me-1"></i> Next 30 Days
              </div>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="chart-container" style={{ height: "250px", margin: "0 auto", maxWidth: "400px" }}>
                <Doughnut 
                  data={upcomingTasksData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 13
                        },
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed} tasks`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="mt-auto">
                <div className="d-flex flex-wrap justify-content-between align-items-center px-3">
                  <div className="d-flex align-items-center mb-2 me-2">
                    <div className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.primary, borderRadius: '2px' }}></div>
                    <div className="small">
                      <div className="fw-bold">This Week</div>
                      <div className="text-muted">8 tasks (23%)</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-2 me-2">
                    <div className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.secondary, borderRadius: '2px' }}></div>
                    <div className="small">
                      <div className="fw-bold">Next Week</div>
                      <div className="text-muted">12 tasks (34%)</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-2 me-2">
                    <div className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.tertiary, borderRadius: '2px' }}></div>
                    <div className="small">
                      <div className="fw-bold">In 2 Weeks</div>
                      <div className="text-muted">6 tasks (17%)</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="d-inline-block me-2" style={{ width: '12px', height: '12px', backgroundColor: colors.quaternary, borderRadius: '2px' }}></div>
                    <div className="small">
                      <div className="fw-bold">In 3+ Weeks</div>
                      <div className="text-muted">9 tasks (26%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of the project charts */}
      <div className="row mb-4 g-4">
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-check2-square me-2"></i>Task Completion by Project
              </h5>
              <span className="badge" style={{ backgroundColor: colors.tertiary }}>
                {projects.reduce((sum, p) => sum + p.completedTasks, 0)} Tasks Completed
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...projectTaskCompletionData,
                    datasets: projectTaskCompletionData.datasets.map((dataset, index) => ({
                      ...dataset,
                      backgroundColor: index === 0 ? colors.completed : colors.primary
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
                        grid: {
                          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
                        },
                        title: {
                          display: true,
                          text: 'Number of Tasks',
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
                        grid: {
                          display: false
                        },
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
                
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-clock-history me-2"></i>Timeline Status
              </h5>
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                Progress vs. Elapsed Time
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Bar 
                  data={{
                    ...projectTimelineData,
                    datasets: projectTimelineData.datasets.map((dataset, index) => ({
                      ...dataset,
                      backgroundColor: index === 0 ? colors.tertiary : colors.quaternary
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
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.x.toFixed(1)}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        min: 0,
                        max: 100,
                        grid: {
                          color: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`
                        },
                        ticks: {
                          callback: value => `${value}%`,
                          font: { size: 10 }
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: { size: 10 }
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
      
      {/* Additional project charts and data */}
      <div className="row g-4">
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-flag me-2"></i>Milestone Achievement
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Bar 
                  data={milestonesData}
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
                          text: 'Number of Milestones',
                          font: { size: 12, weight: 'normal' }
                        },
                        ticks: { font: { size: 10 } }
                      },
                      x: {
                        ticks: { font: { size: 10 } }
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
                <i className="bi bi-diagram-3 me-2"></i>Project Phase Completion
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Bar 
                  data={projectPhasesDetailedData}
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
                          font: { size: 11 }
                        }
                      },
                      tooltip: {
                        titleFont: { size: 13 },
                        bodyFont: { size: 12 },
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label} phase: ${context.parsed.y.toFixed(1)}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 100,
                        ticks: {
                          callback: value => `${value}%`,
                          font: { size: 10 }
                        },
                        title: { display: true, text: 'Completion %' }
                      },
                      x: {
                        ticks: { font: { size: 10 } }
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
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-shield-exclamation me-2"></i>Risk Assessment
              </h5>
              <div className="badge" style={{ backgroundColor: colors.tertiary }}>
                Top 3 Projects
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <Radar 
                  key={`radar-chart-${filter.projectId}-${filter.dateRange}`}
                  data={projectRiskExposureData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                      line: {
                        borderWidth: 2
                      }
                    },
                    scales: {
                      r: {
                        angleLines: {
                          display: true,
                          color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                          backdropColor: 'transparent',
                          stepSize: 2
                        },
                        pointLabels: {
                          font: { size: 11 }
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                      }
                    }
                  }}
                />
              </div>
              <div className="risk-legend small text-center mt-3">
                <div className="d-flex justify-content-center">
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.quaternary, borderRadius: '2px' }}></span>
                    Low Risk (1-3)
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.tertiary, borderRadius: '2px' }}></span>
                    Medium Risk (4-6)
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.primary, borderRadius: '2px' }}></span>
                    High Risk (7-10)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-building me-2"></i>Projects by Department
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                {projects && projects.length > 0 && projects.every(p => p.department) ? (
                  <PolarArea 
                    key={`polararea-chart-${filter.projectId}-${filter.dateRange}`}
                    data={{
                      labels: [...new Set(projects.map(p => p.department))],
                      datasets: [
                        {
                          data: [...new Set(projects.map(p => p.department))].map(
                            dept => projects.filter(p => p.department === dept).length
                          ),
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
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: { size: 12 }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <p className="text-muted">No department data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Priority List */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-list-stars me-2"></i>High Priority Tasks
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Financial Approval for Tender Award</td>
                  <td>Municipal Infrastructure Development</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ backgroundColor: colors.primary }}>M</div>
                      Mohammad
                    </div>
                  </td>
                  <td>Jan 12, 2024</td>
                  <td><span className="badge" style={{ backgroundColor: colors.primary }}>Critical</span></td>
                  <td><span className="badge" style={{ backgroundColor: colors.inProgress }}>In Progress</span></td>
                </tr>
                <tr>
                  <td>Tender Award</td>
                  <td>Municipal Infrastructure Development</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ backgroundColor: colors.secondary }}>M</div>
                      Mohammad
                    </div>
                  </td>
                  <td>Jan 15, 2024</td>
                  <td><span className="badge" style={{ backgroundColor: colors.primary }}>Critical</span></td>
                  <td><span className="badge" style={{ backgroundColor: colors.todo }}>To Do</span></td>
                </tr>
                <tr>
                  <td>Contract Commencement</td>
                  <td>Municipal Infrastructure Development</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ backgroundColor: colors.tertiary }}>A</div>
                      Ahmed
                    </div>
                  </td>
                  <td>Jan 30, 2024</td>
                  <td><span className="badge" style={{ backgroundColor: colors.secondary }}>High</span></td>
                  <td><span className="badge" style={{ backgroundColor: colors.todo }}>To Do</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* New components added below - after the existing "Task Priority List" table component */}
      
      {/* Upcoming Tasks Component */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-calendar-event me-2"></i>Upcoming Tasks
              </h5>
              <div className="d-flex align-items-center">
                <label className="me-2 text-nowrap small">Filter by Project:</label>
                <select 
                  className="form-select form-select-sm"
                  value={upcomingTasksProjectFilter}
                  onChange={(e) => setUpcomingTasksProjectFilter(e.target.value)}
                  style={{ 
                    minWidth: '200px',
                    borderColor: colors.primary,
                    borderRadius: '20px',
                    padding: '0.25rem 0.75rem'
                  }}
                >
                  <option value="all">All Projects</option>
                  {Array.from(new Set(displayUpcomingTasks.map(task => task.projectId))).map(projectId => {
                    const projectName = displayUpcomingTasks.find(task => task.projectId === projectId)?.project || 'Unknown';
                    return (
                      <option key={`upcoming-${projectId}`} value={projectId}>
                        {projectName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="card-body">
              {displayUpcomingTasks
                .filter(task => upcomingTasksProjectFilter === 'all' || 
                               task.projectId.toString() === upcomingTasksProjectFilter.toString())
                .length > 0 ? (
                <div className="list-group">
                  {displayUpcomingTasks
                    .filter(task => upcomingTasksProjectFilter === 'all' || 
                                  task.projectId.toString() === upcomingTasksProjectFilter.toString())
                    .map(task => {
                      const dueDateBadge = getDueDateBadgeStyle(task.dueDate);
                      return (
                        <div key={task.id} className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between align-items-center">
                            <h6 className="mb-1 d-flex align-items-center">
                              <i className="bi bi-check-circle me-2" style={{ color: colors.tertiary }}></i>
                              {task.name}
                            </h6>
                            <span 
                              className="badge rounded-pill" 
                              style={{ 
                                backgroundColor: dueDateBadge.backgroundColor,
                                color: dueDateBadge.color,
                                fontSize: '0.75rem',
                                padding: '0.35em 0.65em'
                              }}
                            >
                              {dueDateBadge.text}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div>
                              <span className="badge me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                                color: colors.primary,
                                borderRadius: '12px',
                                padding: '4px 8px'
                              }}>
                                {task.project}
                              </span>
                              <span className="badge" style={{ 
                                backgroundColor: 
                                  task.priority === 'Critical' ? colors.accent2 : 
                                  task.priority === 'High' ? colors.secondary : 
                                  task.priority === 'Medium' ? colors.tertiary : colors.quaternary,
                                borderRadius: '12px',
                                padding: '4px 8px'
                              }}>
                                {task.priority}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="text-muted me-3 small">
                                <i className="bi bi-calendar3 me-1"></i>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <div className="avatar-circle me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                                color: colors.primary,
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem'
                              }}>
                                {task.assignee ? task.assignee.charAt(0) : '?'}
                              </div>
                              <span className="small">{task.assignee || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: colors.quaternary }}></i>
                  <p className="text-muted mt-2">No upcoming tasks for the selected project</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently Completed Tasks Component with data from API */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-check2-all me-2"></i>Recently Completed Tasks
              </h5>
              <div className="d-flex align-items-center">
                <label className="me-2 text-nowrap small">Filter by Project:</label>
                <select 
                  className="form-select form-select-sm"
                  value={completedTasksProjectFilter}
                  onChange={(e) => setCompletedTasksProjectFilter(e.target.value)}
                  style={{ 
                    minWidth: '200px',
                    borderColor: colors.primary,
                    borderRadius: '20px',
                    padding: '0.25rem 0.75rem'
                  }}
                >
                  <option value="all">All Projects</option>
                  {Array.from(new Set(displayCompletedTasks.map(task => task.projectId))).map(projectId => {
                    const projectName = displayCompletedTasks.find(task => task.projectId === projectId)?.project || 'Unknown';
                    return (
                      <option key={`completed-${projectId}`} value={projectId}>
                        {projectName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="card-body">
              {displayCompletedTasks
                .filter(task => completedTasksProjectFilter === 'all' || 
                               task.projectId.toString() === completedTasksProjectFilter.toString())
                .length > 0 ? (
                <div className="list-group">
                  {displayCompletedTasks
                    .filter(task => completedTasksProjectFilter === 'all' || 
                                  task.projectId.toString() === completedTasksProjectFilter.toString())
                    .map(task => {
                      const daysSince = getDaysSinceCompletion(task.completedDate);
                      return (
                        <div key={task.id} className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between align-items-center">
                            <h6 className="mb-1 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill me-2" style={{ color: colors.completed }}></i>
                              {task.name}
                            </h6>
                            <span 
                              className="badge rounded-pill" 
                              style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)`,
                                color: colors.completed,
                                fontSize: '0.75rem',
                                padding: '0.35em 0.65em'
                              }}
                            >
                              {daysSince === 0 ? 'Completed today' : 
                               daysSince === 1 ? 'Completed yesterday' : 
                               `Completed ${daysSince} days ago`}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div>
                              <span className="badge me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                                color: colors.primary,
                                borderRadius: '12px',
                                padding: '4px 8px'
                              }}>
                                {task.project}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="text-muted me-3 small">
                                <i className="bi bi-calendar-check me-1"></i>
                                Completed: {new Date(task.completedDate).toLocaleDateString()}
                              </span>
                              <div className="avatar-circle me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.completed)}, 0.1)`,
                                color: colors.completed,
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem'
                              }}>
                                {task.completedBy ? task.completedBy.charAt(0) : '?'}
                              </div>
                              <span className="small">{task.completedBy}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-archive" style={{ fontSize: '2rem', color: colors.quaternary }}></i>
                  <p className="text-muted mt-2">No recently completed tasks for the selected project</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsTab;