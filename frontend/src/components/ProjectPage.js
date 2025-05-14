import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProjectBudget from './ProjectBudget';
import GanttChart from './GanttChart';
import AnalyticsPage from './analytics/AnalyticsPage';
import projectService from '../services/projectService';
import taskService from '../services/taskService';

function ProjectPage() {
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
    underBudget: '#7986cb',  // Blue-purple
    onBudget: '#9575cd',     // Medium purple
    overBudget: '#8559da',   // Bright purple
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

  const { id } = useParams();
  const history = useHistory();
  const [expandedMilestones, setExpandedMilestones] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [activeView, setActiveView] = useState('board');
  const [boardColumns, setBoardColumns] = useState(['To Do', 'In Progress', 'Review', 'Completed']);
  const [tasks, setTasks] = useState([]);
  const [showBudgetDetails, setShowBudgetDetails] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: 'Team Member',
    email: ''
  });
  const [newExpense, setNewExpense] = useState({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  const [ganttViewMode, setGanttViewMode] = useState('Week');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  // Toggle milestone expansion
  const toggleMilestone = (milestoneId) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };
  
  // Handle file selection
  const handleFileChange = (taskId, e) => {
    if (e.target.files[0]) {
      setSelectedFile(prev => ({
        ...prev,
        [taskId]: e.target.files[0]
      }));
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (taskId) => {
    if (selectedFile[taskId]) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile[taskId]);
        
        await taskService.uploadTaskFile(taskId, formData);
        
        // Refresh task data after upload
        const updatedTask = await taskService.getTaskById(taskId);
        
        // Update tasks state with the new file
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId ? { ...t, files: updatedTask.files } : t
          )
        );
        
        setSelectedFile(prev => ({
          ...prev,
          [taskId]: null
        }));
        
        // Reset file input
        document.getElementById(`file-input-${taskId}`).value = '';
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      }
    }
  };
  
  // Handle team member input change
  const handleTeamMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeamMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding a team member
  const handleAddTeamMember = () => {
    // Validate inputs
    if (!newTeamMember.name || !newTeamMember.role) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create a new team member with a unique ID
    const newMember = {
      id: Date.now(),
      name: newTeamMember.name,
      role: newTeamMember.role,
      email: newTeamMember.email,
      avatar: 'https://via.placeholder.com/40' // Placeholder avatar
    };
    
    // Update project with new team member
    setProject(prev => ({
      ...prev,
      team: [...(prev.team || []), newMember]
    }));
    
    // Reset form and close modal
    setNewTeamMember({
      name: '',
      role: 'Team Member',
      email: ''
    });
    setShowAddTeamModal(false);
  };
  
  // Handle removing a team member
  const handleRemoveTeamMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setProject(prev => ({
        ...prev,
        team: prev.team.filter(member => member.id !== memberId)
      }));
    }
  };
  
  // Fetch project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get project details from API
        const projectData = await projectService.getProjectWithDetails(id);
        setProject(projectData);
        
        // Flatten tasks for other views (if needed)
        if (projectData.milestones) {
          const allTasks = projectData.milestones.flatMap(milestone => 
            milestone.tasks.map(task => ({
              ...task,
              milestone: milestone.name,
              milestoneId: milestone.id,
              columnStatus: task.status === 'Completed' ? 'Completed' :
                          task.status === 'In Progress' ? 'In Progress' :
                          task.status === 'Review' ? 'Review' : 'To Do'
            }))
          );
          
          setTasks(allTasks);
        }
        
        // Default to expand the first milestone
        if (projectData.milestones && projectData.milestones.length > 0) {
          setExpandedMilestones({ [projectData.milestones[0].id]: true });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
        // Implement error handling UI
      }
    };
    
    fetchData();
  }, [id]);

  // Transform tasks to Gantt chart compatible format
  const getGanttTasks = () => {
    if (!project) return [];
    
    const ganttTasks = [];
    
    // Add milestones as parent tasks
    project.milestones.forEach(milestone => {
      ganttTasks.push({
        id: `milestone-${milestone.id}`,
        name: milestone.name,
        start: milestone.startDate,
        end: milestone.endDate,
        progress: milestone.status === 'Completed' ? 100 : 
                 milestone.status === 'In Progress' ? 50 : 0,
        type: 'project'
      });
      
      // Add tasks as children
      if (milestone.tasks) {
        milestone.tasks.forEach(task => {
          ganttTasks.push({
            id: `task-${task.id}`,
            name: task.name,
            start: task.startDate,
            end: task.dueDate,
            progress: task.status === 'Completed' ? 100 : 
                     task.status === 'In Progress' ? 50 : 0,
            dependencies: task.dependencies ? task.dependencies.map(depId => `task-${depId}`) : []
          });
        });
      }
    });
    
    return ganttTasks;
  };
  
  // Handle Gantt task click
  const handleGanttTaskClick = (task) => {
    console.log('Task clicked:', task);
    // You could implement a modal to edit the task or navigate to task details
  };
  
  // Handle Gantt date change (when task is dragged)
  const handleGanttDateChange = (task, start, end) => {
    console.log('Task dates changed:', task, start, end);
    // In a real app, you'd update the task in your state/backend
    
    // Example of how you might update the task in state:
    if (task.id.startsWith('task-')) {
      const taskId = parseInt(task.id.replace('task-', ''));
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, startDate: start, dueDate: end } : t
        )
      );
    }
  };
  
  // Handle Gantt progress change
  const handleGanttProgressChange = (task, progress) => {
    console.log('Task progress changed:', task, progress);
    // Update task progress logic
  };
  
  // Handle drag end for board view
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
  
    // If there's no destination or the item was dropped back in the same place, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
  
    // Find the task that was dragged
    const draggedTask = tasks.find(task => task.id.toString() === draggableId);
    
    if (!draggedTask) return;
  
    // Update the task's column status
    const updatedTasks = tasks.map(task => {
      if (task.id.toString() === draggableId) {
        // Update the task's status based on destination column
        const newStatus = destination.droppableId === 'Completed' ? 'Completed' : 
                           destination.droppableId === 'In Progress' ? 'In Progress' : 
                           destination.droppableId === 'Review' ? 'Review' : 'Pending';
        
        return {
          ...task,
          columnStatus: destination.droppableId,
          status: newStatus
        };
      }
      return task;
    });
    
    // Update the tasks state
    setTasks(updatedTasks);
    
    // In a real app, you would also send an API request to update the task status on the server
  };

  // Function to get tasks by column name
  const getTasksByColumn = (columnName) => {
    return tasks.filter(task => task.columnStatus === columnName);
  };
  
  // Function to get appropriate status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return purpleColors.completed;
      case 'In Progress': return purpleColors.inProgress;
      case 'Review': return purpleColors.review;
      case 'To Do': case 'Pending': case 'Not Started': return purpleColors.todo;
      default: return purpleColors.quaternary;
    }
  };

  // Function to get milestone status color
  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case 'Completed': return purpleColors.completed;
      case 'In Progress': return purpleColors.inProgress;
      case 'Not Started': return purpleColors.tertiary;
      default: return purpleColors.quaternary;
    }
  };

  // Function to get team role color
  const getTeamRoleColor = (role) => {
    switch (role) {
      case 'Project Manager': return purpleColors.primary;
      case 'Design Engineer': return purpleColors.secondary;
      case 'Contract Manager': return purpleColors.tertiary;
      case 'Quality Assurance': return purpleColors.accent1;
      case 'Developer': return purpleColors.quaternary;
      case 'Designer': return purpleColors.accent2;
      case 'QA Engineer': return purpleColors.accent3;
      default: return purpleColors.quinary;
    }
  };

  if (!project) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="project-page">
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">{project.title}</h1>
          <p className="text-muted">{project.description}</p>
        </div>
        <div className="d-flex">
          <div className="me-3">
            <span className="badge" style={{ backgroundColor: getStatusColor(project.status) }}>{project.status}</span>
          </div>
          <button className="btn btn-outline-primary rounded-pill me-2">
            <i className="bi bi-gear me-1"></i> Settings
          </button>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle rounded-pill" 
              type="button" 
              id="projectActionsDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
            >
              <i className="bi bi-plus me-1"></i> Actions
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="projectActionsDropdown">
              <li>
                <Link to={`/projects/${id}/tasks`} className="dropdown-item">
                  <i className="bi bi-plus-circle me-2"></i> Add Task
                </Link>
              </li>
              <li>
                <Link to={`/tasks/${id}`} className="dropdown-item">
                  <i className="bi bi-list-task me-2"></i> View Tasks
                </Link>
              </li>
              <li><a className="dropdown-item" href="#"><i className="bi bi-plus-circle me-2"></i> Add Milestone</a></li>
              <li><a className="dropdown-item" href="#" onClick={() => setShowAddTeamModal(true)}><i className="bi bi-person-plus me-2"></i> Add Team Member</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#"><i className="bi bi-file-earmark-text me-2"></i> Generate Report</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Progress section */}
      <div className="dashboard-card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <h6 className="text-muted mb-2">Project Manager</h6>
              <div className="d-flex align-items-center">
                <div className="avatar-circle me-2" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                  color: purpleColors.primary,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {project.manager.name.charAt(0)}
                </div>
                <span className="fw-medium">{project.manager.name}</span>
              </div>
            </div>
            <div className="col-md-4">
              <h6 className="text-muted mb-2">Timeline</h6>
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar3 me-2" style={{ color: purpleColors.secondary }}></i>
                <span>{project.startDate} - {project.endDate}</span>
              </div>
            </div>
            <div className="col-md-4">
              <h6 className="text-muted mb-2">Progress</h6>
              <div className="d-flex justify-content-between mb-1 small">
                <span>Overall Completion</span>
                <span style={{ color: purpleColors.primary }}>{project.completion}%</span>
              </div>
              <div className="progress progress-thin">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{
                    width: `${project.completion}%`,
                    backgroundColor: project.completion > 75 ? purpleColors.completed : 
                                    project.completion > 50 ? purpleColors.secondary : 
                                    project.completion > 25 ? purpleColors.tertiary : purpleColors.quaternary
                  }} 
                  aria-valuenow={project.completion} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View selector tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'board' ? 'active' : ''}`}
            onClick={() => setActiveView('board')}
            style={activeView === 'board' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-kanban me-1"></i> Board
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
            style={activeView === 'timeline' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-calendar3 me-1"></i> Timeline
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
            style={activeView === 'list' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-list-ul me-1"></i> List
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'team' ? 'active' : ''}`}
            onClick={() => setActiveView('team')}
            style={activeView === 'team' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-people me-1"></i> Team
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveView('budget')}
            style={activeView === 'budget' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-cash me-1"></i> Budget
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
            style={activeView === 'analytics' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-graph-up me-1"></i> Analytics
          </button>
        </li>
      </ul>
      
      {/* Timeline View with Gantt Chart */}
      {activeView === 'timeline' && (
        <div className="dashboard-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">Project Timeline</h5>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${ganttViewMode === 'Day' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setGanttViewMode('Day')}
                style={ganttViewMode === 'Day' ? {
                  backgroundColor: purpleColors.primary,
                  borderColor: purpleColors.primary
                } : {
                  borderColor: purpleColors.primary,
                  color: purpleColors.primary
                }}
              >
                Day
              </button>
              <button 
                className={`btn btn-sm ${ganttViewMode === 'Week' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setGanttViewMode('Week')}
                style={ganttViewMode === 'Week' ? {
                  backgroundColor: purpleColors.primary,
                  borderColor: purpleColors.primary
                } : {
                  borderColor: purpleColors.primary,
                  color: purpleColors.primary
                }}
              >
                Week
              </button>
              <button 
                className={`btn btn-sm ${ganttViewMode === 'Month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setGanttViewMode('Month')}
                style={ganttViewMode === 'Month' ? {
                  backgroundColor: purpleColors.primary,
                  borderColor: purpleColors.primary
                } : {
                  borderColor: purpleColors.primary,
                  color: purpleColors.primary
                }}
              >
                Month
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="gantt-container" style={{height: '500px', overflowX: 'auto', overflowY: 'hidden'}}>
              <GanttChart
                tasks={getGanttTasks()}
                viewMode={ganttViewMode}
                onClick={handleGanttTaskClick}
                onDateChange={handleGanttDateChange}
                onProgressChange={handleGanttProgressChange}
                onTasksChange={(tasks) => console.log('Tasks changed:', tasks)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Board view */}
      {activeView === 'board' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row g-4">
            {boardColumns.map((columnName) => (
              <div className="col-md-3" key={columnName}>
                <div className="dashboard-card">
                  <div className="card-header" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(getStatusColor(columnName))}, 0.1)`,
                  }}>
                    <h6 className="mb-0" style={{ color: getStatusColor(columnName) }}>
                      <i className={`bi ${
                        columnName === 'Completed' ? 'bi-check-circle' : 
                        columnName === 'In Progress' ? 'bi-arrow-repeat' : 
                        columnName === 'Review' ? 'bi-eye' : 'bi-list-check'
                      } me-2`}></i>
                      {columnName}
                    </h6>
                  </div>
                  <Droppable droppableId={columnName}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="card-body"
                        style={{ minHeight: '400px' }}
                      >
                        {getTasksByColumn(columnName).map((task, index) => (
                          <Draggable 
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="card mb-3"
                                style={{ 
                                  borderLeft: `4px solid ${getStatusColor(task.status)}`,
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                              >
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="card-title mb-0">{task.name}</h6>
                                    <span className="badge" style={{ backgroundColor: getStatusColor(task.status), fontSize: '0.65rem' }}>
                                      {task.status}
                                    </span>
                                  </div>
                                  <p className="text-muted small mb-2">
                                    <i className="bi bi-flag me-1"></i> {task.milestone}
                                  </p>
                                  <p className="text-muted small mb-2">
                                    <i className="bi bi-calendar-event me-1"></i> Due: {task.dueDate}
                                  </p>
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
                                      {task.assignedTo.name.charAt(0)}
                                    </div>
                                    <small className="text-muted">{task.assignedTo.name}</small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
      
      {/* List view */}
      {activeView === 'list' && (
        <div className="accordion" id="milestonesAccordion">
          {project.milestones.map((milestone) => (
            <div className="dashboard-card mb-3" key={milestone.id}>
              <div
                className="card-header d-flex justify-content-between align-items-center"
                onClick={() => toggleMilestone(milestone.id)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: `rgba(${safeHexToRgb(getMilestoneStatusColor(milestone.status))}, 0.1)` 
                }}
              >
                <h6 className="mb-0 d-flex align-items-center">
                  <span className="badge me-2" style={{ backgroundColor: getMilestoneStatusColor(milestone.status) }}>
                    {milestone.status}
                  </span>
                  <span style={{ color: purpleColors.primary }}>{milestone.name}</span> 
                  <span className="text-muted ms-2 small">({milestone.startDate} - {milestone.endDate})</span>
                </h6>
                <span>
                  <i className={`bi ${expandedMilestones[milestone.id] ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ color: purpleColors.primary }}></i>
                </span>
              </div>
              {expandedMilestones[milestone.id] && (
                <div className="card-body">
                  {milestone.tasks.length > 0 ? (
                    milestone.tasks.map((task) => (
                      <div key={task.id} className="dashboard-card mb-3" style={{ borderLeft: `4px solid ${getStatusColor(task.status)}` }}>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="d-flex align-items-center mb-2">
                                <h6 className="mb-0">{task.name}</h6>
                                <span className="badge ms-2" style={{ backgroundColor: getStatusColor(task.status) }}>
                                  {task.status}
                                </span>
                              </div>
                              <p className="text-muted small">{task.description || 'No description available'}</p>
                              <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-calendar3 me-1"></i>
                                <span>Start: {task.startDate}</span>
                                <i className="bi bi-calendar-check ms-3 me-1"></i>
                                <span>Due: {task.dueDate}</span>
                              </div>
                            </div>
                            <div className="col-md-4 text-end">
                              <div className="d-flex align-items-center justify-content-end">
                                <div className="me-2">
                                  <div className="avatar-circle" style={{ 
                                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                                    color: purpleColors.primary,
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem'
                                  }}>
                                    {task.assignedTo.name.charAt(0)}
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-0">{task.assignedTo.name}</p>
                                </div>
                              </div>
                              
                              {/* Files Section */}
                              <div className="mt-3">
                                <h6 className="text-muted small mb-2">Files</h6>
                                <div className="row">
                                  <div className="col-md-8">
                                    {task.files && task.files.length > 0 ? (
                                      <ul className="list-group">
                                        {task.files.map((file) => (
                                          <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                              <i className="bi bi-file-earmark me-2"></i>
                                              {file.name}
                                              <small className="text-muted ms-2">({file.size})</small>
                                            </div>
                                            <div>
                                              <small className="text-muted me-2">Uploaded: {file.uploadDate}</small>
                                              <button className="btn btn-sm btn-outline-primary rounded-pill" style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}>
                                                <i className="bi bi-download me-1"></i> Download
                                              </button>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-muted small">No files attached</p>
                                    )}
                                  </div>
                                  <div className="col-md-4">
                                    <div className="input-group">
                                      <input
                                        type="file"
                                        className="form-control form-control-sm"
                                        id={`file-input-${task.id}`}
                                        onChange={(e) => handleFileChange(task.id, e)}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleFileUpload(task.id)}
                                        disabled={!selectedFile[task.id]}
                                        style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                                      >
                                        Upload
                                      </button>
                                    </div>
                                    <small className="text-muted">Upload files for this task</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No tasks for this milestone</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Team view */}
      {activeView === 'team' && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="dashboard-section-title mb-0">
                  <i className="bi bi-people me-2"></i>Team Members
                </h5>
                <button 
                  className="btn btn-outline-primary btn-sm rounded-pill"
                  onClick={() => setShowAddTeamModal(true)}
                  style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                >
                  <i className="bi bi-person-plus me-1"></i> Add Member
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.team.map(member => (
                        <tr key={member.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(getTeamRoleColor(member.role))}, 0.1)`,
                                color: getTeamRoleColor(member.role),
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem'
                              }}>
                                {member.name.charAt(0)}
                              </div>
                              <span>{member.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: getTeamRoleColor(member.role) }}>
                              {member.role}
                            </span>
                          </td>
                          <td>{member.email || 'N/A'}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <i className="bi bi-trash me-1"></i> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Budget view */}
      {activeView === 'budget' && (
        <ProjectBudget 
          project={project}
          onUpdateProject={(updatedProject) => setProject(updatedProject)}
          purpleColors={purpleColors}
        />
      )}

      {/* Analytics view */}
      {activeView === 'analytics' && (
        <div className="analytics-container">
          <AnalyticsPage projectId={id} />
        </div>
      )}
      
      {/* Add Team Member Modal */}
      {showAddTeamModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-person-plus me-2"></i>Add Team Member
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAddTeamModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newTeamMember.name}
                    onChange={handleTeamMemberInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select"
                    name="role"
                    value={newTeamMember.role}
                    onChange={handleTeamMemberInputChange}
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Design Engineer">Design Engineer</option>
                    <option value="Contract Manager">Contract Manager</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="Team Member">Team Member</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email" 
                    className="form-control"
                    name="email"
                    value={newTeamMember.email}
                    onChange={handleTeamMemberInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setShowAddTeamModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill"
                  onClick={handleAddTeamMember}
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;