import React, { useState } from 'react';

function BudgetApproval({ budget, currency = 'USD', onApproveExpense, onRejectExpense, onApproveBudgetChange, purpleColors }) {
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
    
    // Functional colors
    completed: '#7986cb',    // Blue-ish purple for approval
    rejected: '#ff5c8d',     // Pinkish for rejection
    pending: '#9575cd',      // Medium purple for pending status
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

  const [selectedItem, setSelectedItem] = useState(null);
  
  // Filter pending items that need approval
  const pendingExpenses = budget?.expenses ? 
    budget.expenses.filter(exp => exp.status === 'Pending') : [];
    
  const pendingBudgetChanges = budget?.budgetChanges ? 
    budget.budgetChanges.filter(change => change.status === 'Pending') : [];
  
  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
  };
  
  const handleApprove = () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'expense') {
      onApproveExpense(selectedItem.id);
    } else if (selectedItem.type === 'budgetChange') {
      onApproveBudgetChange(selectedItem.id);
    }
    
    setSelectedItem(null);
  };
  
  const handleReject = () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'expense') {
      onRejectExpense(selectedItem.id);
    } else if (selectedItem.type === 'budgetChange') {
      // handle budget change rejection
    }
    
    setSelectedItem(null);
  };
  
  return (
    <div className="budget-approval">
      <div className="row g-4">
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-check2-circle me-2"></i>Pending Approvals
              </h5>
              <span className="badge" style={{ backgroundColor: colors.pending }}>
                {pendingExpenses.length + pendingBudgetChanges.length} Items
              </span>
            </div>
            <div className="card-body">
              {(pendingExpenses.length === 0 && pendingBudgetChanges.length === 0) ? (
                <div className="text-center my-5 py-5">
                  <i className="bi bi-check-all" style={{ fontSize: '3rem', color: colors.completed }}></i>
                  <p className="mt-3 text-muted">No items pending approval</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Requested By</th>
                        <th className="text-end">Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingExpenses.map(expense => (
                        <tr key={`expense-${expense.id}`} className={selectedItem && selectedItem.id === expense.id ? 'table-active' : ''}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="icon-wrapper-sm me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)`, 
                                color: colors.tertiary,
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
                              backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                              color: colors.primary,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              <i className="bi bi-receipt me-1"></i> Expense
                            </span>
                          </td>
                          <td>{expense.description}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                                color: colors.primary,
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem'
                              }}>
                                {expense.requestedBy ? expense.requestedBy.charAt(0) : '?'}
                              </div>
                              <span>{expense.requestedBy || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="text-end fw-medium">{currency} {expense.amount.toLocaleString()}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-pill"
                              onClick={() => handleViewDetails(expense, 'expense')}
                              style={{ 
                                borderColor: colors.primary, 
                                color: colors.primary,
                                minWidth: '80px'
                              }}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {pendingBudgetChanges.map(change => (
                        <tr key={`budget-${change.id}`} className={selectedItem && selectedItem.id === change.id ? 'table-active' : ''}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="icon-wrapper-sm me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.tertiary)}, 0.1)`, 
                                color: colors.tertiary,
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
                              {change.date}
                            </div>
                          </td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(colors.accent2)}, 0.1)`,
                              color: colors.accent2,
                              borderRadius: '12px',
                              padding: '4px 8px'
                            }}>
                              <i className="bi bi-currency-exchange me-1"></i> Budget Change
                            </span>
                          </td>
                          <td>{change.description}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                                color: colors.primary,
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem'
                              }}>
                                {change.requestedBy ? change.requestedBy.charAt(0) : '?'}
                              </div>
                              <span>{change.requestedBy || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="text-end fw-medium">{currency} {change.amount.toLocaleString()}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-pill"
                              onClick={() => handleViewDetails(change, 'budgetChange')}
                              style={{ 
                                borderColor: colors.primary, 
                                color: colors.primary,
                                minWidth: '80px'
                              }}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          {selectedItem ? (
            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="dashboard-section-title mb-0">
                  <i className={`bi me-2 ${selectedItem.type === 'expense' ? 'bi-receipt-cutoff' : 'bi-currency-exchange'}`}></i>
                  {selectedItem.type === 'expense' ? 'Expense Details' : 'Budget Change Details'}
                </h5>
                <span className="badge" style={{ 
                  backgroundColor: colors.pending,
                  borderRadius: '12px',
                  padding: '4px 8px'
                }}>
                  <i className="bi bi-hourglass-split me-1"></i> Pending
                </span>
              </div>
              <div className="card-body">
                <div className="detail-item mb-3">
                  <label className="form-label text-muted small">Description</label>
                  <p className="fw-medium">{selectedItem.description}</p>
                </div>
                
                <div className="detail-item mb-3">
                  <label className="form-label text-muted small">Amount</label>
                  <p className="fs-4 fw-medium" style={{ color: colors.primary }}>{currency} {selectedItem.amount.toLocaleString()}</p>
                </div>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <div className="detail-item">
                      <label className="form-label text-muted small">Date</label>
                      <p className="fw-medium">{selectedItem.date}</p>
                    </div>
                  </div>
                  
                  {selectedItem.category && (
                    <div className="col-6">
                      <div className="detail-item">
                        <label className="form-label text-muted small">Category</label>
                        <p className="fw-medium">{selectedItem.category}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedItem.requestedBy && (
                  <div className="detail-item mb-3">
                    <label className="form-label text-muted small">Requested By</label>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                        color: colors.primary,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem'
                      }}>
                        {selectedItem.requestedBy.charAt(0)}
                      </div>
                      <span className="fw-medium">{selectedItem.requestedBy}</span>
                    </div>
                  </div>
                )}
                
                {selectedItem.notes && (
                  <div className="detail-item mb-3">
                    <label className="form-label text-muted small">Notes</label>
                    <p className="fw-medium">{selectedItem.notes}</p>
                  </div>
                )}
                
                {selectedItem.supportingDocuments && (
                  <div className="detail-item mb-4">
                    <label className="form-label text-muted small">Supporting Documents</label>
                    <div className="d-flex align-items-center bg-light p-2 rounded">
                      <i className="bi bi-file-earmark-pdf me-2" style={{ color: colors.primary }}></i>
                      <span>{selectedItem.supportingDocuments}</span>
                      <button className="btn btn-sm btn-link ms-auto">View</button>
                    </div>
                  </div>
                )}
                
                <hr />
                
                <div className="d-flex justify-content-between mt-4">
                  <button 
                    className="btn btn-outline-danger rounded-pill"
                    onClick={handleReject}
                  >
                    <i className="bi bi-x-circle me-1"></i> Reject
                  </button>
                  <button 
                    className="btn btn-primary rounded-pill"
                    onClick={handleApprove}
                    style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                  >
                    <i className="bi bi-check-circle me-1"></i> Approve
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="dashboard-section-title mb-0">
                  <i className="bi bi-info-circle me-2"></i>Approval Instructions
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="approval-icon-container" style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: `rgba(${safeHexToRgb(colors.primary)}, 0.1)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="bi bi-clipboard-check" style={{ fontSize: '2.5rem', color: colors.primary }}></i>
                  </div>
                </div>
                
                <h6 className="fw-bold mb-3 text-center">Approval Process</h6>
                
                <div className="mb-3 d-flex">
                  <div className="me-3">
                    <div className="step-circle" style={{ 
                      width: '28px',
                      height: '28px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>1</div>
                  </div>
                  <div>
                    <p className="mb-0">Select an item from the list to review the details.</p>
                  </div>
                </div>
                
                <div className="mb-3 d-flex">
                  <div className="me-3">
                    <div className="step-circle" style={{ 
                      width: '28px',
                      height: '28px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>2</div>
                  </div>
                  <div>
                    <p className="mb-0">Review all information and supporting documents.</p>
                  </div>
                </div>
                
                <div className="mb-3 d-flex">
                  <div className="me-3">
                    <div className="step-circle" style={{ 
                      width: '28px',
                      height: '28px',
                      backgroundColor: colors.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>3</div>
                  </div>
                  <div>
                    <p className="mb-0">Approve or reject the request based on your review.</p>
                  </div>
                </div>
                
                <div className="alert mt-4" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(colors.quaternary)}, 0.1)`,
                  borderLeft: `3px solid ${colors.quaternary}`,
                  borderRadius: '4px'
                }}>
                  <div className="d-flex">
                    <div className="me-2">
                      <i className="bi bi-info-circle-fill" style={{ color: colors.quaternary }}></i>
                    </div>
                    <div>
                      <small className="text-muted">All approval actions are logged in the system and cannot be reversed.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetApproval;
