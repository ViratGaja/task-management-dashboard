import React from 'react';

const PRIORITY_COLORS = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444', Critical: '#dc2626' };
const STATUS_COLORS = { 'Todo': '#6b7280', 'In Progress': '#3b82f6', 'Review': '#f59e0b', 'Done': '#22c55e' };
const TYPE_COLORS = { Bug: '#ef4444', Feature: '#3b82f6', Enhancement: '#8b5cf6', Research: '#f59e0b' };

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isPending = task._isPending;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className={`task-card ${isPending ? 'task-card--pending' : ''}`} style={{ borderLeftColor: TYPE_COLORS[task.taskType] || '#6b7280' }}>
      {isPending && <div className="pending-badge">Saving...</div>}

      <div className="task-card-header">
        <div className="task-meta">
          <span className="task-type-badge" style={{ backgroundColor: TYPE_COLORS[task.taskType] }}>
            {task.taskType}
          </span>
          <span className="task-status-badge" style={{ color: STATUS_COLORS[task.status], borderColor: STATUS_COLORS[task.status] }}>
            {task.status}
          </span>
        </div>
        <div className="task-actions">
          <button onClick={onEdit} className="btn-icon btn-edit" title="Edit" disabled={isPending}>✏️</button>
          <button onClick={onDelete} className="btn-icon btn-delete" title="Delete" disabled={isPending}>🗑️</button>
        </div>
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">
            {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
          </p>
        )}

        {task.taskType === 'Bug' && task.severity && (
          <div className="task-detail">
            Severity: <span className={`severity severity--${task.severity?.toLowerCase()}`}>{task.severity}</span>
          </div>
        )}
        {task.taskType === 'Feature' && task.acceptanceCriteria?.length > 0 && (
          <div className="task-detail">{task.acceptanceCriteria.length} acceptance criteria</div>
        )}
        {task.subtasks?.length > 0 && (
          <div className="task-detail">
            Subtasks: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
          </div>
        )}
      </div>

      <div className="task-footer">
        <span className="task-assignee">
          {task.assigneeId ? `User ${task.assigneeId}` : 'Unassigned'}
        </span>
        {task.dueDate && (
          <span className={`task-due ${isOverdue ? 'task-due--overdue' : ''}`}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        <span className="task-priority" style={{ color: PRIORITY_COLORS[task.priority] }}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
