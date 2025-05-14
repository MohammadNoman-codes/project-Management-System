import React, { useState } from 'react';

function ExpenseTracker({ budget, currency = 'USD', onAddExpense, onFiltersChange, purpleColors }) {
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
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
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
  
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'Pending'
  });
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const categories = ['Development', 'Design', 'Testing', 'Infrastructure', 'Marketing', 'Other'];
  
  // Handle expense input change
  const handleExpenseChange = (e) => {
    const { name, value, type } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Add new expense
  const handleAddExpense = () => {
    if (!newExpense.category || newExpense.amount <= 0 || !newExpense.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    onAddExpense({
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount)
    });
    
    // Reset form
    setNewExpense({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      status: 'Pending'
    });
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange({
      category: filterCategory,
      dateRange: filterDateRange,
      status: filterStatus
    });
  };
  
  // Get filtered expenses based on current filters
  const getFilteredExpenses = () => {
    let filtered = [...(budget?.expenses || [])];
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    // Filter by date range
    if (filterDateRange !== 'all') {
      const today = new Date();
      const startDate = new Date();
      
      if (filterDateRange === 'week') {
        startDate.setDate(today.getDate() - 7);
      } else if (filterDateRange === 'month') {
        startDate.setMonth(today.getMonth() - 1);
      } else if (filterDateRange === 'quarter') {
        startDate.setMonth(today.getMonth() - 3);
      }
      
      filtered = filtered.filter(expense => new Date(expense.date) >= startDate);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(expense => expense.status === filterStatus);
    }
    
    return filtered;
  };
  
  const filteredExpenses = getFilteredExpenses();
  
  // Get status badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return colors.completed;
      case 'Rejected':
        return colors.accent2;
      default:
        return colors.tertiary;
    }
  };

  return (
    <div className="expense-tracker">
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-receipt me-2"></i>Expenses
              </h5>
              <div className="btn-group">
                <button 
                  className="btn btn-sm btn-outline-primary rounded-pill me-2"
                  onClick={() => {/* Export function */}}
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  <i className="bi bi-download me-1"></i> Export
                </button>
                <button
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  data-bs-toggle="collapse"
                  data-bs-target="#expenseFilters"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  <i className="bi bi-funnel me-1"></i> Filters
                </button>
              </div>
            </div>
            
            <div className="collapse" id="expenseFilters">
              <div className="card-body" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(colors.primary)}, 0.1)` }}>
                <div className="row g-3">
                  <div className="col-md-4 mb-2">
                    <label className="form-label">Category</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: colors.primary }}>
                        <i className="bi bi-tag"></i>
                      </span>
                      <select 
                        className="form-select" 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <label className="form-label">Date Range</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: colors.primary }}>
                        <i className="bi bi-calendar-range"></i>
                      </span>
                      <select 
                        className="form-select"
                        value={filterDateRange}
                        onChange={(e) => setFilterDateRange(e.target.value)}
                      >
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <label className="form-label">Status</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: colors.primary }}>
                        <i className="bi bi-check-circle"></i>
                      </span>
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="text-end mt-3">
                  <button 
                    className="btn btn-primary rounded-pill"
                    onClick={handleApplyFilters}
                    style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                  >
                    <i className="bi bi-search me-1"></i> Apply Filters
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
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
                              {expense.category}
                            </span>
                          </td>
                          <td>{expense.description}</td>
                          <td>
                            <span className="badge" style={{ 
                              backgroundColor: getStatusColor(expense.status), 
                              borderRadius: '12px',
                              padding: '4px 8px',
                            }}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="text-end fw-medium">{currency} {expense.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                          No expenses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold" style={{ backgroundColor: `rgba(${safeHexToRgb(colors.quinary)}, 0.2)` }}>
                      <td colSpan="4">Total</td>
                      <td className="text-end" style={{ color: colors.primary }}>
                        {currency} {filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-plus-circle me-2"></i>Add New Expense
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="expenseCategory" className="form-label">Category <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: colors.primary }}>
                    <i className="bi bi-tag"></i>
                  </span>
                  <select 
                    id="expenseCategory"
                    className="form-select"
                    name="category"
                    value={newExpense.category}
                    onChange={handleExpenseChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="expenseAmount" className="form-label">Amount <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: colors.primary }}>
                    <i className="bi bi-cash"></i>
                  </span>
                  <span className="input-group-text">{currency}</span>
                  <input 
                    type="number" 
                    id="expenseAmount"
                    className="form-control"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleExpenseChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="expenseDate" className="form-label">Date <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: colors.primary }}>
                    <i className="bi bi-calendar3"></i>
                  </span>
                  <input 
                    type="date" 
                    id="expenseDate"
                    className="form-control"
                    name="date"
                    value={newExpense.date}
                    onChange={handleExpenseChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="expenseDescription" className="form-label">Description <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: colors.primary }}>
                    <i className="bi bi-card-text"></i>
                  </span>
                  <textarea 
                    id="expenseDescription"
                    className="form-control"
                    name="description"
                    value={newExpense.description}
                    onChange={handleExpenseChange}
                    rows="2"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="d-grid">
                <button 
                  className="btn btn-primary rounded-pill" 
                  onClick={handleAddExpense}
                  disabled={!newExpense.category || newExpense.amount <= 0 || !newExpense.description}
                  style={{ 
                    backgroundColor: colors.primary, 
                    borderColor: colors.primary,
                    opacity: (!newExpense.category || newExpense.amount <= 0 || !newExpense.description) ? 0.65 : 1
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Expense
                </button>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0">
              <div className="small text-muted">
                <div className="mb-1"><i className="bi bi-info-circle me-1"></i> Required fields are marked with <span className="text-danger">*</span></div>
                <div>All expenses will be displayed in the expenses table and will contribute to the project's budget usage.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracker;
