const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { initDatabase } = require('../config/dbInit');

// Database path
const dbDir = path.resolve(__dirname, '../db');
const dbPath = path.resolve(dbDir, 'pms_database.sqlite');

// Check if database file exists
if (fs.existsSync(dbPath)) {
  console.log('Removing existing database file...');
  fs.unlinkSync(dbPath);
  console.log('Database file removed.');
}

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to new SQLite database');
  
  // Initialize the database
  initDatabase()
    .then(() => {
      console.log('Database initialized with fresh tables');
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to initialize database:', err);
      process.exit(1);
    });
});
