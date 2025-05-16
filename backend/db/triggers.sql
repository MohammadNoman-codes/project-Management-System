-- Trigger to update milestone and project status when a task is set to "In Progress"
CREATE TRIGGER IF NOT EXISTS task_in_progress_update
AFTER UPDATE ON tasks
WHEN NEW.status = 'In Progress' AND OLD.status != 'In Progress'
BEGIN
    -- Update the milestone status to "In Progress" if it's not already "Completed"
    UPDATE milestones
    SET status = 'In Progress'
    WHERE id = NEW.milestone_id AND status != 'Completed';
    
    -- Update the project status to "In Progress" if it's not already "Completed"
    UPDATE projects
    SET status = 'In Progress'
    WHERE id = NEW.project_id AND status != 'Completed';
END;

-- Trigger to check if all tasks in a milestone are completed
CREATE TRIGGER IF NOT EXISTS task_completed_check_milestone
AFTER UPDATE ON tasks
WHEN NEW.status = 'Completed' AND OLD.status != 'Completed'
BEGIN
    -- Check if all tasks for this milestone are completed
    UPDATE milestones
    SET status = 'Completed'
    WHERE id = NEW.milestone_id AND (
        SELECT COUNT(*)
        FROM tasks
        WHERE milestone_id = NEW.milestone_id AND status != 'Completed'
    ) = 0;
    
    -- After updating milestone, check if all milestones for the project are completed
    UPDATE projects
    SET status = 'Completed'
    WHERE id = NEW.project_id AND (
        SELECT COUNT(*)
        FROM milestones
        WHERE project_id = NEW.project_id AND status != 'Completed'
    ) = 0;
END;
