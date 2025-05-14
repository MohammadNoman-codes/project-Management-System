import React from 'react';
import { Line } from 'react-chartjs-2';

function ResourceForecastWidget({ forecastData, colors }) {
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
    capacity: '#8363ac',     // Medium purple for capacity
    demand: '#7986cb',       // Blue-purple for demand
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

  if (!forecastData || !forecastData.resourceCapacity) {
    return (
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-people me-2"></i>Resource Capacity Forecast
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <i className="bi bi-bar-chart-line" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
            <p className="text-muted mt-3">No resource forecast data available</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { resourceCapacity } = forecastData;
  
  // Prepare chart data from the resource capacity forecast with purple theme
  const chartData = {
    labels: resourceCapacity.map(week => week.weekStarting),
    datasets: [
      {
        label: 'Available Capacity (hours)',
        data: resourceCapacity.map(week => week.capacity),
        borderColor: purpleColors.capacity,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.capacity)}, 0.2)`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: purpleColors.capacity,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Forecasted Demand (hours)',
        data: resourceCapacity.map(week => week.demand),
        borderColor: purpleColors.demand,
        backgroundColor: `rgba(${safeHexToRgb(purpleColors.demand)}, 0.2)`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: purpleColors.demand,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };
  
  const chartOptions = {
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
          title: (tooltipItems) => {
            const weekIndex = tooltipItems[0].dataIndex;
            const weekData = resourceCapacity[weekIndex];
            return `Week starting ${new Date(weekData.weekStarting).toLocaleDateString()}`;
          },
          label: (context) => {
            const weekIndex = context.dataIndex;
            const weekData = resourceCapacity[weekIndex];
            
            if (context.datasetIndex === 0) {
              return `Capacity: ${weekData.capacity} hours`;
            } else {
              return `Demand: ${weekData.demand} hours (${Math.round(weekData.utilization * 100)}% utilization)`;
            }
          }
        },
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        },
        padding: 10
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
        grid: {
          color: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week Starting',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          callback: function(value, index) {
            return new Date(resourceCapacity[index].weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          },
          font: {
            size: 10
          }
        }
      }
    }
  };
  
  // Calculate overall statistics
  const totalCapacity = resourceCapacity.reduce((sum, week) => sum + week.capacity, 0);
  const totalDemand = resourceCapacity.reduce((sum, week) => sum + week.demand, 0);
  const overallocatedWeeks = resourceCapacity.filter(week => week.overallocated).length;
  const averageUtilization = resourceCapacity.reduce((sum, week) => sum + week.utilization, 0) / resourceCapacity.length;
  
  return (
    <div className="dashboard-card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="dashboard-section-title mb-0">
          <i className="bi bi-people me-2"></i>Resource Capacity Forecast
        </h5>
        <span className="badge" style={{ backgroundColor: purpleColors.primary }}>
          <i className="bi bi-calendar-week me-1"></i> Next {resourceCapacity.length} Weeks
        </span>
      </div>
      <div className="card-body">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="kpi-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="kpi-title">Average Utilization</h6>
                  <h2 className="kpi-value">{Math.round(averageUtilization * 100)}%</h2>
                </div>
                <div className="kpi-icon" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(
                    averageUtilization > 0.9 ? purpleColors.accent2 : 
                    averageUtilization > 0.8 ? purpleColors.tertiary : 
                    purpleColors.completed
                  )}, 0.1)` 
                }}>
                  <i className="bi bi-speedometer2 fs-3" style={{ 
                    color: averageUtilization > 0.9 ? purpleColors.accent2 : 
                          averageUtilization > 0.8 ? purpleColors.tertiary : 
                          purpleColors.completed
                  }}></i>
                </div>
              </div>
              <div className="progress progress-thin mt-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${Math.min(100, averageUtilization * 100)}%`, 
                    backgroundColor: averageUtilization > 0.9 ? purpleColors.accent2 : 
                                    averageUtilization > 0.8 ? purpleColors.tertiary : 
                                    purpleColors.completed
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="kpi-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="kpi-title">Total Capacity</h6>
                  <h2 className="kpi-value">{totalCapacity}</h2>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(purpleColors.capacity)}, 0.1)` }}>
                  <i className="bi bi-calendar3 fs-3" style={{ color: purpleColors.capacity }}></i>
                </div>
              </div>
              <p className="text-muted small mt-2">Available resource hours</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="kpi-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="kpi-title">Total Demand</h6>
                  <h2 className="kpi-value">{totalDemand}</h2>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(purpleColors.demand)}, 0.1)` }}>
                  <i className="bi bi-clipboard-data fs-3" style={{ color: purpleColors.demand }}></i>
                </div>
              </div>
              <p className="text-muted small mt-2">Required resource hours</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="kpi-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="kpi-title">Overallocated</h6>
                  <h2 className="kpi-value">{overallocatedWeeks}</h2>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.1)` }}>
                  <i className="bi bi-exclamation-triangle fs-3" style={{ color: purpleColors.accent2 }}></i>
                </div>
              </div>
              <p className="text-muted small mt-2">Of {resourceCapacity.length} weeks forecast</p>
            </div>
          </div>
        </div>
        
        <div style={{ height: '350px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <div className="alert mt-4" style={{ 
          backgroundColor: `rgba(${safeHexToRgb(
            overallocatedWeeks > 0 ? purpleColors.accent2 : purpleColors.completed
          )}, 0.1)`,
          borderLeft: `4px solid ${overallocatedWeeks > 0 ? purpleColors.accent2 : purpleColors.completed}`,
          color: '#333',
          borderRadius: '4px'
        }}>
          <div className="d-flex">
            <div className="me-3">
              <i className={`bi ${overallocatedWeeks > 0 ? 'bi-exclamation-triangle' : 'bi-info-circle'} fs-4`} 
                style={{ color: overallocatedWeeks > 0 ? purpleColors.accent2 : purpleColors.completed }}></i>
            </div>
            <div>
              <h6 className="fw-bold mb-1" style={{ color: overallocatedWeeks > 0 ? purpleColors.accent2 : purpleColors.completed }}>
                Capacity Forecast Insights
              </h6>
              <p className="mb-0">
                {overallocatedWeeks > 0 
                  ? `Warning: ${overallocatedWeeks} weeks show resource overallocation. Consider adding resources or adjusting project timelines.`
                  : `Resource allocation looks good for the forecast period. Current average utilization is ${Math.round(averageUtilization * 100)}%.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceForecastWidget;
