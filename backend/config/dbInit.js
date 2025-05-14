const db = require('./dbConfig');

// Function to initialize database
const initDatabase = () => {
  console.log('Initializing database schema...');
  
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err.message);
        return reject(err);
      }
      
      // Create projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'Not Started',
          start_date TEXT,
          end_date TEXT,
          budget_estimated REAL DEFAULT 0,
          budget_actual REAL DEFAULT 0,
          budget_currency TEXT DEFAULT 'BHD',
          completion INTEGER DEFAULT 0,
          objectives TEXT,
          scope TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating projects table:', err.message);
          return reject(err);
        }
        console.log('Projects table initialized');
        
        // Create milestones table
        db.run(`
          CREATE TABLE IF NOT EXISTS milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'Not Started',
            start_date TEXT,
            end_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) {
            console.error('Error creating milestones table:', err.message);
            return reject(err);
          }
          console.log('Milestones table initialized');
          
          // Create tasks table
          db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              project_id INTEGER NOT NULL,
              milestone_id INTEGER,
              name TEXT NOT NULL,
              description TEXT,
              status TEXT DEFAULT 'Not Started',
              priority TEXT DEFAULT 'Medium',
              start_date TEXT,
              due_date TEXT,
              progress INTEGER DEFAULT 0,
              assigned_to INTEGER,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
              FOREIGN KEY (milestone_id) REFERENCES milestones (id) ON DELETE SET NULL
            )
          `, (err) => {
            if (err) {
              console.error('Error creating tasks table:', err.message);
              return reject(err);
            }
            console.log('Tasks table initialized');
            
            // Create users table
            db.run(`
              CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                role TEXT,
                department TEXT,
                avatar TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )
            `, (err) => {
              if (err) {
                console.error('Error creating users table:', err.message);
                return reject(err);
              }
              console.log('Users table initialized');
              
              // Create project_team table
              db.run(`
                CREATE TABLE IF NOT EXISTS project_team (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  project_id INTEGER NOT NULL,
                  user_id INTEGER NOT NULL,
                  role TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
                  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
              `, (err) => {
                if (err) {
                  console.error('Error creating project_team table:', err.message);
                  return reject(err);
                }
                console.log('Project_team table initialized');
                
                // Create expenses table
                db.run(`
                  CREATE TABLE IF NOT EXISTS expenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER NOT NULL,
                    category TEXT,
                    amount REAL NOT NULL,
                    date TEXT,
                    description TEXT,
                    status TEXT DEFAULT 'Pending',
                    requested_by TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                  )
                `, (err) => {
                  if (err) {
                    console.error('Error creating expenses table:', err.message);
                    return reject(err);
                  }
                  console.log('Expenses table initialized');
                  
                  // Create budget_changes table
                  db.run(`
                    CREATE TABLE IF NOT EXISTS budget_changes (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      project_id INTEGER NOT NULL,
                      amount REAL NOT NULL,
                      date TEXT,
                      description TEXT,
                      status TEXT DEFAULT 'Pending',
                      requested_by TEXT,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                    )
                  `, (err) => {
                    if (err) {
                      console.error('Error creating budget_changes table:', err.message);
                      return reject(err);
                    }
                    console.log('Budget_changes table initialized');
                    
                    // Insert at least one default user if none exists
                    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                      if (err) {
                        console.error('Error checking users count:', err.message);
                        return reject(err);
                      }
                      
                      if (row.count === 0) {
                        db.run(`
                          INSERT INTO users (name, role, department, avatar) 
                          VALUES ('Mohammad', 'Project Manager', 'Management', 'https://via.placeholder.com/40')
                        `, (err) => {
                          if (err) {
                            console.error('Error inserting default user:', err.message);
                            return reject(err);
                          }
                          console.log('Default user inserted');
                          resolve();
                        });
                      } else {
                        resolve();
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

module.exports = { initDatabase };
