const db = require('./dbConfig');

// Initialize database tables
function initDb() {
  console.log('Initializing database schema...');
  
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
  `);
  
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
  `);
  
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
      FOREIGN KEY (milestone_id) REFERENCES milestones (id) ON DELETE CASCADE
    )
  `);
  
  // Create task_dependencies table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_dependencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      depends_on_task_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (depends_on_task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      password TEXT,
      department TEXT,
      role TEXT,
      avatar TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
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
  `);
  
  // Create stakeholders table
  db.run(`
    CREATE TABLE IF NOT EXISTS stakeholders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      role TEXT,
      organization TEXT,
      contact_info TEXT, -- JSON string
      category TEXT,
      priority TEXT DEFAULT 'Medium',
      influence INTEGER DEFAULT 1,
      interest INTEGER DEFAULT 1,
      support_level TEXT DEFAULT 'Neutral',
      expectations TEXT, -- JSON array
      requirements TEXT, -- JSON array
      communication_preference TEXT,
      communication_frequency TEXT,
      engagement_strategy TEXT,
      notes TEXT,
      last_contact_date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    )
  `);
  
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
  `);
  
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
  `);
  
  // Create risk_register table
  db.run(`
    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      probability INTEGER,
      impact INTEGER,
      risk_score INTEGER,
      status TEXT DEFAULT 'Identified',
      owner_id INTEGER,
      owner_name TEXT,
      identified_date TEXT,
      mitigation_plan TEXT,
      contingency_plan TEXT,
      triggers TEXT, -- JSON array
      review_date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    )
  `);
  
  // Create communications table
  db.run(`
    CREATE TABLE IF NOT EXISTS communications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      stakeholder_id INTEGER,
      subject TEXT NOT NULL,
      communication_type TEXT,
      frequency TEXT,
      scheduled_date TEXT,
      deliverables TEXT, -- JSON array
      purpose TEXT,
      key_messages TEXT, -- JSON array
      recipients TEXT, -- JSON array
      status TEXT DEFAULT 'Planned',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
      FOREIGN KEY (stakeholder_id) REFERENCES stakeholders (id) ON DELETE SET NULL
    )
  `);
  
  // Create task_files table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      uploaded_by INTEGER,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL
    )
  `);
  
  console.log('Database schema initialized!');
}

module.exports = initDb;
