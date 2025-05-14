const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./config/dbInit');

// Import routes
const apiRoutes = require('./routes/api');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api', apiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes); // Add this line

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MUN Project Management System API' });
});

// Initialize the database before starting the server
initDatabase()
  .then(() => {
    // Start the server after database initialization
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
