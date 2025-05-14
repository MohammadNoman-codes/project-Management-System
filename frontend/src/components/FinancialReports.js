import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';

function FinancialReports({ project }) {
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
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: 'Actual Spending',
          data: actual,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          fill: true,
        }
      ]
    };
  };

  // Get cost breakdown by category data
  const getCostBreakdownData = () => {
    // In a real app, this would aggregate expenses by category
    return {
      labels: ['Development', 'Design', 'Testing', 'Infrastructure', 'Marketing', 'Other'],
      datasets: [
        {
          label: 'Budget Allocation',
          data: [40000, 20000, 15000, 25000, 15000, 5000],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Actual Spending',
          data: [35000, 18000, 10000, 22000, 8000, 2000],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
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

  // Generate and download report
  const generateReport = () => {
    setIsLoading(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsLoading(false);
      alert(`${reportType} report in ${exportFormat.toUpperCase()} format would be downloaded in a real application.`);
    }, 1500);
  };

  useEffect(() => {
    // Set up report data based on selected report type
    if (reportType === 'costBreakdown') {
      setReportData(getCostBreakdownData());
    } else if (reportType === 'trend') {
      setReportData(getTrendData());
    }
  }, [reportType, dateRange]);

  const healthIndicators = getHealthIndicators();

  return (
    <div className="financial-reports">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Financial Health Indicators</h5>
              <span className="badge bg-info">As of {new Date().toLocaleDateString()}</span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
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
                  <div className="card">
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
                  <div className="card">
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
                    <div className="progress-bar bg-info" style={{ width: `${calculateTimeElapsed()}%` }}>
                      Time Elapsed: {calculateTimeElapsed()}%
                    </div>
                  </div>
                  <div className="progress mt-2" style={{ height: '30px' }}>
                    <div 
                      className={`progress-bar ${project.budget.actual > project.budget.estimated ? 'bg-danger' : 'bg-success'}`} 
                      style={{ width: `${Math.min((project.budget.actual / project.budget.estimated) * 100, 100)}%` }}
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
          <div className="card">
            <div className="card-header bg-light">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${reportType === 'costBreakdown' ? 'active' : ''}`}
                    onClick={() => setReportType('costBreakdown')}
                  >
                    Cost Breakdown
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${reportType === 'trend' ? 'active' : ''}`}
                    onClick={() => setReportType('trend')}
                  >
                    Spending Trend
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {reportType === 'costBreakdown' && (
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
                      }
                    }
                  }}
                />
              )}
              
              {reportType === 'trend' && (
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
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Generate Report</h5>
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
                  <option value="variance">Budget Variance</option>
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
                  <option value="q1">Q1</option>
                  <option value="q2">Q2</option>
                  <option value="q3">Q3</option>
                  <option value="q4">Q4</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
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
                </select>
              </div>
              
              <div className="d-grid">
                <button 
                  className="btn btn-primary" 
                  onClick={generateReport}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : (
                    <>Export Report</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Budget Adjustment History</h5>
            </div>
            <div className="card-body">
              <table className="table table-hover">
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
                  <tr>
                    <td>2023-03-15</td>
                    <td>Increase</td>
                    <td>Additional development resources</td>
                    <td>John Doe</td>
                    <td>Sarah Wilson</td>
                    <td className="text-end text-success">+{project.budget.currency} 15,000</td>
                  </tr>
                  <tr>
                    <td>2023-02-10</td>
                    <td>Reallocation</td>
                    <td>Moved budget from Marketing to Development</td>
                    <td>Jane Smith</td>
                    <td>Sarah Wilson</td>
                    <td className="text-end">±{project.budget.currency} 5,000</td>
                  </tr>
                  <tr>
                    <td>2023-01-20</td>
                    <td>Decrease</td>
                    <td>Reduced testing budget</td>
                    <td>Bob Johnson</td>
                    <td>Sarah Wilson</td>
                    <td className="text-end text-danger">-{project.budget.currency} 3,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialReports;
