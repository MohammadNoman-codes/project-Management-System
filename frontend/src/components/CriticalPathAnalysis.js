import React, { useEffect, useState } from 'react';

function CriticalPathAnalysis({ tasks = [] }) {
  const [criticalPath, setCriticalPath] = useState([]);
  const [projectDuration, setProjectDuration] = useState(0);
  const [taskDetails, setTaskDetails] = useState([]);

  useEffect(() => {
    if (tasks.length > 0) {
      const { criticalPathIds, duration, allTaskDetails } = calculateCriticalPath(tasks);
      setCriticalPath(criticalPathIds);
      setProjectDuration(duration);
      setTaskDetails(allTaskDetails);
    }
  }, [tasks]);

  // Calculate the critical path using forward and backward passes
  const calculateCriticalPath = (taskList) => {
    // Create a map of tasks by ID for easy lookup
    const taskMap = {};
    taskList.forEach(task => {
      taskMap[task.id] = {
        ...task,
        duration: calculateTaskDuration(task),
        earliestStart: 0,
        earliestFinish: 0,
        latestStart: 0,
        latestFinish: 0,
        slack: 0,
        predecessors: [], // Will be filled in the next step
        successors: [], // Will be filled in the next step
      };
    });

    // Build predecessor and successor relationships
    taskList.forEach(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          if (taskMap[depId]) {
            // This task depends on depId, so depId is a predecessor
            taskMap[task.id].predecessors.push(depId);
            // And this task is a successor to depId
            taskMap[depId].successors.push(task.id);
          }
        });
      }
    });

    // Find start tasks (tasks with no dependencies)
    const startTasks = Object.values(taskMap).filter(task => task.predecessors.length === 0);
    
    // Find end tasks (tasks with no successors)
    const endTasks = Object.values(taskMap).filter(task => task.successors.length === 0);

    // Forward Pass - Calculate earliest start and finish times
    const performForwardPass = (taskId, earliestStart = 0) => {
      const task = taskMap[taskId];
      
      // The earliest this task can start is the maximum of the earliest finish times of its predecessors
      task.earliestStart = Math.max(earliestStart, ...task.predecessors.map(predId => 
        taskMap[predId].earliestFinish || 0
      ));
      
      // The earliest this task can finish is its earliest start plus its duration
      task.earliestFinish = task.earliestStart + task.duration;
      
      // Process all successors
      task.successors.forEach(succId => {
        performForwardPass(succId, task.earliestFinish);
      });
    };

    // Start the forward pass from all start tasks
    startTasks.forEach(task => {
      performForwardPass(task.id);
    });

    // Find the project duration (maximum earliest finish time of any end task)
    const projectEndTime = Math.max(...endTasks.map(task => task.earliestFinish));
    
    // Backward Pass - Calculate latest start and finish times
    const performBackwardPass = (taskId, latestFinish = projectEndTime) => {
      const task = taskMap[taskId];
      
      // The latest this task can finish is the minimum of the latest start times of its successors
      task.latestFinish = task.successors.length === 0 ? 
        projectEndTime : 
        Math.min(...task.successors.map(succId => taskMap[succId].latestStart));
      
      // The latest this task can start is its latest finish minus its duration
      task.latestStart = task.latestFinish - task.duration;
      
      // Calculate slack (float) time
      task.slack = task.latestStart - task.earliestStart;
      
      // Process all predecessors
      task.predecessors.forEach(predId => {
        performBackwardPass(predId, task.latestStart);
      });
    };

    // Start the backward pass from all end tasks
    endTasks.forEach(task => {
      performBackwardPass(task.id);
    });

    // Find the critical path (tasks with zero slack)
    const criticalPathIds = Object.values(taskMap)
      .filter(task => task.slack === 0)
      .map(task => task.id);

    return {
      criticalPathIds,
      duration: projectEndTime,
      allTaskDetails: Object.values(taskMap)
    };
  };

  // Calculate task duration in days from start date to due date
  const calculateTaskDuration = (task) => {
    if (!task.startDate || !task.dueDate) return 1; // Default to 1 day if dates not set
    
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 1; // Minimum 1 day duration
  };

  // Format duration in days to readable text
  const formatDuration = (days) => {
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  return (
    <div className="critical-path-analysis">
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Critical Path Analysis</h5>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6>Project Duration</h6>
                  <p className="display-6 mb-0">{formatDuration(projectDuration)}</p>
                  <p className="text-muted small">Minimum time needed to complete the project</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6>Critical Path Tasks</h6>
                  <p className="display-6 mb-0">{criticalPath.length}</p>
                  <p className="text-muted small">These tasks directly affect project duration</p>
                </div>
              </div>
            </div>
          </div>

          <h6>Critical Path Sequence</h6>
          <p className="mb-3 text-muted">
            The critical path is the sequence of tasks that determines the minimum project duration. 
            Any delay in these tasks will delay the entire project.
          </p>
          
          <div className="critical-path-diagram mb-4">
            {criticalPath.length > 0 ? (
              <div className="d-flex flex-wrap">
                {criticalPath.map((taskId, index) => {
                  const task = taskDetails.find(t => t.id === taskId);
                  return (
                    <div key={taskId} className="critical-path-step">
                      <div className="critical-task-box bg-danger bg-opacity-25 p-2 rounded">
                        <h6 className="mb-1">{task?.name}</h6>
                        <small className="d-block text-muted">{formatDuration(task?.duration)}</small>
                      </div>
                      {index < criticalPath.length - 1 && (
                        <div className="critical-path-arrow px-2">
                          <i className="bi bi-arrow-right"></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted">Critical path could not be determined with the current task dependencies.</p>
            )}
          </div>

          <h6>Task Analysis Details</h6>
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Duration</th>
                  <th>Earliest Start</th>
                  <th>Earliest Finish</th>
                  <th>Latest Start</th>
                  <th>Latest Finish</th>
                  <th>Slack/Float</th>
                  <th>Critical?</th>
                </tr>
              </thead>
              <tbody>
                {taskDetails.map(task => (
                  <tr key={task.id} className={criticalPath.includes(task.id) ? 'table-danger' : ''}>
                    <td>{task.name}</td>
                    <td>{formatDuration(task.duration)}</td>
                    <td>Day {task.earliestStart}</td>
                    <td>Day {task.earliestFinish}</td>
                    <td>Day {task.latestStart}</td>
                    <td>Day {task.latestFinish}</td>
                    <td>{task.slack} days</td>
                    <td>{criticalPath.includes(task.id) ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CriticalPathAnalysis;
