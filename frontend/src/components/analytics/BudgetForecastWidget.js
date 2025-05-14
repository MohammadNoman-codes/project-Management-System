import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function BudgetForecastWidget({ forecastData, colors }) {
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
    spent: '#8363ac',        // Medium purple for spent funds
    projected: '#9d80c3',    // Light purple for projected costs
    remaining: '#7986cb',    // Blue-ish purple for remaining budget
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

  if (!forecastData || !forecastData.budget) {
    return (
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-cash-stack me-2"></i>Budget Forecast
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <i className="bi bi-wallet2" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
            <p className="text-muted mt-3">No budget forecast data available</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { budget } = forecastData;
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BHD', maximumFractionDigits: 0 }).format(value);
  };
  
  // Prepare chart data with purple colors
  const chartData = {
    labels: ['Already Spent', 'Projected Additional', 'Remaining Budget'],
    datasets: [
      {
        data: [
          budget.totalSpent,
          budget.projectedAdditionalCost,
          Math.max(0, budget.variance * -1) // Only show remaining if there's a negative variance (under budget)
        ],
        backgroundColor: [
          purpleColors.primary,      // Deep purple for spent
          purpleColors.tertiary,     // Light purple for projected
          purpleColors.quaternary    // Lavender for remaining
        ],
        borderColor: [
          'white',
          'white',
          'white'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Remove the "Remaining Budget" slice if we're projecting to be over budget
  if (budget.variance >= 0) {
    chartData.labels.pop();
    chartData.datasets[0].data.pop();
    chartData.datasets[0].backgroundColor.pop();
    chartData.datasets[0].borderColor.pop();
  }
  
  const chartOptions = {
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
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${formatCurrency(value)} (${Math.round((value / (budget.forecastTotal + Math.max(0, budget.variance * -1))) * 100)}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };
  
  return (
    <div className="dashboard-card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="dashboard-section-title mb-0">
          <i className="bi bi-cash-stack me-2"></i>Budget Forecast
        </h5>
        <span className="badge" style={{ backgroundColor: purpleColors.primary }}>
          <i className="bi bi-calendar-check me-1"></i>End of Project
        </span>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-5">
            <div style={{ height: '280px', position: 'relative' }}>
              <Doughnut data={chartData} options={chartOptions} />
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center' 
                }}
              >
                <div className="text-muted mb-1">Forecast Total</div>
                <div className="h3" style={{ color: purpleColors.primary }}>{formatCurrency(budget.forecastTotal)}</div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="dashboard-card mb-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-cash-coin me-2" style={{ color: purpleColors.primary }}></i>Original Budget
                  </h6>
                  <span className="h5 mb-0">{formatCurrency(budget.forecastTotal - budget.variance)}</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card mb-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-credit-card me-2" style={{ color: purpleColors.primary }}></i>Current Spend
                  </h6>
                  <span className="h5 mb-0">{formatCurrency(budget.totalSpent)}</span>
                </div>
                <div className="progress progress-thin mt-2">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(budget.totalSpent / (budget.forecastTotal - budget.variance)) * 100}%`,
                      backgroundColor: purpleColors.primary
                    }}
                  ></div>
                </div>
                <div className="text-muted small mt-2">
                  {Math.round((budget.totalSpent / (budget.forecastTotal - budget.variance)) * 100)}% of budget spent
                </div>
              </div>
            </div>
            
            <div className="dashboard-card mb-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-graph-up-arrow me-2" style={{ color: purpleColors.tertiary }}></i>Projected Final Cost
                  </h6>
                  <span className="h5 mb-0">{formatCurrency(budget.forecastTotal)}</span>
                </div>
                <div className="progress progress-thin mt-2">
                  <div 
                    className="progress-bar"
                    role="progressbar" 
                    style={{ 
                      width: `${Math.min(100, (budget.forecastTotal / (budget.forecastTotal - budget.variance)) * 100)}%`,
                      backgroundColor: budget.variance > 0 ? purpleColors.accent2 : purpleColors.completed
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="alert" style={{ 
              backgroundColor: budget.variance > 0 ? 
                `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.1)` : 
                `rgba(${safeHexToRgb(purpleColors.completed)}, 0.1)`,
              borderLeft: `4px solid ${budget.variance > 0 ? purpleColors.accent2 : purpleColors.completed}`,
              color: '#333',
              borderRadius: '4px'
            }}>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="alert-heading mb-1">
                    <i className={`bi ${budget.variance > 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`} style={{ 
                      color: budget.variance > 0 ? purpleColors.accent2 : purpleColors.completed 
                    }}></i>
                    {budget.variance > 0 ? 'Budget Variance (Over Budget)' : 'Budget Variance (Under Budget)'}
                  </h6>
                  <div className="h4 mb-0" style={{ color: budget.variance > 0 ? purpleColors.accent2 : purpleColors.completed }}>
                    {budget.variance > 0 ? '+' : ''}{formatCurrency(budget.variance)}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-muted mb-1">Confidence</div>
                  <div className="badge rounded-pill" style={{ 
                    backgroundColor: purpleColors.primary,
                    padding: '6px 12px'
                  }}>
                    {budget.confidence.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetForecastWidget;
