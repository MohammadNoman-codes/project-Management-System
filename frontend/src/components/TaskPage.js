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

  const { projectId, taskId } = useParams();
  const history = useHistory();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('create');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

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
        
        let projectData;
        if (projectId) {
          projectData = await projectService.getProjectById(projectId);
          setProject(projectData);
        }
        
        // Get milestones
        if (projectId) {
          const projectDetails = await projectService.getProjectWithDetails(projectId);
          setMilestones(projectDetails.milestones || []);
        }
        
        // Get tasks
        const tasksData = await taskService.getAllTasks(projectId);
        setTasks(tasksData);
        
        // Get team members
        if (projectId) {
          const projectWithDetails = await projectService.getProjectWithDetails(projectId);
          setProjectMembers(projectWithDetails.team || []);
        }
        
        // If taskId is provided, fetch and select that task
        if (taskId) {
          const task = await taskService.getTaskById(taskId);
          if (task) {
            setSelectedTask(task);
            setTaskModalMode('edit');
            setShowTaskModal(true);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, taskId]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalMode('create');
    setShowTaskModal(true);
  };
  
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskModalMode('edit');
    setShowTaskModal(true);
  };
  
  const handleTaskSubmit = async (task) => {
    try {
      if (taskModalMode === 'create') {
        // Add new task
        await taskService.createTask({
          ...task,
          project_id: projectId
        });
      } else {
        // Update existing task
        await taskService.updateTask(task.id, task);
      }
      
      // Refresh tasks
      const updatedTasks = await taskService.getAllTasks(projectId);
      setTasks(updatedTasks);
      
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task');
    }
  };
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // In a real app, send to API
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };
  
  const handleFileChange = (event) => {
    // Handle file selection
    console.log('File selected:', event.target.files[0]);
  };
  
  const handleUploadFile = (taskId) => {
    setSelectedTaskId(taskId);
    setShowFileModal(true);
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

  return (
    <div className="task-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            {projectId ? `Tasks for ${project.title}` : 'All Tasks'}
            {taskId && ' > Task Details'}
          </h2>
          {projectId && (
            <p className="text-muted">{project.description}</p>
          )}
        </div>
        <div>
          <Link 
            to={projectId ? `/projects/${projectId}` : '/projects'} 
            className="btn btn-outline-primary rounded-pill me-2"
            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
          >
            <i className="bi bi-arrow-left me-1"></i> Back
          </Link>
          <button 
            className="btn btn-primary rounded-pill" 
            onClick={handleCreateTask}
            style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
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
                        {task.dueDate}
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
                          {task.assignedTo.name.charAt(0)}
                        </div>
                        <span>{task.assignedTo.name}</span>
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
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary rounded-end" 
                          onClick={() => handleUploadFile(task.id)}
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
          
          {tasks.length === 0 && (
            <div className="text-center my-5">
              <div className="empty-state py-4">
                <i className="bi bi-clipboard-plus fs-1" style={{ color: purpleColors.primary }}></i>
                <p className="text-muted mt-3 mb-4">No tasks found for this project</p>
                <button 
                  className="btn btn-primary rounded-pill"
                  onClick={handleCreateTask}
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
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
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Form handling would go here in a real app
                  // For now, let's just close the modal
                  handleTaskSubmit({
                    id: selectedTask ? selectedTask.id : Date.now(),
                    name: document.getElementById('taskName').value,
                    description: document.getElementById('taskDescription').value,
                    startDate: document.getElementById('taskStartDate').value,
                    dueDate: document.getElementById('taskDueDate').value,
                    status: document.getElementById('taskStatus').value,
                    milestone: document.getElementById('taskMilestone').value,
                    priority: document.getElementById('taskPriority').value,
                    assignedTo: projectMembers.find(m => m.id.toString() === document.getElementById('taskAssignee').value)
                  });
                }}>
                  <div className="mb-3">
                    <label htmlFor="taskName" className="form-label">Task Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: purpleColors.primary }}>
                        <i className="bi bi-check-square"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="taskName"
                        defaultValue={selectedTask?.name || ''}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="taskDescription" className="form-label">Description</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ color: purpleColors.primary }}>
                        <i className="bi bi-card-text"></i>
                      </span>
                      <textarea
                        className="form-control"
                        id="taskDescription"
                        rows="3"
                        defaultValue={selectedTask?.description || ''}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="taskStartDate" className="form-label">Start Date</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-calendar-event"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          id="taskStartDate"
                          defaultValue={selectedTask?.startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-calendar-check"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          id="taskDueDate"
                          defaultValue={selectedTask?.dueDate || ''}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="taskStatus" className="form-label">Status</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-clock-history"></i>
                        </span>
                        <select
                          className="form-select"
                          id="taskStatus"
                          defaultValue={selectedTask?.status || 'Not Started'}
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
                      <label htmlFor="taskPriority" className="form-label">Priority</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-flag"></i>
                        </span>
                        <select
                          className="form-select"
                          id="taskPriority"
                          defaultValue={selectedTask?.priority || 'Medium'}
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
                      <label htmlFor="taskMilestone" className="form-label">Milestone</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-flag-fill"></i>
                        </span>
                        <select
                          className="form-select"
                          id="taskMilestone"
                          defaultValue={selectedTask?.milestone || ''}
                          required
                        >
                          <option value="">Select Milestone</option>
                          {milestones.map(milestone => (
                            <option key={milestone.id} value={milestone.name}>
                              {milestone.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="taskAssignee" className="form-label">Assigned To</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ color: purpleColors.primary }}>
                          <i className="bi bi-person"></i>
                        </span>
                        <select
                          className="form-select"
                          id="taskAssignee"
                          defaultValue={selectedTask?.assignedTo?.id || ''}
                          required
                        >
                          <option value="">Select Team Member</option>
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
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill"
                      style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                    >
                      <i className={`bi ${taskModalMode === 'create' ? 'bi-plus-circle' : 'bi-check-circle'} me-1`}></i>
                      {taskModalMode === 'create' ? 'Create Task' : 'Update Task'}
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
                <button type="button" className="btn-close" onClick={() => setShowFileModal(false)}></button>
              </div>
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
                    />
                  </div>
                  <small className="text-muted mt-1">Maximum file size: 10MB</small>
                </div>
                {selectedTaskId && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-3">Existing Files</h6>
                    {tasks.find(t => t.id === selectedTaskId).files &&
                     Array.isArray(tasks.find(t => t.id === selectedTaskId).files) &&
                     tasks.find(t => t.id === selectedTaskId).files.length > 0 ? (
                      <ul className="list-group">
                        {tasks.find(t => t.id === selectedTaskId).files.map(file => (
                          <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bi bi-file-earmark me-2" style={{ color: purpleColors.secondary }}></i>
                              {file.name}
                            </div>
                            <button className="btn btn-sm btn-outline-danger rounded-pill">
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
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill"
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                >
                  <i className="bi bi-cloud-upload me-1"></i> Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;