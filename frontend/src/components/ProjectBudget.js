import React, { useState, useEffect } from 'react';
import BudgetSummary from './budget/BudgetSummary';
import ExpenseTracker from './budget/ExpenseTracker';
import BudgetApproval from './budget/BudgetApproval';
import FinancialReports from './budget/FinancialReports';

function ProjectBudget({ 
  project, 
  onUpdateProject, 
  onAddExpense, 
  onApproveExpense, 
  onRejectExpense, 
  onApproveBudgetChange,
  purpleColors 
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const [expenseFilters, setExpenseFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  // Function to handle adding an expense with database integration
  const handleAddExpense = async (expenseData) => {
    try {
      // Call the parent component's handler which will update the database
      const newExpense = await onAddExpense(expenseData);
      
      // No need to manually update the state as the parent component will do it
      return newExpense;
    } catch (error) {
      console.error('Error in handleAddExpense:', error);
      alert('Failed to add expense. Please try again.');
      throw error;
    }
  };

  // Function to handle approving an expense with database integration
  const handleApproveExpense = async (expenseId) => {
    try {
      // Call the parent component's handler which will update the database
      await onApproveExpense(expenseId);
    } catch (error) {
      console.error('Error in handleApproveExpense:', error);
      alert('Failed to approve expense. Please try again.');
    }
  };

  // Function to handle rejecting an expense with database integration
  const handleRejectExpense = async (expenseId) => {
    try {
      // Call the parent component's handler which will update the database
      await onRejectExpense(expenseId);
    } catch (error) {
      console.error('Error in handleRejectExpense:', error);
      alert('Failed to reject expense. Please try again.');
    }
  };

  // Function to handle approving a budget change with database integration
  const handleApproveBudgetChange = async (budgetChangeId) => {
    try {
      // Call the parent component's handler which will update the database
      await onApproveBudgetChange(budgetChangeId);
    } catch (error) {
      console.error('Error in handleApproveBudgetChange:', error);
      alert('Failed to approve budget change. Please try again.');
    }
  };

  return (
    <div className="project-budget">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
            style={activeTab === 'summary' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-pie-chart me-1"></i> Summary
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
            style={activeTab === 'expenses' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-receipt me-1"></i> Expenses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
            style={activeTab === 'approvals' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-check-square me-1"></i> Approvals
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
            style={activeTab === 'reports' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports
          </button>
        </li>
      </ul>
      
      {activeTab === 'summary' && (
        <BudgetSummary 
          budget={project.budget}
          currency={project.budget.currency}
          purpleColors={purpleColors}
          onShowDetails={() => setActiveTab('expenses')}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpenseTracker 
          budget={project.budget}
          currency={project.budget.currency}
          onAddExpense={handleAddExpense}
          onFiltersChange={setExpenseFilters}
          purpleColors={purpleColors}
        />
      )}

      {activeTab === 'approvals' && (
        <BudgetApproval 
          budget={project.budget}
          currency={project.budget.currency}
          onApproveExpense={handleApproveExpense}
          onRejectExpense={handleRejectExpense}
          onApproveBudgetChange={handleApproveBudgetChange}
          purpleColors={purpleColors}
        />
      )}

      {activeTab === 'reports' && (
        <FinancialReports 
          project={project}
          purpleColors={purpleColors}
        />
      )}
    </div>
  );
}

export default ProjectBudget;
