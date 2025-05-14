const db = require('../config/dbConfig');

class Budget {
  // Get budget details by project ID
  static getByProjectId(projectId, callback) {
    // First get the project's budget information
    const projectQuery = `
      SELECT 
        budget_estimated, 
        budget_actual, 
        budget_currency
      FROM projects
      WHERE id = ?
    `;
    
    db.get(projectQuery, [projectId], (err, project) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!project) {
        return callback(null, null);
      }
      
      // Get all expenses for this project
      const expensesQuery = `
        SELECT * FROM expenses
        WHERE project_id = ?
        ORDER BY date DESC
      `;
      
      db.all(expensesQuery, [projectId], (err, expenses) => {
        if (err) {
          return callback(err, null);
        }
        
        // Get all budget changes for this project
        const budgetChangesQuery = `
          SELECT * FROM budget_changes
          WHERE project_id = ?
          ORDER BY date DESC
        `;
        
        db.all(budgetChangesQuery, [projectId], (err, budgetChanges) => {
          if (err) {
            return callback(err, null);
          }
          
          // Assemble the budget object
          const budget = {
            estimated: project.budget_estimated,
            actual: project.budget_actual,
            currency: project.budget_currency,
            expenses,
            budgetChanges
          };
          
          callback(null, budget);
        });
      });
    });
  }
  
  // Add expense
  static addExpense(expenseData, callback) {
    const {
      project_id,
      category,
      amount,
      date,
      description,
      status,
      requested_by
    } = expenseData;
    
    const query = `
      INSERT INTO expenses (
        project_id,
        category,
        amount,
        date,
        description,
        status,
        requested_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      query,
      [
        project_id,
        category,
        amount,
        date,
        description,
        status || 'Pending',
        requested_by
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // Update project's actual budget if expense is approved
        if (status === 'Approved') {
          const updateProjectQuery = `
            UPDATE projects
            SET budget_actual = budget_actual + ?
            WHERE id = ?
          `;
          
          db.run(updateProjectQuery, [amount, project_id], function(err) {
            if (err) {
              console.error('Error updating project budget:', err);
            }
          });
        }
        
        callback(null, { id: this.lastID, ...expenseData });
      }
    );
  }
  
  // Update expense
  static updateExpense(id, expenseData, callback) {
    const {
      category,
      amount,
      date,
      description,
      status,
      requested_by
    } = expenseData;
    
    // First get the original expense to check status change
    const getExpenseQuery = `
      SELECT status, amount, project_id FROM expenses
      WHERE id = ?
    `;
    
    db.get(getExpenseQuery, [id], (err, originalExpense) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!originalExpense) {
        return callback(null, null);
      }
      
      const updateQuery = `
        UPDATE expenses
        SET category = ?,
            amount = ?,
            date = ?,
            description = ?,
            status = ?,
            requested_by = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(
        updateQuery,
        [
          category,
          amount,
          date,
          description,
          status,
          requested_by,
          id
        ],
        function(err) {
          if (err) {
            return callback(err, null);
          }
          
          // Handle status change that affects project budget
          if (originalExpense.status !== status) {
            if (status === 'Approved') {
              // Add to project budget if newly approved
              const updateProjectQuery = `
                UPDATE projects
                SET budget_actual = budget_actual + ?
                WHERE id = ?
              `;
              
              db.run(updateProjectQuery, [amount, originalExpense.project_id]);
            } else if (originalExpense.status === 'Approved') {
              // Subtract from project budget if approval removed
              const updateProjectQuery = `
                UPDATE projects
                SET budget_actual = budget_actual - ?
                WHERE id = ?
              `;
              
              db.run(updateProjectQuery, [originalExpense.amount, originalExpense.project_id]);
            }
          } else if (status === 'Approved' && originalExpense.amount !== amount) {
            // Handle amount change for approved expenses
            const amountDifference = amount - originalExpense.amount;
            const updateProjectQuery = `
              UPDATE projects
              SET budget_actual = budget_actual + ?
              WHERE id = ?
            `;
            
            db.run(updateProjectQuery, [amountDifference, originalExpense.project_id]);
          }
          
          callback(null, { id, ...expenseData });
        }
      );
    });
  }
  
  // Delete expense
  static deleteExpense(id, callback) {
    // First get the expense to adjust project budget if needed
    const getExpenseQuery = `
      SELECT status, amount, project_id FROM expenses
      WHERE id = ?
    `;
    
    db.get(getExpenseQuery, [id], (err, expense) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!expense) {
        return callback(null, { id, deleted: false });
      }
      
      const deleteQuery = `DELETE FROM expenses WHERE id = ?`;
      
      db.run(deleteQuery, [id], function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // If expense was approved, subtract from project budget
        if (expense.status === 'Approved') {
          const updateProjectQuery = `
            UPDATE projects
            SET budget_actual = budget_actual - ?
            WHERE id = ?
          `;
          
          db.run(updateProjectQuery, [expense.amount, expense.project_id]);
        }
        
        callback(null, { id, deleted: this.changes > 0 });
      });
    });
  }
  
  // Update expense status
  static updateExpenseStatus(id, status, callback) {
    // First get the original expense
    const getExpenseQuery = `
      SELECT status, amount, project_id FROM expenses
      WHERE id = ?
    `;
    
    db.get(getExpenseQuery, [id], (err, expense) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!expense) {
        return callback(null, null);
      }
      
      const updateQuery = `
        UPDATE expenses
        SET status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(updateQuery, [status, id], function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // Handle status change that affects project budget
        if (expense.status !== status) {
          if (status === 'Approved') {
            // Add to project budget if newly approved
            const updateProjectQuery = `
              UPDATE projects
              SET budget_actual = budget_actual + ?
              WHERE id = ?
            `;
            
            db.run(updateProjectQuery, [expense.amount, expense.project_id]);
          } else if (expense.status === 'Approved') {
            // Subtract from project budget if approval removed
            const updateProjectQuery = `
              UPDATE projects
              SET budget_actual = budget_actual - ?
              WHERE id = ?
            `;
            
            db.run(updateProjectQuery, [expense.amount, expense.project_id]);
          }
        }
        
        callback(null, { ...expense, status });
      });
    });
  }
}

module.exports = Budget;
