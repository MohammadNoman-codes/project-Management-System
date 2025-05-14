import React from 'react';
import { Line } from 'react-chartjs-2';

function PerformanceTrendWidget({ dateRange = "month", colors }) {
  // Purple-themed color palette for styling to match Dashboard
  const purpleColors = colors || {
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
    completed: '#7986cb',    // Blue-ish purple for ahead/under
    inProgress: '#9575cd',   // Medium purple for on target
    overBudget: '#8559da',   // Bright purple for over budget
    behindSchedule: '#5e35b1', // Deep violet for behind schedule
    
    // Status colors
    success: '#7986cb',      // Success color in purple theme
    danger: '#8559da',       // Danger color in purple theme
    info: '#9575cd',         // Info color in purple theme
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

  // Mock performance data for demonstration
  const dates = getDateRangeLabels(dateRange);
  
  // Generate mock performance metrics
  const generateMockPerformance = (baseline, volatility) => {
    return dates.map(() => baseline + (Math.random() - 0.5) * volatility);
  };
  
  const schedulePerformanceIndex = generateMockPerformance(1.05, 0.3);
  const costPerformanceIndex = generateMockPerformance(0.95, 0.2);
  const taskCompletionRate = generateMockPerformance(85, 15);
  
  // Chart data with purple palette
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Schedule Performance (SPI)',
        data: schedulePerformanceIndex,
        borderColor: purpleColors.primary,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)`,
        yAxisID: 'y',
        tension: 0.4,
        pointBackgroundColor: purpleColors.primary,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Cost Performance (CPI)',
        data: costPerformanceIndex,
        borderColor: purpleColors.tertiary,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.2)`,
        yAxisID: 'y',
        tension: 0.4,
        pointBackgroundColor: purpleColors.tertiary,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Task Completion (%)',
        data: taskCompletionRate,
        borderColor: purpleColors.completed,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.completed)}, 0.2)`,
        yAxisID: 'y1',
        tension: 0.4,
        pointBackgroundColor: purpleColors.completed,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
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
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            if (label.includes('%')) {
              return `${label}: ${value.toFixed(1)}%`;
            } else {
              return `${label}: ${value.toFixed(2)}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Performance Index',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        min: 0.5,
        max: 1.5,
        grid: {
          color: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Completion %',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        min: 0,
        max: 100,
        grid: {
          display: false
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
  };
  
  if (!chartData) {
    return (
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-graph-up me-2"></i>Performance Trends
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <i className="bi bi-bar-chart-line" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
            <p className="text-muted mt-3">No performance data available</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="dashboard-section-title mb-0">
          <i className="bi bi-graph-up me-2"></i>Performance Trends
        </h5>
        <div className="badge" style={{ backgroundColor: purpleColors.primary }}>
          {dateRange === 'week' ? 'Last Week' : 
           dateRange === 'month' ? 'Last Month' : 
           dateRange === 'quarter' ? 'Last Quarter' : 
           dateRange === 'year' ? 'Last Year' : 'Custom Range'}
        </div>
      </div>
      <div className="card-body">
        <div style={{ height: '350px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="row g-3 mt-4">
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="kpi-title">
                  <i className="bi bi-calendar-check me-2" style={{ color: purpleColors.primary }}></i>
                  Schedule Performance
                </h6>
                <span className="badge" style={{ 
                  backgroundColor: schedulePerformanceIndex[schedulePerformanceIndex.length - 1] >= 1 ? 
                    purpleColors.success : purpleColors.danger,
                  fontSize: '0.875rem',
                  padding: '0.35em 0.65em'
                }}>
                  {schedulePerformanceIndex[schedulePerformanceIndex.length - 1].toFixed(2)}
                </span>
              </div>
              <div className="mt-3">
                <div className="progress progress-thin">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(100, schedulePerformanceIndex[schedulePerformanceIndex.length - 1] * 70)}%`,
                      backgroundColor: schedulePerformanceIndex[schedulePerformanceIndex.length - 1] >= 1 ? 
                        purpleColors.success : purpleColors.danger
                    }}
                  ></div>
                </div>
                <div className="text-muted small mt-2">
                  <i className={`bi ${schedulePerformanceIndex[schedulePerformanceIndex.length - 1] >= 1 ? 
                    'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
                  {schedulePerformanceIndex[schedulePerformanceIndex.length - 1] >= 1 ? 
                    'Ahead of schedule' : 'Behind schedule'}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="kpi-title">
                  <i className="bi bi-cash-coin me-2" style={{ color: purpleColors.tertiary }}></i>
                  Cost Performance
                </h6>
                <span className="badge" style={{ 
                  backgroundColor: costPerformanceIndex[costPerformanceIndex.length - 1] >= 1 ? 
                    purpleColors.success : purpleColors.danger,
                  fontSize: '0.875rem',
                  padding: '0.35em 0.65em'
                }}>
                  {costPerformanceIndex[costPerformanceIndex.length - 1].toFixed(2)}
                </span>
              </div>
              <div className="mt-3">
                <div className="progress progress-thin">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(100, costPerformanceIndex[costPerformanceIndex.length - 1] * 70)}%`,
                      backgroundColor: costPerformanceIndex[costPerformanceIndex.length - 1] >= 1 ? 
                        purpleColors.success : purpleColors.danger
                    }}
                  ></div>
                </div>
                <div className="text-muted small mt-2">
                  <i className={`bi ${costPerformanceIndex[costPerformanceIndex.length - 1] >= 1 ? 
                    'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
                  {costPerformanceIndex[costPerformanceIndex.length - 1] >= 1 ? 
                    'Under budget' : 'Over budget'}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="kpi-title">
                  <i className="bi bi-check2-all me-2" style={{ color: purpleColors.completed }}></i>
                  Task Completion
                </h6>
                <span className="badge" style={{ 
                  backgroundColor: purpleColors.info,
                  fontSize: '0.875rem',
                  padding: '0.35em 0.65em'
                }}>
                  {taskCompletionRate[taskCompletionRate.length - 1].toFixed(1)}%
                </span>
              </div>
              <div className="mt-3">
                <div className="progress progress-thin">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(100, taskCompletionRate[taskCompletionRate.length - 1])}%`,
                      backgroundColor: purpleColors.info
                    }}
                  ></div>
                </div>
                <div className="text-muted small mt-2">
                  <i className={`bi ${(taskCompletionRate[taskCompletionRate.length - 1] - taskCompletionRate[taskCompletionRate.length - 2]) > 0 ? 
                    'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
                  {(taskCompletionRate[taskCompletionRate.length - 1] - taskCompletionRate[taskCompletionRate.length - 2]).toFixed(1)}% since last period
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="alert mt-4" style={{ 
          backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
          borderLeft: `4px solid ${purpleColors.tertiary}`,
          color: '#333',
          borderRadius: '4px',
          padding: '12px 16px'
        }}>
          <div className="d-flex">
            <div className="me-3">
              <i className="bi bi-info-circle" style={{ color: purpleColors.tertiary }}></i>
            </div>
            <div>
              <small className="text-muted">
                SPI &gt; 1 indicates ahead of schedule, SPI &lt; 1 indicates behind schedule.<br />
                CPI &gt; 1 indicates under budget, CPI &lt; 1 indicates over budget.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate date labels based on range
function getDateRangeLabels(range) {
  const dates = [];
  const today = new Date();
  let count = 0;
  
  switch (range) {
    case 'week':
      count = 7;
      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - i - 1));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case 'month':
      count = 30;
      for (let i = 0; i < count; i += 3) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - i - 1));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case 'quarter':
      count = 12;
      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - ((count - i) * 7));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case 'year':
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - (11 - i));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      break;
    default:
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (9 - i));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
  }
  
  return dates;
}

export default PerformanceTrendWidget;
