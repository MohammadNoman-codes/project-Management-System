import React from 'react';
import { Line } from 'react-chartjs-2';

function KPITrendWidget({ dateRange = "quarter", colors }) {
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
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
    underBudget: '#7986cb',  // Blue-purple
    onBudget: '#9575cd',     // Medium purple
    overBudget: '#8559da',   // Bright purple
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

  // Generate sample KPI trend data
  const labels = generateDateLabels(dateRange);
  const data = generateMockKPIData(labels.length);
  
  // Format chart data with purple palette
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Task Completion Rate',
        data: data.taskCompletionRate,
        borderColor: purpleColors.completed,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.completed)}, 0.2)`,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: purpleColors.completed,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Budget Adherence',
        data: data.budgetAdherence,
        borderColor: purpleColors.tertiary,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.2)`,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: purpleColors.tertiary,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Resource Utilization',
        data: data.resourceUtilization,
        borderColor: purpleColors.primary,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)`,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: purpleColors.primary,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          color: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          display: false
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
        mode: 'index',
        intersect: false,
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        },
        padding: 10,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      },
    }
  };
  
  // Calculate KPI trend indicators
  const getIndicator = (data) => {
    if (data.length < 2) return 'neutral';
    
    const lastValue = data[data.length - 1];
    const secondLastValue = data[data.length - 2];
    
    if (lastValue > secondLastValue) return 'up';
    if (lastValue < secondLastValue) return 'down';
    return 'neutral';
  };
  
  const getIndicatorClass = (indicator, inversed = false) => {
    if (indicator === 'up') return inversed ? 'text-danger' : 'text-success';
    if (indicator === 'down') return inversed ? 'text-success' : 'text-danger';
    return 'text-muted';
  };
  
  // Get indicator colors using purple palette
  const getIndicatorColor = (indicator, inversed = false) => {
    if (indicator === 'up') return inversed ? purpleColors.accent2 : purpleColors.completed;
    if (indicator === 'down') return inversed ? purpleColors.completed : purpleColors.accent2;
    return purpleColors.quaternary;
  };
  
  const taskTrend = getIndicator(data.taskCompletionRate);
  const budgetTrend = getIndicator(data.budgetAdherence, true); // inversed: lower is better for budget
  const resourceTrend = getIndicator(data.resourceUtilization);
  
  const getLatestValue = (data) => {
    return data[data.length - 1].toFixed(1);
  };
  
  const getChange = (data) => {
    if (data.length < 2) return 0;
    return (data[data.length - 1] - data[data.length - 2]).toFixed(1);
  };
  
  return (
    <div className="dashboard-card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="dashboard-section-title mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i>KPI Trends
        </h5>
        <div className="badge" style={{ backgroundColor: purpleColors.primary }}>
          {dateRange === 'month' ? 'Last Month' : 
           dateRange === 'quarter' ? 'Last Quarter' : 
           dateRange === 'year' ? 'Last Year' : 'Custom Range'}
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="kpi-title">
                  <i className="bi bi-check2-all me-2" style={{ color: purpleColors.completed }}></i>Task Completion
                </h6>
                <span style={{ color: getIndicatorColor(taskTrend) }}>
                  <i className={`bi bi-arrow-${taskTrend} me-1`}></i> {Math.abs(getChange(data.taskCompletionRate))}%
                </span>
              </div>
              <div className="h2 fw-bold mb-2" style={{ color: purpleColors.completed }}>{getLatestValue(data.taskCompletionRate)}%</div>
              <div className="progress progress-thin">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${data.taskCompletionRate[data.taskCompletionRate.length - 1]}%`,
                    backgroundColor: purpleColors.completed 
                  }}
                ></div>
              </div>
              <div className="text-muted mt-2 small">
                <i className="bi bi-info-circle me-1"></i> 
                {taskTrend === 'up' ? 'Improving completion rate' : 
                 taskTrend === 'down' ? 'Declining completion rate' : 
                 'Stable completion rate'}
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="kpi-title">
                  <i className="bi bi-cash-coin me-2" style={{ color: purpleColors.tertiary }}></i>Budget Adherence
                </h6>
                <span style={{ color: getIndicatorColor(budgetTrend, true) }}>
                  <i className={`bi bi-arrow-${budgetTrend} me-1`}></i> {Math.abs(getChange(data.budgetAdherence))}%
                </span>
              </div>
              <div className="h2 fw-bold mb-2" style={{ 
                color: data.budgetAdherence[data.budgetAdherence.length - 1] > 100 ? purpleColors.accent2 : purpleColors.tertiary
              }}>
                {getLatestValue(data.budgetAdherence)}%
              </div>
              <div className="progress progress-thin">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${Math.min(data.budgetAdherence[data.budgetAdherence.length - 1], 100)}%`,
                    backgroundColor: data.budgetAdherence[data.budgetAdherence.length - 1] > 100 ? purpleColors.accent2 : purpleColors.tertiary
                  }}
                ></div>
              </div>
              <div className="text-muted mt-2 small">
                <i className="bi bi-info-circle me-1"></i>
                {data.budgetAdherence[data.budgetAdherence.length - 1] > 100 ? 'Over budget' : 'Under budget'}
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="kpi-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="kpi-title">
                  <i className="bi bi-people me-2" style={{ color: purpleColors.primary }}></i>Resource Utilization
                </h6>
                <span style={{ color: getIndicatorColor(resourceTrend) }}>
                  <i className={`bi bi-arrow-${resourceTrend} me-1`}></i> {Math.abs(getChange(data.resourceUtilization))}%
                </span>
              </div>
              <div className="h2 fw-bold mb-2" style={{ color: purpleColors.primary }}>{getLatestValue(data.resourceUtilization)}%</div>
              <div className="progress progress-thin">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${data.resourceUtilization[data.resourceUtilization.length - 1]}%`,
                    backgroundColor: purpleColors.primary 
                  }}
                ></div>
              </div>
              <div className="text-muted mt-2 small">
                <i className="bi bi-info-circle me-1"></i>
                {resourceTrend === 'up' ? 'Improving utilization' : 
                 resourceTrend === 'down' ? 'Declining utilization' : 
                 'Stable utilization'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ height: '350px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <div className="alert mt-4" style={{ 
          backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
          borderLeft: `4px solid ${purpleColors.tertiary}`,
          color: '#333',
          borderRadius: '4px',
          padding: '16px'
        }}>
          <div className="d-flex">
            <div className="me-3">
              <i className="bi bi-lightbulb-fill" style={{ fontSize: '1.5rem', color: purpleColors.tertiary }}></i>
            </div>
            <div>
              <h6 className="fw-bold mb-1">KPI Insights</h6>
              <p className="mb-0">
                {generateInsight(taskTrend, budgetTrend, resourceTrend)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate date labels
function generateDateLabels(range, count = 10) {
  const dates = [];
  const today = new Date();
  
  switch (range) {
    case 'month':
      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i) * 3);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case 'quarter':
      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i) * 9);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case 'year':
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - (11 - i));
        dates.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
      break;
    default:
      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i));
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
  }
  
  return dates;
}

