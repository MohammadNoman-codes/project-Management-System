import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
// Remove this import
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProjectBudget from './ProjectBudget';
import GanttChart from './GanttChart';
import AnalyticsPage from './analytics/AnalyticsPage';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import budgetService from '../services/budgetService';

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
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  
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
  const handleAddTeamMember = async () => {
    // Validate inputs
    if (!newTeamMember.name || !newTeamMember.role) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create a new team member with a unique ID
    const teamMemberData = {
      name: newTeamMember.name,
      role: newTeamMember.role,
      email: newTeamMember.email
    };
    
    try {
      setProcessingAction(true); // Add this state variable if not already present
      
      // Save to database via API
      const addedMember = await projectService.addTeamMember(id, teamMemberData);
      
      // Update project with new team member
      setProject(prev => ({
        ...prev,
        team: [...(prev.team || []), addedMember]
      }));
      
      // Reset form and close modal
      setNewTeamMember({
        name: '',
        role: 'Team Member',
        email: ''
      });
      setShowAddTeamModal(false);
      setProcessingAction(false);
      
    } catch (error) {
      console.error('Error adding team member:', error);
      alert(`Failed to add team member: ${error.message || 'Unknown error'}`);
      setProcessingAction(false);
    }
  };
  
  // Handle removing a team member
  const handleRemoveTeamMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        setProcessingAction(true);
        
        // Remove from database via API
        await projectService.removeTeamMember(id, memberId);
        
        // Update local state
        setProject(prev => ({
          ...prev,
          team: prev.team.filter(member => member.id !== memberId)
        }));
        
        setProcessingAction(false);
        
      } catch (error) {
        console.error('Error removing team member:', error);
        alert(`Failed to remove team member: ${error.message || 'Unknown error'}`);
        setProcessingAction(false);
      }
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
        
        // Process tasks differently than before
        // The API returns tasks as a separate array, not nested in milestones
        if (projectData.tasks && Array.isArray(projectData.tasks)) {
          // Map each task to add milestone information based on the milestone_id
          const processedTasks = projectData.tasks.map(task => {
            // Find the milestone this task belongs to
            const milestone = projectData.milestones?.find(m => m.id === task.milestone_id);
            
            return {
              ...task,
              milestone: milestone?.name || 'Unknown Milestone',
              milestoneId: task.milestone_id,
              columnStatus: task.status === 'Completed' ? 'Completed' :
                          task.status === 'In Progress' ? 'In Progress' :
                          task.status === 'Review' ? 'Review' : 'To Do',
              // Ensure assignedTo object exists even if null in API
              assignedTo: task.assigned_to ? {
                name: task.assigned_to_name || 'Unknown User',
                avatar: task.assigned_to_avatar
              } : { name: 'Unassigned' }
            };
          });
          
          setTasks(processedTasks);
        } else {
          setTasks([]);
        }
        
        // Default to expand the first milestone
        if (projectData.milestones && projectData.milestones.length > 0) {
          setExpandedMilestones({ [projectData.milestones[0].id]: true });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        console.log('Error fetching project data:', error);
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
        start: milestone.start_date,
        end: milestone.end_date,
        progress: milestone.status === 'Completed' ? 100 : 
                 milestone.status === 'In Progress' ? 50 : 0,
        type: 'project'
      });
      
      // Find tasks associated with this milestone
      const milestoneTasks = tasks.filter(task => task.milestoneId === milestone.id);
      
      // Add tasks as children
      if (milestoneTasks.length > 0) {
        milestoneTasks.forEach(task => {
          ganttTasks.push({
            id: `task-${task.id}`,
            name: task.name,
            start: task.start_date,
            end: task.due_date,
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
    
    // Example of how you might update the task in state
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
  
  // Replace the onDragEnd function with individual drag event handlers
  const handleDragStart = (e, task) => {
    // Set the dragged task
    setDraggedTask(task);
    
    // Set drag effect and data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // Add a class to the dragged element for visual feedback
    if (e.target.classList) {
      setTimeout(() => {
        e.target.classList.add('task-being-dragged');
      }, 0);
    }
  };
  
  const handleDragOver = (e, columnName) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    
    // Update the column being dragged over for visual feedback
    if (dragOverColumn !== columnName) {
      setDragOverColumn(columnName);
    }
  };
  
  const handleDragEnter = (e, columnName) => {
    e.preventDefault(); // Allow drop
    setDragOverColumn(columnName);
  };
  
  const handleDragLeave = (e) => {
    // Check if we're leaving the column (not just moving between tasks)
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    
    // Reset drag over column
    setDragOverColumn(null);
  };
  
  const handleDrop = async (e, targetColumnName) => {
    e.preventDefault();
    
    // Reset the drag over column
    setDragOverColumn(null);
    
    // If no task is being dragged or it's dropped in the same column, do nothing
    if (!draggedTask || draggedTask.status === targetColumnName) {
      return;
    }
    
    // Get the task ID from dataTransfer
    const taskId = e.dataTransfer.getData('text/plain');
    
    // Optimistic update - update the task status in the UI first
    setTasks(prevTasks => 
      prevTasks.map(task => 
        String(task.id) === taskId 
          ? { ...task, status: targetColumnName, columnStatus: targetColumnName, isUpdating: true }
          : task
      )
    );
    
    try {
      // Use the dedicated status update method
      await taskService.updateTaskStatus(taskId, targetColumnName);
      
      // Update the task status to reflect the change
      setTasks(prevTasks => 
        prevTasks.map(task => 
          String(task.id) === taskId 
            ? { ...task, status: targetColumnName, columnStatus: targetColumnName, isUpdating: false }
            : task
        )
      );
      
      console.log(`Task moved to ${targetColumnName}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Revert the optimistic update if the API call fails
      setTasks(prevTasks => 
        prevTasks.map(task => 
          String(task.id) === taskId 
            ? { ...task, status: draggedTask.status, columnStatus: draggedTask.status, isUpdating: false }
            : task
        )
      );
      
      alert(`Failed to update task status: ${error.message || 'Unknown error'}`);
    } finally {
      // Reset the dragged task
      setDraggedTask(null);
    }
  };
  
  const handleDragEnd = (e) => {
    // Remove drag visual feedback
    if (e.target.classList) {
      e.target.classList.remove('task-being-dragged');
    }
    
    // If the drop didn't happen in a valid drop target, reset the dragged task
    if (!dragOverColumn) {
      setDraggedTask(null);
    }
  };
  
  // Functions for finance requests and approvals
  const handleAddExpense = async (expenseData) => {
    try {
      // Add project ID to the expense data
      const newExpense = {
        ...expenseData,
        project_id: id
      };
      
      // Call the budget service to add the expenses
      const response = await budgetService.addExpense(id, newExpense);
      
      // Update the project with the new expense
      setProject(prev => {
        // If the project doesn't have a budget property yet, create it
        const prevBudget = prev.budget || { expenses: [] };
        
        return {
          ...prev,
          budget: {
            ...prevBudget,
            expenses: [...prevBudget.expenses, response]
          }
        };
      });
      
      return response;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };
  
  const handleApproveExpense = async (expenseId) => {
    try {
      // Call the budget service to approve the expense
      const response = await budgetService.approveExpense(expenseId);
      
      // Update the project's expenses list with the approved expense
      setProject(prev => {
        const updatedExpenses = prev.budget.expenses.map(expense => 
          expense.id === expenseId ? { ...expense, status: 'Approved' } : expense
        );
        
        return {
          ...prev,
          budget: {
            ...prev.budget,
            expenses: updatedExpenses,
            // Update actual budget if returned from API
            actual: response.actual || prev.budget.actual
          }
        };
      });
      
      return response;
    } catch (error) {
      console.error('Error approving expense:', error);
      throw error;
    }
  };
  
  const handleRejectExpense = async (expenseId) => {
    try {
      // Call the budget service to reject the expense
      const response = await budgetService.rejectExpense(expenseId);
      
      // Update the project's expenses list with the rejected expense
      setProject(prev => {
        const updatedExpenses = prev.budget.expenses.map(expense => 
          expense.id === expenseId ? { ...expense, status: 'Rejected' } : expense
        );
        
        return {
          ...prev,
          budget: {
            ...prev.budget,
            expenses: updatedExpenses
          }
        };
      });
      
      return response;
    } catch (error) {
      console.error('Error rejecting expense:', error);
      throw error;
    }
  };
  
  const handleApproveBudgetChange = async (budgetChangeId) => {
    try {
      // Call the budget service to approve the budget change
      const response = await budgetService.approveBudgetChange(budgetChangeId);
      
      // Update the project's budget changes with the approved change
      setProject(prev => {
        const updatedBudgetChanges = prev.budget.budgetChanges.map(change => 
          change.id === budgetChangeId ? { ...change, status: 'Approved' } : change
        );
        
        return {
          ...prev,
          budget: {
            ...prev.budget,
            budgetChanges: updatedBudgetChanges,
            // Update estimated budget if returned from API
            estimated: response.newEstimated || prev.budget.estimated
          }
        };
      });
      
      return response;
    } catch (error) {
      console.error('Error approving budget change:', error);
      throw error;
    }
  };

  // Enhanced fetch data function to ensure we get complete project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get comprehensive project details from API
        const projectData = await projectService.getProjectWithDetails(id);
        setProject(projectData);
        
        // Process tasks the same way as above
        if (projectData.tasks && Array.isArray(projectData.tasks)) {
          // Map each task to add milestone information based on the milestone_id
          const processedTasks = projectData.tasks.map(task => {
            // Find the milestone this task belongs to
            const milestone = projectData.milestones?.find(m => m.id === task.milestone_id);
            
            // Ensure task.id is a string for consistency
            const taskId = String(task.id);
            
            return {
              ...task,
              id: taskId, // Ensure ID is a string
              milestone: milestone?.name || 'Unknown Milestone',
              milestoneId: task.milestone_id,
              columnStatus: task.status === 'Completed' ? 'Completed' :
                          task.status === 'In Progress' ? 'In Progress' :
                          task.status === 'Review' ? 'Review' : 'To Do',
              // Ensure assignedTo object exists even if null in API
              assignedTo: task.assigned_to ? {
                name: task.assigned_to_name || 'Unknown User',
                avatar: task.assigned_to_avatar
              } : { name: 'Unassigned' }
            };
          });
          
          setTasks(processedTasks);
        } else {
          setTasks([]);
        }
        
        // Default to expand the first milestone
        if (projectData.milestones && projectData.milestones.length > 0) {
          setExpandedMilestones({ [projectData.milestones[0].id]: true });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
        // Display error state to user
        alert('Failed to load project data. Please refresh the page and try again.');
      }
    };
    
    fetchData();
  }, [id]);

  // Function to get tasks by column name
  const getTasksByColumn = (columnName) => {   
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    // Return tasks that match the column name either in columnStatus or status field
    return tasks.filter(task => 
      task && (task.columnStatus === columnName || task.status === columnName)
    );
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

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return purpleColors.accent3;
      case 'Medium': return purpleColors.accent2;
      case 'Low': return purpleColors.tertiary;
      default: return purpleColors.quaternary;
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
                  <i className="bi bi-plus-circle me-2"></i> Add Tasks
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
                  {project.manager?.name?.charAt(0) || 'M'}
                </div>
                <span className="fw-medium">{project.manager?.name || 'Project Manager'}</span>
              </div>
            </div>
            <div className="col-md-4">
              <h6 className="text-muted mb-2">Timeline</h6>
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar3 me-2" style={{ color: purpleColors.secondary }}></i>
                <span>
                  {project.start_date || project.startDate || 'Start date'} - {project.end_date || project.endDate || 'End date'}
                </span>
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
        <div className="kanban-board-container">
          <div className="row g-4">
            {boardColumns.map((columnName) => (
              <div 
                className="col-md-3" 
                key={columnName}
                onDragEnter={(e) => handleDragEnter(e, columnName)}
                onDragOver={(e) => handleDragOver(e, columnName)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, columnName)}
              >
                <div 
                  className={`dashboard-card h-100 ${dragOverColumn === columnName ? 'kanban-column-drag-over' : ''}`}
                  style={{
                    transition: 'background-color 0.2s ease',
                    backgroundColor: dragOverColumn === columnName 
                      ? `rgba(${safeHexToRgb(getStatusColor(columnName))}, 0.05)` 
                      : ''
                  }}
                >
                  <div className="card-header" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(getStatusColor(columnName))}, 0.1)` 
                  }}>
                    <h6 className="mb-0" style={{ color: getStatusColor(columnName) }}>
                      <i className={`bi ${
                        columnName === 'Completed' ? 'bi-check-circle' : 
                        columnName === 'In Progress' ? 'bi-arrow-repeat' : 
                        columnName === 'Review' ? 'bi-eye' : 'bi-list-check'
                      } me-2`}></i>
                      {columnName} ({getTasksByColumn(columnName).length})
                    </h6>
                  </div>
                  <div 
                    className="card-body kanban-column" 
                    style={{ minHeight: '500px', padding: '0.75rem' }}
                  >
                    {getTasksByColumn(columnName).map((task, index) => (
                      <div
                        key={task.id}
                        className={`card mb-3 kanban-task ${draggedTask && draggedTask.id === task.id ? 'task-being-dragged' : ''}`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        style={{
                          borderLeft: `4px solid ${getStatusColor(task.status)}`,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          opacity: task.isUpdating ? 0.7 : 1,
                          cursor: 'grab'
                        }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{task.name}</h6>
                            <div>
                              {task.isUpdating && (
                                <div className="spinner-border spinner-border-sm text-secondary me-2" 
                                     role="status" style={{ width: '0.9rem', height: '0.9rem' }}>
                                  <span className="visually-hidden">Updating...</span>
                                </div>
                              )}
                              <span className="badge" 
                                    style={{ backgroundColor: getStatusColor(task.status), fontSize: '0.65rem' }}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-muted small mb-2">
                            <i className="bi bi-flag me-1"></i> {task.milestone}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="text-muted small mb-0">
                              <i className="bi bi-calendar-event me-1"></i> 
                              Due: {task.dueDate || task.due_date}
                            </p>
                            
                            <span className="badge" 
                                  style={{ backgroundColor: getPriorityColor(task.priority), fontSize: '0.65rem' }}>
                              {task.priority}
                            </span>
                          </div>
                          
                          <div className="d-flex align-items-center mt-2">
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
                              {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
                            </div>
                            <small className="text-muted">{task.assignedTo?.name || 'Unassigned'}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {getTasksByColumn(columnName).length === 0 && (
                      <div className="empty-column text-center p-4">
                        <i className="bi bi-inbox text-muted" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                        <p className="text-muted small mt-2">Drop tasks here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* List view */}
      {activeView === 'list' && (
        <div className="accordion" id="milestonesAccordion">
          {project && project.milestones && Array.isArray(project.milestones) ? (
            project.milestones.map((milestone) => {
              // Filter tasks that belong to this milestone
              const milestoneTasks = tasks.filter(task => task.milestoneId === milestone.id);
              
              return (
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
                      <span className="text-muted ms-2 small">({milestone.startDate || milestone.start_date} - {milestone.endDate || milestone.end_date})</span>
                    </h6>
                    <span>
                      <i className={`bi ${expandedMilestones[milestone.id] ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ color: purpleColors.primary }}></i>
                    </span>
                  </div>
                  {expandedMilestones[milestone.id] && (
                    <div className="card-body">
                      {milestoneTasks && milestoneTasks.length > 0 ? (
                        milestoneTasks.map((task) => (
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
                                    <span>Start: {task.startDate || task.start_date}</span>
                                    <i className="bi bi-calendar-check ms-3 me-1"></i>
                                    <span>Due: {task.dueDate || task.due_date}</span>
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
                                        fontSize: '1rem'
                                      }}>
                                        {task.assignedTo && task.assignedTo.name ? task.assignedTo.name.charAt(0) : '?'}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="mb-0">{task.assignedTo?.name}</p>
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
              );
            })
          ) : (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              This project has no milestones yet. Add milestones to organize your tasks.
            </div>
          )}
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
          onAddExpense={handleAddExpense}
          onApproveExpense={handleApproveExpense}
          onRejectExpense={handleRejectExpense}
          onApproveBudgetChange={handleApproveBudgetChange}
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
                  disabled={processingAction}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill"
                  onClick={handleAddTeamMember}
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                  disabled={processingAction}
                >
                  {processingAction ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-1"></i> Add Member
                    </>
                  )}
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
