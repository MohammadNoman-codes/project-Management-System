import React, { useState } from 'react';
import BudgetSummary from './BudgetSummary';
import ExpenseTracker from './ExpenseTracker';
import BudgetApproval from './BudgetApproval';
import FinancialReports from './FinancialReports';

function ProjectBudget({ project, onUpdateProject }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [expenseFilters, setExpenseFilters] = useState({
    category: 'all',
    dateRange: 'all',
    status: 'all'
  });

  // Handle adding a new expense
  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [...project.budget.expenses, newExpense];
    const totalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        actual: totalExpenses,
        expenses: updatedExpenses
      }
    };
    
    onUpdateProject(updatedProject);
  };

  // Handle approving an expense
  const handleApproveExpense = (expenseId) => {
    const updatedExpenses = project.budget.expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: 'Approved' } : expense
    );
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        expenses: updatedExpenses
      }
    };
    
    onUpdateProject(updatedProject);
  };

  // Handle rejecting an expense
  const handleRejectExpense = (expenseId) => {
    const updatedExpenses = project.budget.expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: 'Rejected' } : expense
    );
    
    // Also adjust the actual amount if we're rejecting an expense
    const rejectedExpense = project.budget.expenses.find(e => e.id === expenseId);
    let actualAdjustment = 0;
    
    if (rejectedExpense && rejectedExpense.status === 'Approved') {
      actualAdjustment = rejectedExpense.amount;
    }
    
    const updatedProject = {
      ...project,
      budget: {
        ...project.budget,
        actual: project.budget.actual - actualAdjustment,
        expenses: updatedExpenses
      }
    };
    
    onUpdateProject(updatedProject);
  };

  // Handle approving a budget change request
  const handleApproveBudgetChange = (changeId) => {
    // Implementation would depend on how budget changes are structured
    alert(`Budget change ${changeId} would be approved in a real app`);
  };

  return (
    <div className="project-budget">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="bi bi-pie-chart me-1"></i> Budget Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <i className="bi bi-cash-coin me-1"></i> Expense Tracking
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <i className="bi bi-check-circle me-1"></i> Approvals
          </button>
        </li>
        {/* <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports
          </button>
        </li> */}
      </ul>

      {activeTab === 'summary' && (
        <BudgetSummary 
          budget={project.budget}
          currency={project.budget.currency}
          onShowDetails={() => setActiveTab('expenses')}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpenseTracker 
          budget={project.budget}
          currency={project.budget.currency}
          onAddExpense={handleAddExpense}
          onFiltersChange={setExpenseFilters}
        />
      )}

      {activeTab === 'approvals' && (
        <BudgetApproval 
          budget={project.budget}
          currency={project.budget.currency}
          onApproveExpense={handleApproveExpense}
          onRejectExpense={handleRejectExpense}
          onApproveBudgetChange={handleApproveBudgetChange}
        />
      )}

      {activeTab === 'reports' && (
        <FinancialReports 
          project={project}
        />
      )}
    </div>
  );
}

export default ProjectBudget;