// Helper function to generate mock KPI data
function generateMockKPIData(count) {
  // Generate realistic mock data that shows trends
  const generateTrendData = (startValue, targetValue, count) => {
    const result = [];
    const step = (targetValue - startValue) / (count - 1);
    
    for (let i = 0; i < count; i++) {
      // Add some random variation to make it look realistic
      const randomVariation = Math.random() * 5 - 2.5; // -2.5 to 2.5
      const value = startValue + (step * i) + randomVariation;
      result.push(Math.max(0, Math.min(100, value))); // Clamp between 0 and 100
    }
    
    return result;
  };
  
  return {
    taskCompletionRate: generateTrendData(65, 85, count),
    budgetAdherence: generateTrendData(105, 98, count),
    resourceUtilization: generateTrendData(75, 90, count),
  };
}

// Generate insights based on KPI trends
function generateInsight(taskTrend, budgetTrend, resourceTrend) {
  let insights = [];
  
  if (taskTrend === 'up') {
    insights.push('Task completion rate is improving, indicating good team productivity.');
  } else if (taskTrend === 'down') {
    insights.push('Task completion rate is declining, which may require attention to team capacity or scope issues.');
  }
  
  if (budgetTrend === 'up') {
    insights.push('Budget variance is increasing, indicating potential cost control issues that should be addressed.');
  } else if (budgetTrend === 'down') {
    insights.push('Budget adherence is improving, showing effective cost management.');
  }
  
  if (resourceTrend === 'up') {
    insights.push('Resource utilization is increasing, showing improved team efficiency.');
  } else if (resourceTrend === 'down') {
    insights.push('Resource utilization is decreasing, which may indicate resource allocation issues.');
  }
  
  if (insights.length === 0) {
    return 'All KPIs are stable with no significant changes in the current time period.';
  }
  
  return insights.join(' ');
}

export default KPITrendWidget;
