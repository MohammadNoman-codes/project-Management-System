const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../db/pms_database.sqlite');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Set up foreign key constraints
db.run('PRAGMA foreign_keys = ON');

// Function to initialize triggers
const initializeTriggers = () => {
  const triggersPath = path.join(__dirname, '../db/triggers.sql');
  
  if (fs.existsSync(triggersPath)) {
    const triggerSQL = fs.readFileSync(triggersPath, 'utf8');
    
    // Execute the triggers SQL script
    db.exec(triggerSQL, (err) => {
      if (err) {
        console.error('Error initializing triggers:', err);
      } else {
        console.log('Database triggers initialized successfully');
      }
    });
  } else {
    console.warn('Triggers SQL file not found');
  }
};

// Initialize triggers
initializeTriggers();

module.exports = db;
