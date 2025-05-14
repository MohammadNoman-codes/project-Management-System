import React from 'react';
import { Pie } from 'react-chartjs-2';

function BudgetSummary({ budget, currency = 'USD', onShowDetails }) {
  // Purple-themed color palette for styling to match Dashboard
  const purpleColors = {
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

  // Calculate summary metrics
  const totalBudget = budget.estimated || 0;
  const totalSpent = budget.actual || 0;
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
  
  // Get appropriate budget color based on percentage
  const getBudgetColor = (percentage) => {
    if (percentage > 90) return purpleColors.accent2; // Over budget or close to it
    if (percentage > 70) return purpleColors.tertiary; // Getting close to budget limit
    return purpleColors.completed; // Under budget, good status
  };
  
  // Data for pie chart with purple palette
  const categoryData = {
    labels: ['Development', 'Design', 'Testing', 'Infrastructure', 'Marketing'],
    datasets: [
      {
        label: 'Budget Allocation',
        data: [40, 20, 15, 15, 10],
        backgroundColor: [
          purpleColors.primary,
          purpleColors.secondary,
          purpleColors.tertiary,
          purpleColors.quaternary,
          purpleColors.accent1,
        ],
        borderWidth: 1,
        borderColor: ['white', 'white', 'white', 'white', 'white'],
      },
    ],
  };

  return (
    <div className="budget-summary">
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-cash-coin me-2"></i>Budget Overview
              </h5>
              <span className="badge" style={{ backgroundColor: getBudgetColor(spentPercentage) }}>
                {spentPercentage.toFixed(0)}% Used
              </span>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-7">
                  <div className="d-flex align-items-center">
                    <div className="icon-wrapper me-2" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`, 
                      color: purpleColors.primary,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-wallet2"></i>
                    </div>
                    <div>Total Budget:</div>
                  </div>
                </div>
                <div className="col-5 text-end fw-bold fs-5">{currency} {totalBudget.toLocaleString()}</div>
              </div>
              <div className="row mb-3">
                <div className="col-7">
                  <div className="d-flex align-items-center">
                    <div className="icon-wrapper me-2" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.1)`, 
                      color: purpleColors.accent2,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-credit-card"></i>
                    </div>
                    <div>Total Spent:</div>
                  </div>
                </div>
                <div className="col-5 text-end fw-bold fs-5">{currency} {totalSpent.toLocaleString()}</div>
              </div>
              <div className="row mb-4">
                <div className="col-7">
                  <div className="d-flex align-items-center">
                    <div className="icon-wrapper me-2" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(purpleColors.completed)}, 0.1)`, 
                      color: purpleColors.completed,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-piggy-bank"></i>
                    </div>
                    <div>Remaining:</div>
                  </div>
                </div>
                <div className="col-5 text-end fw-bold fs-5">{currency} {remaining.toLocaleString()}</div>
              </div>
              <div className="progress progress-thin mb-2" style={{ height: '8px' }}>
                <div 
                  className="progress-bar"
                  role="progressbar" 
                  style={{ 
                    width: `${spentPercentage}%`,
                    backgroundColor: getBudgetColor(spentPercentage)
                  }} 
                  aria-valuenow={spentPercentage} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between text-muted small">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="text-center mt-4">
                <button 
                  className="btn btn-outline-primary rounded-pill"
                  onClick={onShowDetails}
                  style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                >
                  <i className="bi bi-eye me-1"></i> View Detailed Budget
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dashboard-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>Budget Allocation
              </h5>
            </div>
            <div className="card-body d-flex flex-column align-items-center">
              <div style={{ maxWidth: '280px', marginBottom: '20px' }}>
                <Pie 
                  data={categoryData}
                  options={{ 
                    maintainAspectRatio: true,
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
                      }
                    }
                  }} 
                />
              </div>
              
              <div className="budget-legend w-100 mt-auto">
                <div className="row">
                  <div className="col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: purpleColors.primary, borderRadius: '2px' }}></div>
                      <div className="small">Development (40%)</div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: purpleColors.secondary, borderRadius: '2px' }}></div>
                      <div className="small">Design (20%)</div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: purpleColors.tertiary, borderRadius: '2px' }}></div>
                      <div className="small">Testing (15%)</div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: purpleColors.quaternary, borderRadius: '2px' }}></div>
                      <div className="small">Infrastructure (15%)</div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: purpleColors.accent1, borderRadius: '2px' }}></div>
                      <div className="small">Marketing (10%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {budget.expenses && budget.expenses.length > 0 && (
        <div className="dashboard-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-receipt me-2"></i>Recent Expenses
            </h5>
            <button 
              className="btn btn-sm btn-outline-primary rounded-pill"
              onClick={onShowDetails}
              style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
            >
              <i className="bi bi-list-ul me-1"></i> View All
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.expenses.slice(0, 5).map(expense => (
                    <tr key={expense.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="icon-wrapper-sm me-2" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`, 
                            color: purpleColors.tertiary,
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem"
                          }}>
                            <i className="bi bi-calendar3"></i>
                          </div>
                          {expense.date}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                          color: purpleColors.primary,
                          borderRadius: '12px',
                          padding: '4px 8px'
                        }}>
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.description}</td>
                      <td className="text-end fw-medium">{currency} {expense.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetSummary;
