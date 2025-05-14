import React, { useState, useEffect } from 'react';
import TaskDependencies from './TaskDependencies';

function TaskForm({ task = null, projectMembers = [], milestones = [], allTasks = [], onSubmit, onCancel }) {
  // Default empty task if none is provided (for create mode)
  const [formData, setFormData] = useState({
    id: task?.id || Date.now(),
    name: task?.name || '',
    description: task?.description || '',
    status: task?.status || 'Pending',
    startDate: task?.startDate || new Date().toISOString().split('T')[0],
    dueDate: task?.dueDate || '',
    assignedTo: task?.assignedTo?.id || '',
    milestoneId: task?.milestoneId || '',
    priority: task?.priority || 'Medium',
    estimatedHours: task?.estimatedHours || 0,
    actualHours: task?.actualHours || 0,
    dependencies: task?.dependencies || [],
    tags: task?.tags || [],
    attachments: task?.attachments || []
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  
  // Priority levels with their corresponding color classes
  const priorityLevels = [
    { value: 'Critical', label: 'Critical', color: 'danger' },
    { value: 'High', label: 'High', color: 'warning' },
    { value: 'Medium', label: 'Medium', color: 'primary' },
    { value: 'Low', label: 'Low', color: 'success' },
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle dependencies change
  const handleDependenciesChange = (updatedDependencies) => {
    setFormData(prev => ({
      ...prev,
      dependencies: updatedDependencies
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Task name is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.milestoneId) newErrors.milestoneId = 'Milestone is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Transform assignedTo from ID to object for the complete task object
    const assignedMember = projectMembers.find(member => member.id.toString() === formData.assignedTo.toString());
    const finalTaskData = {
      ...formData,
      assignedTo: assignedMember || null,
      estimatedHours: Number(formData.estimatedHours),
      actualHours: Number(formData.actualHours)
    };
    
    onSubmit(finalTaskData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Task Name *</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
        ></textarea>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="dueDate" className="form-label">Due Date *</label>
          <input
            type="date"
            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select
            className="form-select"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            {priorityLevels.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="estimatedHours" className="form-label">Estimated Hours</label>
          <input
            type="number"
            className="form-control"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleInputChange}
            min="0"
            step="0.5"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="actualHours" className="form-label">Actual Hours</label>
          <input
            type="number"
            className="form-control"
            id="actualHours"
            name="actualHours"
            value={formData.actualHours}
            onChange={handleInputChange}
            min="0"
            step="0.5"
          />
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="assignedTo" className="form-label">Assigned To</label>
          <select
            className="form-select"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
          >
            <option value="">Unassigned</option>
            {projectMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="milestoneId" className="form-label">Milestone *</label>
          <select
            className={`form-select ${errors.milestoneId ? 'is-invalid' : ''}`}
            id="milestoneId"
            name="milestoneId"
            value={formData.milestoneId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Milestone</option>
            {milestones.map(milestone => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.name}
              </option>
            ))}
          </select>
          {errors.milestoneId && <div className="invalid-feedback">{errors.milestoneId}</div>}
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Tags</label>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <button 
            type="button" 
            className="btn btn-outline-primary" 
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
        <div>
          {formData.tags.map(tag => (
            <span key={tag} className="badge bg-info me-2 mb-2">
              {tag}
              <button 
                type="button" 
                className="btn-close btn-close-white ms-2" 
                style={{ fontSize: '0.5rem' }}
                onClick={() => handleRemoveTag(tag)}
                aria-label="Remove tag"
              ></button>
            </span>
          ))}
        </div>
      </div>
      
      {/* Dependencies Section */}
      <div className="mb-3">
        <label className="form-label fw-bold">Dependencies</label>
        <TaskDependencies
          currentTaskId={formData.id}
          dependencies={formData.dependencies}
          allTasks={allTasks}
          onChange={handleDependenciesChange}
        />
      </div>
      
      <div className="text-end mt-4">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {task ? 'Update' : 'Create'} Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
