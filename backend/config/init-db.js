const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the db directory exists
const dbDir = path.resolve(__dirname, '../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Database path
const dbPath = path.resolve(dbDir, 'pms_database.sqlite');

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      avatar TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, createProjects);
  
  // Create projects table
  function createProjects(err) {
    if (err) {
      console.error('Error creating users table:', err.message);
      return;
    }
    console.log('Users table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        budget_estimated REAL DEFAULT 0,
        budget_actual REAL DEFAULT 0,
        budget_currency TEXT DEFAULT 'BHD',
        completion REAL DEFAULT 0,
        objectives TEXT,
        scope TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, createMilestones);
  }
  
  // Create milestones table
  function createMilestones(err) {
    if (err) {
      console.error('Error creating projects table:', err.message);
      return;
    }
    console.log('Projects table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `, createTasks);
  }
  
  // Create tasks table
  function createTasks(err) {
    if (err) {
      console.error('Error creating milestones table:', err.message);
      return;
    }
    console.log('Milestones table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        milestone_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        priority TEXT,
        start_date TEXT,
        due_date TEXT,
        progress REAL DEFAULT 0,
        assigned_to INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (milestone_id) REFERENCES milestones (id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createTaskDependencies);
  }
  
  // Create task dependencies table
  function createTaskDependencies(err) {
    if (err) {
      console.error('Error creating tasks table:', err.message);
      return;
    }
    console.log('Tasks table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS task_dependencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        depends_on_task_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (depends_on_task_id) REFERENCES tasks (id) ON DELETE CASCADE
      )
    `, createProjectTeam);
  }
  
  // Create project team table
  function createProjectTeam(err) {
    if (err) {
      console.error('Error creating task_dependencies table:', err.message);
      return;
    }
    console.log('Task Dependencies table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS project_team (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `, createExpenses);
  }
  
  // Create expenses table
  function createExpenses(err) {
    if (err) {
      console.error('Error creating project_team table:', err.message);
      return;
    }
    console.log('Project Team table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        requested_by TEXT,
        approved_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createBudgetChanges);
  }
  
  // Create budget changes table
  function createBudgetChanges(err) {
    if (err) {
      console.error('Error creating expenses table:', err.message);
      return;
    }
    console.log('Expenses table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS budget_changes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        requested_by TEXT,
        approved_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createDocuments);
  }
  
  // Create documents table
  function createDocuments(err) {
    if (err) {
      console.error('Error creating budget_changes table:', err.message);
      return;
    }
    console.log('Budget Changes table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        status TEXT NOT NULL,
        version TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        uploaded_by INTEGER,
        approved_by INTEGER,
        approval_date TEXT,
        upload_date TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createDocumentTags);
  }
  
  // Create document tags table
  function createDocumentTags(err) {
    if (err) {
      console.error('Error creating documents table:', err.message);
      return;
    }
    console.log('Documents table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS document_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        tag TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
      )
    `, createDocumentVersions);
  }
  
  // Create document versions table
  function createDocumentVersions(err) {
    if (err) {
      console.error('Error creating document_tags table:', err.message);
      return;
    }
    console.log('Document Tags table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS document_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        version TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        uploaded_by INTEGER,
        upload_date TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createRisks);
  }
  
  // Create risks table
  function createRisks(err) {
    if (err) {
      console.error('Error creating document_versions table:', err.message);
      return;
    }
    console.log('Document Versions table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS risks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        probability INTEGER NOT NULL, 
        impact INTEGER NOT NULL,
        risk_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        identified_date TEXT,
        owner_id INTEGER,
        mitigation_plan TEXT,
        contingency_plan TEXT,
        review_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createRiskTriggers);
  }
  
  // Create risk triggers table
  function createRiskTriggers(err) {
    if (err) {
      console.error('Error creating risks table:', err.message);
      return;
    }
    console.log('Risks table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS risk_triggers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        risk_id INTEGER NOT NULL,
        trigger_description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (risk_id) REFERENCES risks (id) ON DELETE CASCADE
      )
    `, createStakeholders);
  }
  
  // Create stakeholders table
  function createStakeholders(err) {
    if (err) {
      console.error('Error creating risk_triggers table:', err.message);
      return;
    }
    console.log('Risk Triggers table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS stakeholders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        name TEXT NOT NULL,
        position TEXT,
        organization TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        influence INTEGER,
        interest INTEGER,
        engagement_level TEXT,
        communication_frequency TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `, createResources);
  }
  
  // Create resources table
  function createResources(err) {
    if (err) {
      console.error('Error creating stakeholders table:', err.message);
      return;
    }
    console.log('Stakeholders table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        cost_rate REAL,
        weekly_capacity INTEGER,
        utilization_target INTEGER,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, createResourceSkills);
  }
  
  // Create resource skills table
  function createResourceSkills(err) {
    if (err) {
      console.error('Error creating resources table:', err.message);
      return;
    }
    console.log('Resources table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS resource_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resource_id INTEGER NOT NULL,
        skill TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE
      )
    `, createResourceAssignments);
  }
  
  // Create resource assignments table
  function createResourceAssignments(err) {
    if (err) {
      console.error('Error creating resource_skills table:', err.message);
      return;
    }
    console.log('Resource Skills table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS resource_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        task_id INTEGER,
        resource_id INTEGER NOT NULL,
        hours INTEGER NOT NULL,
        start_date TEXT,
        end_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE
      )
    `, createTaskFiles);
  }
  
  // Create task files table
  function createTaskFiles(err) {
    if (err) {
      console.error('Error creating resource_assignments table:', err.message);
      return;
    }
    console.log('Resource Assignments table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS task_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        uploaded_by INTEGER,
        upload_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL
      )
    `, createNotifications);
  }
  
  // Create notifications table
  function createNotifications(err) {
    if (err) {
      console.error('Error creating task_files table:', err.message);
      return;
    }
    console.log('Task Files table created successfully');
    
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        related_id INTEGER,
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `, insertSampleData);
  }
  
  // Insert sample data
  function insertSampleData(err) {
    if (err) {
      console.error('Error creating notifications table:', err.message);
      return;
    }
    console.log('Notifications table created successfully');
    console.log('All tables created successfully!');
    
    // Insert sample users
    db.run(`
      INSERT INTO users (name, email, role, department, avatar) VALUES 
      ('Mohammad', 'mohammad@example.com', 'Project Manager', 'Management', 'https://via.placeholder.com/40'),
      ('Ali', 'ali@example.com', 'Design Engineer', 'Design', 'https://via.placeholder.com/40'),
      ('Ahmed', 'ahmed@example.com', 'Backend Developer', 'Development', 'https://via.placeholder.com/40'),
      ('Abdulla', 'abdulla@example.com', 'Test Engineer', 'QA', 'https://via.placeholder.com/40')
    `, function(err) {
      if (err) {
        console.error('Error inserting sample users:', err.message);
      } else {
        console.log('Sample users inserted successfully');
        
        // Insert sample project
        db.run(`
          INSERT INTO projects (title, description, status, start_date, end_date, budget_estimated, budget_currency) 
          VALUES ('Municipal Infrastructure Development Project', 'Development of municipal infrastructure including roads, parks, and public facilities.', 'In Progress', '2023-06-01', '2024-09-15', 5000000, 'BHD')
        `, function(err) {
          if (err) {
            console.error('Error inserting sample project:', err.message);
          } else {
            const projectId = this.lastID;
            console.log('Sample project inserted successfully with ID:', projectId);
            
            // Insert milestones
            const milestones = [
              ['Stage 1 - Studies', 'Completed', '2023-06-01', '2023-06-30'],
              ['Stage 2 - Initial Design', 'Completed', '2023-07-01', '2023-08-15'],
              ['Stage 3 - Detailed Design', 'Completed', '2023-08-16', '2023-10-15'],
              ['Stage 4 - Tender Document', 'Completed', '2023-10-16', '2023-11-15'],
              ['Stage 5 - Tendering & Award', 'In Progress', '2023-11-16', '2024-01-15'],
              ['Stage 6 - Execution', 'Not Started', '2024-01-16', '2024-05-15'],
              ['Stage 7 - Maintenance & Defects Liability', 'Not Started', '2024-05-16', '2024-08-15'],
              ['Stage 8 - Contract Adjustments', 'Not Started', '2024-08-16', '2024-09-15']
            ];
            
            const stmt = db.prepare(`
              INSERT INTO milestones (project_id, name, status, start_date, end_date)
              VALUES (?, ?, ?, ?, ?)
            `);
            
            milestones.forEach(milestone => {
              stmt.run(projectId, ...milestone, function(err) {
                if (err) {
                  console.error('Error inserting milestone:', err.message);
                }
              });
            });
            
            stmt.finalize();
            console.log('Sample milestones inserted successfully');
            
            // Continue with sample task insertion, etc.
            console.log('Sample data insertion completed');
          }
        });
      }
    });
  }
});
