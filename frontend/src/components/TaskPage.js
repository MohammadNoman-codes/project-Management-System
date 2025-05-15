import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import taskService from '../services/taskService';
import projectService from '../services/projectService';

function TaskPage() {
  // Purple-themed color palette for styling to match Dashboard
  const purpleColors = {
    // Primary purple shades
    primary: '#6a4c93',      // Deep purple
    secondary: '#8363ac',    // Medium purple
    tertiary: '#9d80c3',     // Light purple
    quaternary: '#b39ddb',   // Lavender
    quinary: '#d1c4e9',      // Very light purple
    
    // Complementary colors
    accent1: '#4d4398',      // Blue-purple
    accent2: '#7e57c2',      // Brighter purple
    accent3: '#5e35b1',      // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
  };
  
  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };

   const { id, taskId } = useParams();
   console.log('Task ID from URL:', taskId);
  const history = useHistory();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('create');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [processingAction, setProcessingAction] = useState(false);
  const [newTaskFormData, setNewTaskFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Not Started',
    milestone_id: '',
    priority: 'Medium',
    assigned_to: ''
  });

  // Function to get appropriate status color using the purple palette
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return purpleColors.completed;
      case 'In Progress': return purpleColors.inProgress;
      case 'Review': return purpleColors.review;
      case 'To Do': 
      case 'Not Started': return purpleColors.todo;
      default: return purpleColors.quaternary;
    }
  };

  // Function to get appropriate priority color using the purple palette
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return purpleColors.primary;
      case 'High': return purpleColors.accent2;
      case 'Medium': return purpleColors.tertiary;
      case 'Low': return purpleColors.quaternary;
      default: return purpleColors.quaternary;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let projectData;
        // If no project ID from params but URL is in format /tasks/[id]
        if (id) {
          try {
            console.log(`Fetching project details for ID: ${id}`);
            // Get comprehensive project details with milestones and team
            const projectDetails = await projectService.getProjectWithDetails(id);
            console.log('Project details received:', projectDetails);
            setProject(projectDetails);
            setMilestones(projectDetails.milestones || []);
            setProjectMembers(projectDetails.team || []);
          } catch (err) {
            console.error('Error fetching project details:', err);
            setError(`Failed to load project details: ${err.message || 'Unknown error'}`);
          }
        }
        
        // Get tasks
        try {
          console.log(`Fetching tasks for project ID: ${id}`);
          // Use taskService instead of direct fetch
          const tasksData = await taskService.getAllTasks(id);
          console.log('Tasks data received:', tasksData);
          
          if (!Array.isArray(tasksData)) {
            console.error('Expected tasks array but received:', tasksData);
            throw new Error('Invalid tasks data received from API');
          }
          
          // Process tasks to ensure consistent ID handling
          const processedTasks = tasksData.map(task => {
            // Ensure task.id is always a string for consistent comparison
            const taskId = String(task.id);
            
            return {
              ...task,
              id: taskId,
              // Ensure milestone information is present
              milestone: task.milestone || milestones.find(m => m.id === task.milestone_id)?.name || 'Unknown',
              // Ensure assignedTo is an object
              assignedTo: task.assigned_to ? {
                id: task.assigned_to,
                name: task.assigned_to_name || 'Unknown User',
                avatar: task.assigned_to_avatar
              } : { name: 'Unassigned' }
            };
          });
          
          setTasks(processedTasks);
        } catch (err) {
          console.error('Error fetching tasks:', err);
          setError(`Failed to load tasks: ${err.message || 'Unknown error'}`);
          setTasks([]);
        }
        
        // If taskId is provided, fetch and select that task
        if (taskId) {
          try {
            console.log(`Fetching specific task ID: ${taskId}`);
            const task = await taskService.getTaskById(taskId);
            console.log('Specific task data received:', task);
            
            if (task) {
              setSelectedTask({
                ...task,
                id: String(task.id) // Ensure ID is a string
              });
              setTaskModalMode('edit');
              setShowTaskModal(true);
            }
          } catch (err) {
            console.error('Error fetching specific task:', err);
            // Don't set error here, as we want to show the task list even if one task fails
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in main fetch data function:', error);
        setError(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, taskId]);

  const handleCreateTask = () => {
    // Reset form data for new task
    setNewTaskFormData({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'Not Started',
      milestone_id: milestones.length > 0 ? milestones[0].id : '',
      priority: 'Medium',
      assigned_to: ''
    });
    
    setSelectedTask(null);
    setTaskModalMode('create');
    setShowTaskModal(true);
  };
  
  const handleEditTask = (task) => {
    // Format task data for the form
    setNewTaskFormData({
      name: task.name,
      description: task.description || '',
      startDate: task.startDate || task.start_date || new Date().toISOString().split('T')[0],
      dueDate: task.dueDate || task.due_date || '',
      status: task.status || 'Not Started',
      milestone_id: task.milestone_id || '',
      priority: task.priority || 'Medium',
      assigned_to: task.assigned_to || task.assignedTo?.id || ''
    });
    
    setSelectedTask(task);
    setTaskModalMode('edit');
    setShowTaskModal(true);
  };
  
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setNewTaskFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setProcessingAction(true);
      
      // Prepare task data for API
      const taskData = {
        name: newTaskFormData.name,
        description: newTaskFormData.description,
        start_date: newTaskFormData.startDate,
        due_date: newTaskFormData.dueDate,
        status: newTaskFormData.status,
        milestone_id: newTaskFormData.milestone_id,
        priority: newTaskFormData.priority,
        assigned_to: newTaskFormData.assigned_to || null
      };
      
      // For consistency across the app, ensure IDs are strings
      let updatedTask;
      
      if (taskModalMode === 'create') {
        // Add project_id for new tasks
        taskData.project_id = id;
        
        // Create new task
        updatedTask = await taskService.createTask(taskData);
      } else {
        // Update existing task
        updatedTask = await taskService.updateTask(selectedTask.id, taskData);
      }
      
      // Process the returned task to ensure consistent format
      const processedTask = {
        ...updatedTask,
        id: String(updatedTask.id), // Ensure ID is a string
        // Add any missing fields
        milestone: milestones.find(m => m.id === updatedTask.milestone_id)?.name || 'Unknown',
        assignedTo: updatedTask.assigned_to ? {
          id: updatedTask.assigned_to,
          name: projectMembers.find(m => m.id === updatedTask.assigned_to)?.name || 'Unknown User'
        } : { name: 'Unassigned' }
      };
      
      // Update tasks list
      if (taskModalMode === 'create') {
        setTasks(prev => [...prev, processedTask]);
      } else {
        setTasks(prev => prev.map(task => 
          String(task.id) === String(processedTask.id) ? processedTask : task
        ));
      }
      
      setShowTaskModal(false);
      setProcessingAction(false);
      
      // Show success message
      alert(`Task successfully ${taskModalMode === 'create' ? 'created' : 'updated'}`);
    } catch (error) {
      console.error('Error saving task:', error);
      alert(`Error ${taskModalMode === 'create' ? 'creating' : 'updating'} task. Please try again.`);
      setProcessingAction(false);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setProcessingAction(true);
        
        // Call API to delete task
        await taskService.deleteTask(taskId);
        
        // Update tasks list
        setTasks(prev => prev.filter(task => String(task.id) !== String(taskId)));
        
        setProcessingAction(false);
        
        // Show success message
        alert('Task successfully deleted');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
        setProcessingAction(false);
      }
    }
  };
  
  const handleFileChange = (event) => {
    // Handle file selection
    console.log('File selected:', event.target.files[0]);
  };
  
  const handleUploadFile = (taskId) => {
    setSelectedTaskId(String(taskId)); // Ensure ID is a string
    setShowFileModal(true);
  };
  
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('file-input');
    if (!fileInput.files[0]) {
      alert('Please select a file to upload');
      return;
    }
    
    try {
      setProcessingAction(true);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      
      // Call API to upload file
      await taskService.uploadTaskFile(selectedTaskId, formData);
      
      // Refresh task data to get updated files
      const updatedTask = await taskService.getTaskById(selectedTaskId);
      
      // Update tasks list with new file information
      setTasks(prev => prev.map(task => 
        String(task.id) === String(selectedTaskId) ? {
          ...task,
          files: updatedTask.files
        } : task
      ));
      
      setShowFileModal(false);
      setProcessingAction(false);
      
      // Show success message
      alert('File successfully uploaded');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger mt-3"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="task-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            {id ? `Tasks for ${project.title}` : 'All Tasks'}
            {taskId && ' > Task Details'}
          </h2>
          {id && project && (
            <p className="text-muted">{project.description}</p>
          )}
        </div>
        <div>
          <Link 
            to={id ? `/projects/${id}` : '/projects'} 
            className="btn btn-outline-primary rounded-pill me-2"
            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Project
          </Link>
          <button 
            className="btn btn-primary rounded-pill" 
            onClick={handleCreateTask}
            style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
            disabled={processingAction}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Task
          </button>
        </div>
      </div>
      
      <div className="dashboard-card">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
                style={activeTab === 'list' ? {
                  borderBottomColor: purpleColors.primary,
                  color: purpleColors.primary,
                  fontWeight: '500'
                } : {}}
              >
                <i className="bi bi-list-task me-1"></i> Task List
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'kanban' ? 'active' : ''}`}
                onClick={() => setActiveTab('kanban')}
                style={activeTab === 'kanban' ? {
                  borderBottomColor: purpleColors.primary,
                  color: purpleColors.primary,
                  fontWeight: '500'
                } : {}}
              >
                <i className="bi bi-kanban me-1"></i> Kanban
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'list' && (
            <div className="table-responsive">
              <table className="table table-hover dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Milestone</th>
                    <th>Due Date</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: "150px" }}>
                          {task.milestone}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-event me-1" style={{ color: purpleColors.tertiary }}></i>
                          {task.dueDate || task.due_date}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                            color: purpleColors.primary,
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {task.assignedTo && task.assignedTo.name ? task.assignedTo.name.charAt(0) : 'U'}
                          </div>
                          <span>{task.assignedTo && task.assignedTo.name ? task.assignedTo.name : 'Unassigned'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary rounded-start"
                            onClick={() => handleEditTask(task)}
                            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                            disabled={processingAction}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={processingAction}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary rounded-end" 
                            onClick={() => handleUploadFile(task.id)}
                            disabled={processingAction}
                          >
                            <i className="bi bi-file-earmark-arrow-up"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'kanban' && (
            <div className="kanban-view">
              <div className="row g-4">
                {['Not Started', 'In Progress', 'Review', 'Completed'].map(status => (
                  <div key={status} className="col-md-3">
                    <div className="dashboard-card">
                      <div className="card-header" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(getStatusColor(status))}, 0.1)` 
                      }}>
                        <h6 className="mb-0" style={{ color: getStatusColor(status) }}>
                          <i className={`bi ${
                            status === 'Completed' ? 'bi-check-circle' : 
                            status === 'In Progress' ? 'bi-arrow-repeat' : 
                            status === 'Review' ? 'bi-eye' : 'bi-list-check'
                          } me-2`}></i>
                          {status} ({tasks.filter(task => task.status === status).length})
                        </h6>
                      </div>
                      <div className="card-body">
                        {tasks.filter(task => task.status === status).map(task => (
                          <div 
                            key={task.id} 
                            className="card mb-3" 
                            style={{ borderLeft: `4px solid ${getStatusColor(task.status)}` }}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title mb-0">{task.name}</h6>
                                <span className="badge" style={{ backgroundColor: getPriorityColor(task.priority), fontSize: '0.65rem' }}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-muted small mb-2">
                                <i className="bi bi-flag me-1"></i> {task.milestone}
                              </p>
                              <p className="text-muted small mb-2">
                                <i className="bi bi-calendar-event me-1"></i> Due: {task.dueDate || task.due_date}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="avatar-circle me-2" style={{ 
                                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                                    color: purpleColors.primary,
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem'
                                  }}>
                                    {task.assignedTo && task.assignedTo.name ? task.assignedTo.name.charAt(0) : 'U'}
                                  </div>
                                  <small className="text-muted">{task.assignedTo && task.assignedTo.name ? task.assignedTo.name : 'Unassigned'}</small>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-primary rounded-pill"
                                  onClick={() => handleEditTask(task)}
                                  style={{ borderColor: purpleColors.primary, color: purpleColors.primary, fontSize: '0.7rem' }}
                                  disabled={processingAction}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {tasks.filter(task => task.status === status).length === 0 && (
                          <div className="text-center p-3">
                            <p className="text-muted small">No tasks in this status</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tasks.length === 0 && (
            <div className="text-center my-5">
              <div className="empty-state py-4">
                <i className="bi bi-clipboard-plus fs-1" style={{ color: purpleColors.primary }}></i>
                <p className="text-muted mt-3 mb-4">No tasks found for this project</p>
                <button 
                  className="btn btn-primary rounded-pill"
                  onClick={handleCreateTask}
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                  disabled={processingAction}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add First Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title" style={{ color: purpleColors.primary }}>
                  <i className={`bi ${taskModalMode === 'create' ? 'bi-plus-circle' : 'bi-pencil-square'} me-2`}></i>
                  {taskModalMode === 'create' ? 'Create New Task' : 'Edit Task'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTaskModal(false)}
                  disabled={processingAction}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleTaskSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Task Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: purpleColors.primary }}>
                        <i className="bi bi-check-square"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newTaskFormData.name}
                        onChange={handleTaskFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: purpleColors.primary }}>
                        <i className="bi bi-card-text"></i>
                      </span>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={newTaskFormData.description}
                        onChange={handleTaskFormChange}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="startDate" className="form-label">Start Date</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-calendar-event"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          name="startDate"
                          value={newTaskFormData.startDate}
                          onChange={handleTaskFormChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dueDate" className="form-label">Due Date</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-calendar-check"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          id="dueDate"
                          name="dueDate"
                          value={newTaskFormData.dueDate}
                          onChange={handleTaskFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-clock-history"></i>
                        </span>
                        <select
                          className="form-select"
                          id="status"
                          name="status"
                          value={newTaskFormData.status}
                          onChange={handleTaskFormChange}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="priority" className="form-label">Priority</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-flag"></i>
                        </span>
                        <select
                          className="form-select"
                          id="priority"
                          name="priority"
                          value={newTaskFormData.priority}
                          onChange={handleTaskFormChange}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="milestone_id" className="form-label">Milestone</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-flag-fill"></i>
                        </span>
                        <select
                          className="form-select"
                          id="milestone_id"
                          name="milestone_id"
                          value={newTaskFormData.milestone_id}
                          onChange={handleTaskFormChange}
                          required
                        >
                          <option value="">Select Milestone</option>
                          {milestones.map(milestone => (
                            <option key={milestone.id} value={milestone.id}>
                              {milestone.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="assigned_to" className="form-label">Assigned To</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-person"></i>
                        </span>
                        <select
                          className="form-select"
                          id="assigned_to"
                          name="assigned_to"
                          value={newTaskFormData.assigned_to}
                          onChange={handleTaskFormChange}
                        >
                          <option value="">Unassigned</option>
                          {projectMembers.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.name} - {member.role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer" style={{ borderTop: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-pill" 
                      onClick={() => setShowTaskModal(false)}
                      disabled={processingAction}
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill"
                      style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                      disabled={processingAction}
                    >
                      {processingAction ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {taskModalMode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <i className={`bi ${taskModalMode === 'create' ? 'bi-plus-circle' : 'bi-check-circle'} me-1`}></i>
                          {taskModalMode === 'create' ? 'Create Task' : 'Update Task'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* File Upload Modal */}
      {showFileModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-file-earmark-arrow-up me-2"></i>Upload File
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowFileModal(false)} disabled={processingAction}></button>
              </div>
              <form onSubmit={handleUploadSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="file-input" className="form-label">Select File</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: purpleColors.primary }}>
                        <i className="bi bi-file-earmark"></i>
                      </span>
                      <input
                        type="file"
                        className="form-control"
                        id="file-input"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                    <small className="text-muted mt-1">Maximum file size: 10MB</small>
                  </div>
                  {selectedTaskId && tasks.find(t => String(t.id) === String(selectedTaskId)) && (
                    <div className="mb-3">
                      <h6 className="text-muted mb-3">Existing Files</h6>
                      {tasks.find(t => String(t.id) === String(selectedTaskId)).files &&
                       tasks.find(t => String(t.id) === String(selectedTaskId)).files.length > 0 ? (
                        <ul className="list-group">
                          {tasks.find(t => String(t.id) === String(selectedTaskId)).files.map(file => (
                            <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <i className="bi bi-file-earmark me-2" style={{ color: purpleColors.secondary }}></i>
                                {file.name}
                              </div>
                              <button type="button" className="btn btn-sm btn-outline-danger rounded-pill">
                                <i className="bi bi-trash me-1"></i> Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="empty-state py-3 text-center">
                          <i className="bi bi-file-earmark-x fs-2" style={{ color: purpleColors.quaternary }}></i>
                          <p className="text-muted mt-2">No files attached to this task</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer" style={{ borderTop: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill" 
                    onClick={() => setShowFileModal(false)}
                    disabled={processingAction}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill"
                    style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                    disabled={processingAction}
                  >
                    {processingAction ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-upload me-1"></i> Upload
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;