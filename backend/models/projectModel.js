const db = require('../config/dbConfig');

class Project {
  // Get all projects
  static getAll(callback) {
    const query = `
      SELECT * FROM projects
      ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  
  // Get project by ID
  static getById(id, callback) {
    const query = `
      SELECT * FROM projects WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  
  // Create new project
  static create(projectData, callback) {
    const {
      title,
      description,
      status,
      start_date,
      end_date,
      budget_estimated,
      budget_actual,
      budget_currency,
      objectives,
      scope
    } = projectData;
    
    const query = `
      INSERT INTO projects (
        title, 
        description, 
        status, 
        start_date, 
        end_date, 
        budget_estimated, 
        budget_actual, 
        budget_currency, 
        objectives, 
        scope
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      query, 
      [
        title, 
        description, 
        status, 
        start_date, 
        end_date, 
        budget_estimated || 0, 
        budget_actual || 0, 
        budget_currency || 'BHD', 
        objectives, 
        scope
      ], 
      function(err) {
        if (err) {
          return callback(err, null);
        }
        callback(null, { id: this.lastID, ...projectData });
      }
    );
  }
  
  // Create new project with milestones and tasks
  static createWithDetails(projectData, milestones, callback) {
    const {
      title,
      description,
      status,
      start_date,
      end_date,
      budget_estimated,
      budget_actual,
      budget_currency,
      objectives,
      scope
    } = projectData;
    
    // Start a transaction to ensure all operations are atomic
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      // First, create the project
      const projectQuery = `
        INSERT INTO projects (
          title, 
          description, 
          status, 
          start_date, 
          end_date, 
          budget_estimated, 
          budget_actual, 
          budget_currency, 
          objectives, 
          scope
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(
        projectQuery, 
        [
          title, 
          description, 
          status, 
          start_date, 
          end_date, 
          budget_estimated || 0, 
          budget_actual || 0, 
          budget_currency || 'BHD', 
          objectives, 
          scope
        ], 
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return callback(err, null);
          }
          
          const projectId = this.lastID;
          const createdMilestones = [];
          
          // If there are no milestones, commit and return the project
          if (!milestones || milestones.length === 0) {
            db.run('COMMIT');
            return callback(null, { id: projectId, ...projectData, milestones: [] });
          }
          
          // Function to process milestones sequentially
          const processMilestones = (index) => {
            if (index >= milestones.length) {
              // All milestones processed, commit and return
              db.run('COMMIT');
              return callback(null, {
                id: projectId,
                ...projectData,
                milestones: createdMilestones
              });
            }
            
            const milestone = milestones[index];
            const tasks = milestone.tasks || [];
            
            // Create milestone
            const milestoneQuery = `
              INSERT INTO milestones (
                project_id,
                name,
                status,
                start_date,
                end_date
              ) VALUES (?, ?, ?, ?, ?)
            `;
            
            db.run(
              milestoneQuery,
              [
                projectId,
                milestone.name,
                milestone.status || 'Not Started',
                milestone.start_date,
                milestone.end_date
              ],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return callback(err, null);
                }
                
                const milestoneId = this.lastID;
                const createdTasks = [];
                
                // Add this milestone to the list
                createdMilestones.push({
                  id: milestoneId,
                  ...milestone
                });
                
                // If there are no tasks, go to the next milestone
                if (!tasks || tasks.length === 0) {
                  return processMilestones(index + 1);
                }
                
                // Function to process tasks sequentially
                const processTasks = (taskIndex) => {
                  if (taskIndex >= tasks.length) {
                    // All tasks processed, go to the next milestone
                    return processMilestones(index + 1);
                  }
                  
                  const task = tasks[taskIndex];
                  
                  // Create task
                  const taskQuery = `
                    INSERT INTO tasks (
                      project_id,
                      milestone_id,
                      name,
                      description,
                      status,
                      priority,
                      start_date,
                      due_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  `;
                  
                  db.run(
                    taskQuery,
                    [
                      projectId,
                      milestoneId,
                      task.name,
                      task.description || null,
                      task.status || 'Not Started',
                      task.priority || 'Medium',
                      task.start_date || null,
                      task.due_date || null
                    ],
                    function(err) {
                      if (err) {
                        db.run('ROLLBACK');
                        return callback(err, null);
                      }
                      
                      // Add this task to the list
                      createdTasks.push({
                        id: this.lastID,
                        ...task
                      });
                      
                      // Process the next task
                      processTasks(taskIndex + 1);
                    }
                  );
                };
                
                // Start processing tasks
                processTasks(0);
                
                // Update the milestone with tasks
                createdMilestones[createdMilestones.length - 1].tasks = createdTasks;
              }
            );
          };
          
          // Start processing milestones
          processMilestones(0);
        }
      );
    });
  }
  
  // Update project
  static update(id, projectData, callback) {
    const {
      title,
      description,
      status,
      start_date,
      end_date,
      budget_estimated,
      budget_actual,
      budget_currency,
      completion,
      objectives,
      scope
    } = projectData;
    
    const query = `
      UPDATE projects 
      SET title = ?,
          description = ?,
          status = ?,
          start_date = ?,
          end_date = ?,
          budget_estimated = ?,
          budget_actual = ?,
          budget_currency = ?,
          completion = ?,
          objectives = ?,
          scope = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(
      query, 
      [
        title, 
        description, 
        status, 
        start_date, 
        end_date, 
        budget_estimated, 
        budget_actual, 
        budget_currency, 
        completion, 
        objectives, 
        scope, 
        id
      ], 
      function(err) {
        if (err) {
          return callback(err, null);
        }
        callback(null, { id, ...projectData });
      }
    );
  }
  
  // Delete project
  static delete(id, callback) {
    const query = `DELETE FROM projects WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id, deleted: this.changes > 0 });
    });
  }
  
  // Get project with milestones and tasks
  static getWithDetails(id, callback) {
    this.getById(id, (err, project) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!project) {
        return callback(null, null);
      }
      
      // Get milestones
      const milestonesQuery = `
        SELECT * FROM milestones
        WHERE project_id = ?
        ORDER BY start_date
      `;
      
      db.all(milestonesQuery, [id], (err, milestones) => {
        if (err) {
          return callback(err, null);
        }
        
        // Get tasks
        const tasksQuery = `
          SELECT t.*, u.name as assigned_to_name, u.avatar as assigned_to_avatar
          FROM tasks t
          LEFT JOIN users u ON t.assigned_to = u.id
          WHERE t.project_id = ?
          ORDER BY t.milestone_id, t.start_date
        `;
        
        db.all(tasksQuery, [id], (err, tasks) => {
          if (err) {
            return callback(err, null);
          }
          
          // Get expenses
          const expensesQuery = `
            SELECT * FROM expenses
            WHERE project_id = ?
            ORDER BY date DESC
          `;
          
          db.all(expensesQuery, [id], (err, expenses) => {
            if (err) {
              return callback(err, null);
            }
            
            // Get team members
            const teamQuery = `
              SELECT pt.*, u.name, u.email, u.avatar, u.department
              FROM project_team pt
              JOIN users u ON pt.user_id = u.id
              WHERE pt.project_id = ?
            `;
            
            db.all(teamQuery, [id], (err, team) => {
              if (err) {
                return callback(err, null);
              }
              
              // Get budget changes
              const budgetChangesQuery = `
                SELECT * FROM budget_changes
                WHERE project_id = ?
                ORDER BY date DESC
              `;
              
              db.all(budgetChangesQuery, [id], (err, budgetChanges) => {
                if (err) {
                  return callback(err, null);
                }
                
                // Assemble the full project with details
                const projectWithDetails = {
                  ...project,
                  milestones,
                  tasks,
                  team,
                  budget: {
                    estimated: project.budget_estimated,
                    actual: project.budget_actual,
                    currency: project.budget_currency,
                    expenses,
                    budgetChanges
                  }
                };
                
                callback(null, projectWithDetails);
              });
            });
          });
        });
      });
    });
  }
  
  // Add team member to project
  static addTeamMember(projectId, teamMemberData, callback) {
    // First, check if the project exists
    db.get(`SELECT * FROM projects WHERE id = ?`, [projectId], (err, project) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!project) {
        return callback(new Error(`Project with ID ${projectId} not found`), null);
      }
      
      // Check if the user already exists in the database
      db.get(
        `SELECT id FROM users WHERE name = ? AND email = ?`,
        [teamMemberData.name, teamMemberData.email || ''],
        (err, existingUser) => {
          if (err) {
            return callback(err, null);
          }
          
          let userId;
          
          // Function to add user to project_team table
          const addToProjectTeam = (userId) => {
            const query = `
              INSERT INTO project_team (
                project_id,
                user_id,
                role
              ) VALUES (?, ?, ?)
            `;
            
            db.run(
              query,
              [
                projectId,
                userId,
                teamMemberData.role
              ],
              function(err) {
                if (err) {
                  return callback(err, null);
                }
                
                // Get the complete user data to return
                db.get(
                  `SELECT u.*, pt.role FROM users u 
                   JOIN project_team pt ON u.id = pt.user_id 
                   WHERE u.id = ? AND pt.project_id = ?`,
                  [userId, projectId],
                  (err, userData) => {
                    if (err) {
                      return callback(err, null);
                    }
                    
                    // Return the created team member with its ID
                    const teamMember = {
                      id: this.lastID, // project_team entry ID
                      name: userData.name,
                      email: userData.email,
                      role: userData.role,
                      avatar: userData.avatar || 'https://via.placeholder.com/40' // Default avatar
                    };
                    
                    callback(null, teamMember);
                  }
                );
              }
            );
          };
          
          if (existingUser) {
            // If user exists, just add them to the project_team table
            addToProjectTeam(existingUser.id);
          } else {
            // If user doesn't exist, create a new user first
            const createUserQuery = `
              INSERT INTO users (
                name,
                email,
                avatar,
                department,
                role
              ) VALUES (?, ?, ?, ?, ?)
            `;
            
            db.run(
              createUserQuery,
              [
                teamMemberData.name,
                teamMemberData.email || null,
                'https://via.placeholder.com/40', // Default avatar
                teamMemberData.department || 'General', // Default department
                teamMemberData.role || 'Team Member' // Use the role from teamMemberData or default to 'Team Member'
              ],
              function(err) {
                if (err) {
                  return callback(err, null);
                }
                
                // Get the new user ID and add to project_team
                const newUserId = this.lastID;
                addToProjectTeam(newUserId);
              }
            );
          }
        }
      );
    });
  }
  
  // Remove team member from project
  static removeTeamMember(projectId, memberId, callback) {
    // Note: In this case, memberId refers to the project_team entry ID
    const query = `
      DELETE FROM project_team 
      WHERE id = ? AND project_id = ?
    `;
    
    db.run(query, [memberId, projectId], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      callback(null, { id: memberId, deleted: this.changes > 0 });
    });
  }
}

module.exports = Project;
