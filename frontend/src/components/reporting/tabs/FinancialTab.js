import React from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

function FinancialTab({ 
  chartColors, 
  projects, 
  financialData,
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

  const expensesTrendData = {
    labels: financialData.expensesByMonth?.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: financialData.expensesByMonth?.map(item => item.amount),
        fill: true,
        backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.2)`,
        borderColor: colors.primary,
        tension: 0.3,
        pointBackgroundColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const expensesByCategoryData = {
    labels: financialData.expensesByCategory?.map(item => item.category),
    datasets: [
      {
        data: financialData.expensesByCategory?.map(item => item.amount),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.tertiary,
          colors.quaternary,
          colors.accent1,
          colors.accent2
        ],
        borderColor: ['white', 'white', 'white', 'white', 'white', 'white'],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const budgetVarianceData = {
    labels: financialData.projectBudgetVariance?.map(item => item.project),
    datasets: [
      {
        label: 'Budget Variance (%)',
        data: financialData.projectBudgetVariance?.map(item => item.variance),
        backgroundColor: financialData.projectBudgetVariance?.map(item => 
          item.variance < -5 ? colors.completed : 
          item.variance < 0 ? colors.tertiary :
          item.variance < 5 ? colors.quaternary : 
          colors.accent2
        ),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        barPercentage: 0.7
      }
    ]
  };

  const forecastVsActualData = {
    labels: financialData.forecastByQuarter?.map(item => `${item.quarter} ${item.year}`),
    datasets: [
      {
        label: 'Forecast',
        data: financialData.forecastByQuarter?.map(item => item.forecast),
        fill: false,
        borderColor: colors.primary,
        tension: 0.3,
        pointBackgroundColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Actual',
        data: financialData.forecastByQuarter?.map(item => item.actual),
        fill: false,
        borderColor: colors.completed,
        tension: 0.3,
        pointBackgroundColor: colors.completed,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const budgetBreakdownData = {
    labels: ['Spent', 'Committed', 'Remaining'],
    datasets: [
      {
        data: [
          financialData.totalSpent || 0,
          financialData.totalCommitted || 0,
          financialData.totalRemaining || 0
        ],
        backgroundColor: [
          colors.accent2,
          colors.tertiary,
          colors.quaternary
        ],
        borderColor: ['white', 'white', 'white'],
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  };

  return (
    <div className="financial-analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Financial Reports</h4>
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
                <h6 className="kpi-title">Total Budget</h6>
                <h2 className="kpi-value">BHD {financialData.totalBudget?.toLocaleString()}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)` }}>
                <i className="bi bi-cash-coin fs-3" style={{ color: colors.primary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Across all active projects</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: colors.primary }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Budget Spent</h6>
                <h2 className="kpi-value">BHD {financialData.totalSpent?.toLocaleString()}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)` }}>
                <i className="bi bi-credit-card fs-3" style={{ color: colors.accent2 }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">
              {Math.round((financialData.totalSpent / financialData.totalBudget) * 100)}% of total budget spent
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${Math.round((financialData.totalSpent / financialData.totalBudget) * 100)}%`, 
                backgroundColor: colors.accent2 
              }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Budget Remaining</h6>
                <h2 className="kpi-value">BHD {financialData.totalRemaining?.toLocaleString()}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)` }}>
                <i className="bi bi-piggy-bank fs-3" style={{ color: colors.quaternary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">
              {Math.round((financialData.totalRemaining / financialData.totalBudget) * 100)}% of total budget remaining
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${Math.round((financialData.totalRemaining / financialData.totalBudget) * 100)}%`, 
                backgroundColor: colors.quaternary 
              }}></div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Committed Funds</h6>
                <h2 className="kpi-value">BHD {financialData.totalCommitted?.toLocaleString()}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)` }}>
                <i className="bi bi-file-earmark-text fs-3" style={{ color: colors.tertiary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">
              {Math.round((financialData.totalCommitted / financialData.totalBudget) * 100)}% committed in pending contracts
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${Math.round((financialData.totalCommitted / financialData.totalBudget) * 100)}%`, 
                backgroundColor: colors.tertiary 
              }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts - First Row */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up-arrow me-2"></i>Monthly Expense Trend
              </h5>
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                Year-to-Date Total: BHD {financialData.expensesByMonth?.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Line 
                  data={expensesTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `BHD ${context.parsed.y.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Amount (BHD)',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString();
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
        
        <div className="col-md-4">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>Budget Breakdown
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '250px', position: 'relative' }}>
                <Doughnut 
                  data={budgetBreakdownData}
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
                            return `BHD ${value.toLocaleString()} (${percentage}%)`;
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
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.accent2, borderRadius: '2px' }}></span>
                    Spent: BHD {financialData.totalSpent?.toLocaleString()}
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.tertiary, borderRadius: '2px' }}></span>
                    Committed: BHD {financialData.totalCommitted?.toLocaleString()}
                  </div>
                  <div className="mx-2">
                    <span className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: colors.quaternary, borderRadius: '2px' }}></span>
                    Remaining: BHD {financialData.totalRemaining?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>Expenses by Category
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Pie 
                  data={expensesByCategoryData}
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
                            return `BHD ${value.toLocaleString()} (${percentage}%)`;
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
                <i className="bi bi-bar-chart me-2"></i>Project Budget Variance
              </h5>
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                % Over/Under Budget
              </span>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={budgetVarianceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y > 0 ? '+' : ''}${context.parsed.y}% ${context.parsed.y > 0 ? 'over budget' : 'under budget'}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'Variance (%)',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return `${value > 0 ? '+' : ''}${value}%`;
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
      
      {/* Charts - Third Row */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up me-2"></i>Forecast vs. Actual Expenditure
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                <Line 
                  data={forecastVsActualData}
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
                            return `${context.dataset.label}: BHD ${context.parsed.y?.toLocaleString() || 'N/A'}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Amount (BHD)',
                          font: {
                            size: 12,
                            weight: 'normal'
                          }
                        },
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString();
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
      
      {/* Budget Details Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-table me-2"></i>Project Budget Details
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
                      <th>Project</th>
                      <th>Total Budget</th>
                      <th>Spent</th>
                      <th>Committed</th>
                      <th>Remaining</th>
                      <th>Variance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects
                      .filter(p => filter.projectId === 'all' || parseInt(filter.projectId) === p.id)
                      .map(project => (
                        <tr key={project.id}>
                          <td>{project.title}</td>
                          <td>BHD {project.budget.toLocaleString()}</td>
                          <td>BHD {project.spent.toLocaleString()}</td>
                          <td>BHD {Math.round(project.budget * 0.15).toLocaleString()}</td>
                          <td>BHD {(project.budget - project.spent).toLocaleString()}</td>
                          <td>
                            <span className={
                              ((project.spent / project.budget) - 1) * 100 > 5 ? 'text-danger' :
                              ((project.spent / project.budget) - 1) * 100 > 0 ? 'text-warning' : 'text-success'
                            }>
                              {((project.spent / project.budget) - 1) * 100 > 0 ? '+' : ''}
                              {(((project.spent / project.budget) - 1) * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: project.spent / project.budget > 1 ? colors.accent2 :
                                              project.spent / project.budget > 0.9 ? colors.tertiary : 
                                              colors.completed
                            }}>
                              {project.spent / project.budget > 1 ? 'Over Budget' :
                               project.spent / project.budget > 0.9 ? 'At Risk' : 'On Budget'}
                            </span>
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

export default FinancialTab;