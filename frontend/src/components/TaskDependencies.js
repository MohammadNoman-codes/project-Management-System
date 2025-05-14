import React, { useState } from 'react';

function TaskDependencies({ currentTaskId, dependencies = [], allTasks = [], onChange }) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  
  // Remove a dependency
  const removeDependency = (dependencyId) => {
    const updatedDependencies = dependencies.filter(id => id !== dependencyId);
    onChange(updatedDependencies);
  };
  
  // Add a new dependency
  const addDependency = () => {
    if (selectedTaskId && !dependencies.includes(Number(selectedTaskId))) {
      const updatedDependencies = [...dependencies, Number(selectedTaskId)];
      onChange(updatedDependencies);
      setSelectedTaskId('');
    }
  };
  
  // Filter out tasks that are already dependencies or the current task
  const availableTasks = allTasks.filter(task => 
    task.id !== currentTaskId && !dependencies.includes(task.id)
  );
  
  // Get dependency tasks to display details
  const dependencyTasks = allTasks.filter(task => 
    dependencies.includes(task.id)
  );
  
  return (
    <div className="task-dependencies">
      {dependencyTasks.length > 0 ? (
        <div className="mb-3">
          <label className="form-label">Current Dependencies</label>
          <ul className="list-group">
            {dependencyTasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{task.name}</span>
                  <span className="ms-2 text-muted small">({task.milestone})</span>
                  <span className={`ms-2 badge ${
                    task.status === 'Completed' ? 'bg-success' : 
                    task.status === 'In Progress' ? 'bg-primary' : 'bg-warning'
                  }`}>{task.status}</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeDependency(task.id)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted">No dependencies selected</p>
      )}
      
      {availableTasks.length > 0 && (
        <div className="mt-3">
          <label htmlFor="dependency-select" className="form-label">Add Dependency</label>
          <div className="input-group">
            <select
              id="dependency-select"
              className="form-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">Select a task...</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.name} ({task.milestone}) - {task.status}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={addDependency}
              disabled={!selectedTaskId}
            >
              Add
            </button>
          </div>
          <div className="form-text">
            A task can only start when all its dependencies are completed.
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDependencies;
