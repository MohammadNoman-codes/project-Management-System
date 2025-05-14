import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function FinancialReports({ project, purpleColors }) {
  const [reportType, setReportType] = useState('costBreakdown');
  const [dateRange, setDateRange] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Calculate spending trend data by month
  const getTrendData = () => {
    // In a real app, this would use actual date-based expense data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const planned = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000];
    const actual = [9500, 16200, 18500, 28000, 32500, 0, 0, 0, 0, 0, 0, 0]; // Partial year data
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Planned Spending',
          data: planned,
          borderColor: purpleColors.primary,
          backgroundColor: `rgba(${hexToRgb(purpleColors.primary)}, 0.2)`,
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Actual Spending',
          data: actual,
          borderColor: purpleColors.accent2,
          backgroundColor: `rgba(${hexToRgb(purpleColors.accent2)}, 0.2)`,
          borderWidth: 2,
          fill: true,
        }
      ]
    };
  };

  // Get cost breakdown by category data
  const getCostBreakdownData = () => {
    // In a real app, this would aggregate expenses by category
    // Use actual project expense data if available
    const expenseCategories = {};
    const budgetCategories = {};
    
    // Check if we have actual expense data
    if (project.budget?.expenses && project.budget.expenses.length > 0) {
      // Group expenses by category
      project.budget.expenses.forEach(expense => {
        if (!expenseCategories[expense.category]) {
          expenseCategories[expense.category] = 0;
        }
        expenseCategories[expense.category] += expense.amount;
      });
    }
    
    // Default categories if none defined
    const categories = Object.keys(expenseCategories).length > 0 
      ? Object.keys(expenseCategories)
      : ['Development', 'Design', 'Testing', 'Infrastructure', 'Marketing', 'Other'];
    
    // Create budgeted amounts (either actual or demo data)
    const budgetedData = categories.map(category => 
      budgetCategories[category] || (project.budget.estimated / categories.length) * getRandomFactor()
    );
    
    // Create actual amounts (either actual or demo data)
    const actualData = categories.map(category => 
      expenseCategories[category] || (project.budget.actual / categories.length) * getRandomFactor()
    );
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Budget Allocation',
          data: budgetedData,
          backgroundColor: purpleColors.primary,
        },
        {
          label: 'Actual Spending',
          data: actualData,
          backgroundColor: purpleColors.accent2,
        }
      ]
    };
  };

  // Helper to get random variation factor for demo data
  const getRandomFactor = () => {
    return 0.7 + Math.random() * 0.6; // Random between 0.7 and 1.3
  };

  // Get budget health indicators
  const getHealthIndicators = () => {
    const totalBudget = project.budget.estimated;
    const totalSpent = project.budget.actual;
    const timeElapsed = calculateTimeElapsed();
    
    return {
      costVariance: {
        value: totalBudget - totalSpent,
        percentage: ((totalBudget - totalSpent) / totalBudget * 100).toFixed(1),
        status: totalSpent <= totalBudget ? 'good' : 'bad'
      },
      burnRate: {
        value: totalSpent / (timeElapsed || 1),
        status: (totalSpent / timeElapsed) <= (totalBudget / 100) ? 'good' : 'bad'
      },
      costPerformance: {
        value: (timeElapsed > 0 ? ((timeElapsed / 100) * totalBudget) / totalSpent : 0).toFixed(2),
        status: (timeElapsed > 0 ? ((timeElapsed / 100) * totalBudget) / totalSpent >= 0.9 : false) ? 'good' : 'bad'
      }
    };
  };

  // Calculate project time elapsed as percentage
  const calculateTimeElapsed = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const today = new Date();
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Get forecast data
  const getForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const currentMonth = today.getMonth();
    
    // Calculate monthly budget based on total and project timeframe
    const monthlyBudget = project.budget.estimated / getProjectDurationInMonths();
    
    // For actuals, use random variations of monthly budget up to current month
    const actualData = months.map((_, index) => {
      if (index <= currentMonth) {
        // For past months, generate slight variations from budget
        return monthlyBudget * (0.8 + Math.random() * 0.4);
      }
      return null; // Future months have no actuals
    });
    
    // For forecasts, use smooth trend toward total budget
    const forecastData = months.map((_, index) => {
      return monthlyBudget * (0.95 + (index / 12) * 0.1);
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Forecasted',
          data: forecastData,
          borderColor: purpleColors.primary,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5]
        },
        {
          label: 'Actual',
          data: actualData,
          borderColor: purpleColors.accent2,
          backgroundColor: 'transparent',
          borderWidth: 2
        }
      ]
    };
  };

  // Calculate project duration in months
  const getProjectDurationInMonths = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)));
  };

  // Generate and download report
  const generateReport = () => {
    setIsLoading(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsLoading(false);
      alert(`${reportType} report in ${exportFormat.toUpperCase()} format would be downloaded in a real application.`);
    }, 1500);
  };

  // Helper function to convert hex to rgb for rgba colors
  function hexToRgb(hex) {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }

  useEffect(() => {
    // Set up report data based on selected report type
    if (reportType === 'costBreakdown') {
      setReportData(getCostBreakdownData());
    } else if (reportType === 'trend') {
      setReportData(getTrendData());
    } else if (reportType === 'forecast') {
      setReportData(getForecastData());
    }
  }, [reportType, dateRange, project.budget]);

  const healthIndicators = getHealthIndicators();

  return (
    <div className="financial-reports">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up me-2"></i>Financial Health Indicators
              </h5>
              <span className="badge" style={{ backgroundColor: purpleColors.primary }}>
                As of {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="dashboard-card">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Budget Variance</h6>
                      <h3 className={healthIndicators.costVariance.status === 'good' ? 'text-success' : 'text-danger'}>
                        {project.budget.currency} {healthIndicators.costVariance.value.toLocaleString()}
                      </h3>
                      <p className="mb-0">
                        {healthIndicators.costVariance.percentage}% 
                        {healthIndicators.costVariance.status === 'good' ? ' under budget' : ' over budget'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="dashboard-card">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Burn Rate</h6>
                      <h3 className={healthIndicators.burnRate.status === 'good' ? 'text-success' : 'text-danger'}>
                        {project.budget.currency} {Math.round(healthIndicators.burnRate.value).toLocaleString()}/month
                      </h3>
                      <p className="mb-0">
                        {healthIndicators.burnRate.status === 'good' ? 'Sustainable' : 'Concerning'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="dashboard-card">
                    <div className="card-body text-center">
                      <h6 className="text-muted">Cost Performance Index</h6>
                      <h3 className={healthIndicators.costPerformance.status === 'good' ? 'text-success' : 'text-danger'}>
                        {healthIndicators.costPerformance.value}
                      </h3>
                      <p className="mb-0">
                        {healthIndicators.costPerformance.status === 'good' ? 'On track' : 'Needs attention'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="progress" style={{ height: '30px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${calculateTimeElapsed()}%`, backgroundColor: purpleColors.tertiary }}
                    >
                      Time Elapsed: {calculateTimeElapsed()}%
                    </div>
                  </div>
                  <div className="progress mt-2" style={{ height: '30px' }}>
                    <div 
                      className={`progress-bar ${project.budget.actual > project.budget.estimated ? 'bg-danger' : ''}`} 
                      style={{ 
                        width: `${Math.min((project.budget.actual / project.budget.estimated) * 100, 100)}%`,
                        backgroundColor: project.budget.actual > project.budget.estimated ? '' : purpleColors.completed
                      }}
                    >
                      Budget Used: {((project.budget.actual / project.budget.estimated) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${reportType === 'costBreakdown' ? 'active' : ''}`}
                    onClick={() => setReportType('costBreakdown')}
                    style={reportType === 'costBreakdown' ? {
                      borderBottomColor: purpleColors.primary,
                      color: purpleColors.primary,
                      fontWeight: '500'
                    } : {}}
                  >
                    Cost Breakdown
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${reportType === 'trend' ? 'active' : ''}`}
                    onClick={() => setReportType('trend')}
                    style={reportType === 'trend' ? {
                      borderBottomColor: purpleColors.primary,
                      color: purpleColors.primary,
                      fontWeight: '500'
                    } : {}}
                  >
                    Spending Trend
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${reportType === 'forecast' ? 'active' : ''}`}
                    onClick={() => setReportType('forecast')}
                    style={reportType === 'forecast' ? {
                      borderBottomColor: purpleColors.primary,
                      color: purpleColors.primary,
                      fontWeight: '500'
                    } : {}}
                  >
                    Forecast
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {reportType === 'costBreakdown' && reportData && (
                <Bar 
                  data={reportData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Cost Breakdown by Category'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let value = context.raw;
                            return `${context.dataset.label}: ${project.budget.currency} ${value.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        ticks: {
                          callback: function(value) {
                            return `${project.budget.currency} ${value.toLocaleString()}`;
                          },
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              )}
              
              {reportType === 'trend' && reportData && (
                <Line 
                  data={reportData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Budget vs. Actual Spending Trend'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let value = context.raw;
                            return `${context.dataset.label}: ${project.budget.currency} ${value.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        ticks: {
                          callback: function(value) {
                            return `${project.budget.currency} ${value.toLocaleString()}`;
                          },
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              )}
              
              {reportType === 'forecast' && reportData && (
                <Line 
                  data={reportData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Budget Forecast vs. Actual'
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let value = context.raw;
                            if (value === null) return;
                            return `${context.dataset.label}: ${project.budget.currency} ${value.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        ticks: {
                          callback: function(value) {
                            return `${project.budget.currency} ${value.toLocaleString()}`;
                          },
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-file-earmark-pdf me-2"></i>Generate Report
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="reportType" className="form-label">Report Type</label>
                <select 
                  id="reportType" 
                  className="form-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="costBreakdown">Cost Breakdown</option>
                  <option value="trend">Spending Trend</option>
                  <option value="forecast">Forecast</option>
                  <option value="complete">Complete Financial Report</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="dateRange" className="form-label">Date Range</label>
                <select 
                  id="dateRange" 
                  className="form-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="ytd">Year to Date</option>
                  <option value="q1">Current Quarter</option>
                  <option value="m1">Current Month</option>
                  <option value="m3">Last 3 Months</option>
                  <option value="m6">Last 6 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {dateRange === 'custom' && (
                <div className="row mb-3">
                  <div className="col-6">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input type="date" className="form-control" id="startDate" />
                  </div>
                  <div className="col-6">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input type="date" className="form-control" id="endDate" />
                  </div>
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="exportFormat" className="form-label">Export Format</label>
                <select 
                  id="exportFormat" 
                  className="form-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              
              <div className="d-grid">
                <button 
                  className="btn btn-primary rounded-pill" 
                  onClick={generateReport}
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: purpleColors.primary, 
                    borderColor: purpleColors.primary
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-earmark-arrow-down me-1"></i> Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-list-columns-reverse me-2"></i>Budget Adjustment History
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Requested By</th>
                      <th>Approved By</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.budget?.budgetChanges && project.budget.budgetChanges.length > 0 ? (
                      project.budget.budgetChanges.map((change, index) => (
                        <tr key={change.id || index}>
                          <td>{change.date}</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: change.amount > 0 ? purpleColors.completed : purpleColors.accent2,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              {change.amount > 0 ? 'Increase' : 'Decrease'}
                            </span>
                          </td>
                          <td>{change.description}</td>
                          <td>{change.requestedBy || 'Unknown'}</td>
                          <td>{change.approvedBy || (change.status === 'Approved' ? 'System' : '-')}</td>
                          <td className={`text-end ${change.amount > 0 ? 'text-success' : 'text-danger'}`}>
                            {change.amount > 0 ? '+' : ''}{project.budget.currency} {change.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Default demo data if no real budget changes exist
                      <>
                        <tr>
                          <td>2023-03-15</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: purpleColors.completed,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              Increase
                            </span>
                          </td>
                          <td>Additional development resources</td>
                          <td>John Manager</td>
                          <td>Sarah Director</td>
                          <td className="text-end text-success">+{project.budget.currency} 15,000</td>
                        </tr>
                        <tr>
                          <td>2023-02-10</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: purpleColors.tertiary,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              Reallocation
                            </span>
                          </td>
                          <td>Moved budget from Marketing to Development</td>
                          <td>Jane Smith</td>
                          <td>Sarah Director</td>
                          <td className="text-end">±{project.budget.currency} 5,000</td>
                        </tr>
                        <tr>
                          <td>2023-01-20</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: purpleColors.accent2,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              Decrease
                            </span>
                          </td>
                          <td>Reduced testing budget</td>
                          <td>Bob Johnson</td>
                          <td>Sarah Director</td>
                          <td className="text-end text-danger">-{project.budget.currency} 3,000</td>
                        </tr>
                      </>
                    )}
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

export default FinancialReports;
