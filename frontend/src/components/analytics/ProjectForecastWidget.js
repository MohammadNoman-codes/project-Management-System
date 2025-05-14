import React from 'react';
import { Bar } from 'react-chartjs-2';

function ProjectForecastWidget({ forecastData, colors }) {
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
    p50: '#7986cb',         // 50% confidence level color
    p75: '#9575cd',         // 75% confidence level color
    p90: '#5e35b1',         // 90% confidence level color
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

  if (!forecastData || !forecastData.monteCarloCompletion) {
    return (
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-calendar-check me-2"></i>Project Completion Forecast
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <i className="bi bi-bar-chart" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
            <p className="text-muted mt-3">No forecast data available</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { monteCarloCompletion } = forecastData;
  
  // Prepare chart data from the Monte Carlo simulation with purple theme
  const chartData = {
    labels: monteCarloCompletion.simulation.map(bin => bin.date),
    datasets: [
      {
        label: 'Completion Probability',
        data: monteCarloCompletion.simulation.map(bin => bin.frequency * 100),
        backgroundColor: purpleColors.tertiary,
        borderColor: purpleColors.primary,
        borderWidth: 1,
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Probability: ${context.raw.toFixed(1)}%`;
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
          text: 'Probability (%)',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        max: 50,
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
          text: 'Estimated Completion Date',
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
  
  return (
    <div className="dashboard-card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="dashboard-section-title mb-0">
          <i className="bi bi-calendar-check me-2"></i>Project Completion Forecast
        </h5>
        <div className="badge" style={{ backgroundColor: purpleColors.primary }}>
          <i className="bi bi-graph-up me-1"></i> Monte Carlo Simulation
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                  <i className="bi bi-pie-chart me-2" style={{ color: purpleColors.p50 }}></i>50% Confidence
                </h6>
                <span className="badge rounded-pill" style={{ backgroundColor: purpleColors.p50 }}>P50</span>
              </div>
              <div className="card" style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.p50)}, 0.3)`, borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  <div className="d-flex align-items-center">
                    <div className="h3 mb-0" style={{ color: purpleColors.p50 }}>{new Date(monteCarloCompletion.p50).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="text-muted small mt-2">
                <i className="bi bi-info-circle me-1"></i> 50% chance of finishing by this date
              </div>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                  <i className="bi bi-pie-chart-fill me-2" style={{ color: purpleColors.p75 }}></i>75% Confidence
                </h6>
                <span className="badge rounded-pill" style={{ backgroundColor: purpleColors.p75 }}>P75</span>
              </div>
              <div className="card" style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.p75)}, 0.3)`, borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  <div className="d-flex align-items-center">
                    <div className="h3 mb-0" style={{ color: purpleColors.p75 }}>{new Date(monteCarloCompletion.p75).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="text-muted small mt-2">
                <i className="bi bi-info-circle me-1"></i> 75% chance of finishing by this date
              </div>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                  <i className="bi bi-pie-chart-fill me-2" style={{ color: purpleColors.p90 }}></i>90% Confidence
                </h6>
                <span className="badge rounded-pill" style={{ backgroundColor: purpleColors.p90 }}>P90</span>
              </div>
              <div className="card" style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.p90)}, 0.3)`, borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  <div className="d-flex align-items-center">
                    <div className="h3 mb-0" style={{ color: purpleColors.p90 }}>{new Date(monteCarloCompletion.p90).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="text-muted small mt-2">
                <i className="bi bi-info-circle me-1"></i> 90% chance of finishing by this date
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="alert mt-3" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
              borderLeft: `4px solid ${purpleColors.tertiary}`,
              color: '#333',
              borderRadius: '4px',
              padding: '12px 16px'
            }}>
              <div className="d-flex">
                <div className="me-3">
                  <i className="bi bi-lightbulb" style={{ color: purpleColors.tertiary }}></i>
                </div>
                <div className="small">
                  Based on Monte Carlo simulation with uncertainty factors applied to remaining tasks. 
                  For more accurate forecasting, regularly update task estimates and progress.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectForecastWidget;
