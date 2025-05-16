const db = require('../config/dbConfig');

class Task {
  // Get all tasks
  static getAll(projectId, callback) {
    let query = `
      SELECT t.*, u.name as assigned_to_name, u.avatar as assigned_to_avatar, m.name as milestone_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN milestones m ON t.milestone_id = m.id
    `;
    
    const params = [];
    
    if (projectId) {
      query += ` WHERE t.project_id = ?`;
      params.push(projectId);
    }
    
    query += ` ORDER BY t.due_date`;
    
    db.all(query, params, (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  
  // Get task by ID
  static getById(id, callback) {
    const query = `
    SELECT t.*, u.name AS assigned_to_name, u.avatar AS assigned_to_avatar, m.name AS milestone_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN milestones m ON t.milestone_id = m.id
    WHERE t.project_id = ?
  `;

  db.all(query, [id], (err, rows) => {
    if (err) return callback(err);
    if (!rows.length) return callback(null, []);

    // For each task, fetch its dependencies and files
    const tasksWithDetails = [];
    let pending = rows.length;
    rows.forEach(row => {
      // Fetch dependencies
      db.all(
        `SELECT td.depends_on_task_id FROM task_dependencies td WHERE td.task_id = ?`,
        [row.id],
        (err, deps) => {
          if (err) return callback(err);

          // Fetch files
          db.all(
            `SELECT * FROM task_files WHERE task_id = ?`,
            [row.id],
            (err, files) => {
              if (err) return callback(err);

              tasksWithDetails.push({
                ...row,
                dependencies: deps.map(d => d.depends_on_task_id),
                files
              });

              if (--pending === 0) {
                callback(null, tasksWithDetails);
              }
            }
          );
        }
      );
    });
  });
  }

  // Get a single task by ID with all details
  static getTasksByID(id, callback) {
    const query = `
      SELECT t.*, u.name AS assigned_to_name, u.avatar AS assigned_to_avatar, m.name AS milestone_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN milestones m ON t.milestone_id = m.id
      WHERE t.id = ?
    `;
    
    db.get(query, [id], (err, task) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!task) {
        return callback(null, null);
      }
      
      // Get task dependencies
      db.all(
        `SELECT depends_on_task_id FROM task_dependencies WHERE task_id = ?`,
        [id],
        (err, dependencies) => {
          if (err) {
            return callback(err, null);
          }
          
          // Get task files
          db.all(
            `SELECT * FROM task_files WHERE task_id = ?`,
            [id],
            (err, files) => {
              if (err) {
                return callback(err, null);
              }
              
              // Return complete task data
              const taskWithDetails = {
                ...task,
                dependencies: dependencies ? dependencies.map(d => d.depends_on_task_id) : [],
                files: files || []
              };
              
              callback(null, taskWithDetails);
            }
          );
        }
      );
    });
  }
  
  // Create new task
  static create(taskData, callback) {
    const {
      project_id,
      milestone_id,
      name,
      description,
      status,
      priority,
      start_date,
      due_date,
      progress,
      assigned_to,
      dependencies
    } = taskData;
    
    const query = `
      INSERT INTO tasks (
        project_id, 
        milestone_id,
        name,
        description,
        status,
        priority,
        start_date,
        due_date,
        progress,
        assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      query, 
      [
        project_id, 
        milestone_id,
        name,
        description,
        status,
        priority,
        start_date,
        due_date,
        progress || 0,
        assigned_to
      ], 
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        const taskId = this.lastID;
        
        // If there are dependencies, add them
        if (dependencies && dependencies.length > 0) {
          const depsStmt = db.prepare(`
            INSERT INTO task_dependencies (task_id, depends_on_task_id)
            VALUES (?, ?)
          `);
          
          dependencies.forEach(depId => {
            depsStmt.run(taskId, depId, (err) => {
              if (err) {
                console.error('Error adding dependency:', err.message);
              }
            });
          });
          
          depsStmt.finalize();
        }
        
        callback(null, { id: taskId, ...taskData });
      }
    );
  }
  
  // Update task
  static update(id, taskData, callback) {
    const {
      milestone_id,
      name,
      description,
      status,
      priority,
      start_date,
      due_date,
      progress,
      assigned_to,
      dependencies
    } = taskData;
    
    const query = `
      UPDATE tasks 
      SET milestone_id = ?,
          name = ?,
          description = ?,
          status = ?,
          priority = ?,
          start_date = ?,
          due_date = ?,
          progress = ?,
          assigned_to = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(
      query, 
      [
        milestone_id,
        name,
        description,
        status,
        priority,
        start_date,
        due_date,
        progress,
        assigned_to,
        id
      ], 
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // If there are dependencies, update them
        if (dependencies) {
          // First, delete existing dependencies
          db.run(`DELETE FROM task_dependencies WHERE task_id = ?`, [id], (err) => {
            if (err) {
              console.error('Error deleting existing dependencies:', err.message);
            }
            
            // Then add new ones
            if (dependencies.length > 0) {
              const depsStmt = db.prepare(`
                INSERT INTO task_dependencies (task_id, depends_on_task_id)
                VALUES (?, ?)
              `);
              
              dependencies.forEach(depId => {
                depsStmt.run(id, depId, (err) => {
                  if (err) {
                    console.error('Error adding dependency:', err.message);
                  }
                });
              });
              
              depsStmt.finalize();
            }
          });
        }
        
        callback(null, { id, ...taskData });
      }
    );
  }
  
  // Update task status only
  static updateStatus(id, status, callback) {
    console.log(`Updating status for task ID: ${id} to ${status}`);
    
    const query = `
      UPDATE tasks 
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(query, [status, id], function(err) {
      if (err) {
        console.error(`Error updating task status: ${err.message}`);
        return callback(err, null);
      }
      
      if (this.changes === 0) {
        return callback(new Error(`Task with ID ${id} not found`), null);
      }
      
      // Get the updated task to return
      Task.getTasksByID(id, (err, updatedTask) => {
        if (err) {
          return callback(err, null);
        }
        
        callback(null, updatedTask);
      });
    });
  }

  // Delete task
  static delete(id, callback) {
    const query = `DELETE FROM tasks WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id, deleted: this.changes > 0 });
    });
  }
}

module.exports = Task;
