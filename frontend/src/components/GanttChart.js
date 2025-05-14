import React, { useState, useEffect } from 'react';
// Use react-gantt-timeline instead of frappe-gantt-react due to SASS loading issuesct';
import Timeline from 'react-gantt-timeline';

function GanttChart({ tasks, onTaskClick, onDateChange, onProgressChange, purpleColors }) {
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
  
  const [viewMode, setViewMode] = useState('Week');
  const [ganttTasks, setGanttTasks] = useState([]);
  
  // Transform tasks for the Timeline component with purple colors
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.map(task => {
        // Determine color based on task type or progress
        let taskColor;
        if (task.parent) {
          taskColor = colors.primary; // Milestone/parent task
        } else if (task.progress >= 100) {
          taskColor = colors.completed; // Completed task
        } else if (task.progress >= 75) {
          taskColor = colors.secondary; // Nearly complete task
        } else if (task.progress >= 25) {
          taskColor = colors.tertiary; // In progress task
        } else {
          taskColor = colors.quaternary; // Just started or not started task
        }

        return {
          id: task.id,
          name: task.name,
          start: new Date(task.start),
          end: new Date(task.end),
          color: taskColor,
          progress: task.progress || 0,
          isSelected: false,
          // Add any additional styling properties available in the component
          style: {
            backgroundColor: `rgba(${safeHexToRgb(taskColor)}, 0.8)`,
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          },
          progressColor: task.parent ? colors.quaternary : colors.accent2
        };
      });
      
      setGanttTasks(formattedTasks);
    }
  }, [tasks, colors]);
  
  // Configuration for the Timeline component with purple theme
  const config = {
    header: {
      top: {
        style: {
          background: `rgba(${safeHexToRgb(colors.quinary)}, 0.2)`,
          fontSize: 12,
          color: colors.primary,
          fontWeight: 500
        }
      },
      middle: {
        style: {
          background: `rgba(${safeHexToRgb(colors.quinary)}, 0.15)`,
          fontSize: 11,
          color: colors.secondary
        }
      },
      bottom: {
        style: {
          background: `rgba(${safeHexToRgb(colors.quinary)}, 0.1)`,
          fontSize: 10,
          color: colors.secondary
        },
        selectedStyle: {
          background: `rgba(${safeHexToRgb(colors.primary)}, 0.2)`
        }
      }
    },
    viewMode: viewMode.toLowerCase(),
    task: {
      style: {
        backgroundColor: colors.tertiary,
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
      },
      selectedStyle: {
        backgroundColor: colors.primary,
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)'
      },
      progressStyle: {
        backgroundColor: colors.accent2,
        borderRadius: '4px'
      }
    },
    verticalLines: {
      style: {
        stroke: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)`,
        strokeWidth: 1
      },
      today: {
        style: {
          stroke: colors.primary,
          strokeWidth: 1.5
        }
      }
    },
    // Any other configurations the library supports
    theme: {
      main: colors.primary,
      light: colors.quaternary
    }
  };
  
  // Handle task click
  const handleTaskClick = (task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };
  
  return (
    <div className="gantt-chart">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-muted">Project Timeline View</h6>
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${viewMode === 'Day' ? 'btn-primary' : 'btn-outline-primary'} rounded-start`}
            onClick={() => setViewMode('Day')}
            style={viewMode === 'Day' ? {
              backgroundColor: colors.primary,
              borderColor: colors.primary
            } : {
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            <i className="bi bi-calendar-date me-1"></i>Day
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'Week' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('Week')}
            style={viewMode === 'Week' ? {
              backgroundColor: colors.primary,
              borderColor: colors.primary
            } : {
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            <i className="bi bi-calendar-week me-1"></i>Week
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'Month' ? 'btn-primary' : 'btn-outline-primary'} rounded-end`}
            onClick={() => setViewMode('Month')}
            style={viewMode === 'Month' ? {
              backgroundColor: colors.primary,
              borderColor: colors.primary
            } : {
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            <i className="bi bi-calendar3 me-1"></i>Month
          </button>
        </div>
      </div>
      
      <div className="gantt-container dashboard-card" style={{
        height: '500px', 
        overflowX: 'auto', 
        overflowY: 'hidden',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
      }}>
        {ganttTasks.length > 0 ? (
          <Timeline 
            data={ganttTasks}
            config={config}
            onSelectItem={handleTaskClick}
            links={[]}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <i className="bi bi-calendar2-x" style={{ fontSize: '2rem', color: colors.quaternary }}></i>
              <p className="text-muted mt-2">No tasks available to display</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-top">
        <div className="d-flex flex-wrap justify-content-center">
          <div className="me-3 mb-2 d-flex align-items-center">
            <div className="me-1" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: colors.primary,
              borderRadius: '3px' 
            }}></div>
            <span className="small">Milestone</span>
          </div>
          <div className="me-3 mb-2 d-flex align-items-center">
            <div className="me-1" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: colors.completed,
              borderRadius: '3px' 
            }}></div>
            <span className="small">Completed</span>
          </div>
          <div className="me-3 mb-2 d-flex align-items-center">
            <div className="me-1" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: colors.secondary,
              borderRadius: '3px' 
            }}></div>
            <span className="small">Nearly Complete</span>
          </div>
          <div className="me-3 mb-2 d-flex align-items-center">
            <div className="me-1" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: colors.tertiary,
              borderRadius: '3px' 
            }}></div>
            <span className="small">In Progress</span>
          </div>
          <div className="me-3 mb-2 d-flex align-items-center">
            <div className="me-1" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: colors.quaternary,
              borderRadius: '3px' 
            }}></div>
            <span className="small">Not Started</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GanttChart;
