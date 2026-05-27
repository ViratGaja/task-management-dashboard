import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'dueDate_asc', label: 'Due Date' },
  { value: 'priority_desc', label: 'Priority' },
  { value: 'title_asc', label: 'Title A-Z' },
];

const PRIORITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };

const TaskList = ({ tasks = [], loading = false, onEditTask, onDeleteTask }) => {
  const [sortBy, setSortBy] = useState('createdAt_desc');

  const sortedTasks = useMemo(() => {
    const [field, dir] = sortBy.split('_');
    return [...tasks].sort((a, b) => {
      let aVal = a[field], bVal = b[field];
      if (field === 'priority') { aVal = PRIORITY_ORDER[a.priority] || 0; bVal = PRIORITY_ORDER[b.priority] || 0; }
      if (field === 'dueDate') { aVal = aVal ? new Date(aVal).getTime() : Infinity; bVal = bVal ? new Date(bVal).getTime() : Infinity; }
      if (typeof aVal === 'string') aVal = aVal?.toLowerCase() || '';
      if (typeof bVal === 'string') bVal = bVal?.toLowerCase() || '';
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortBy]);

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks ({tasks.length})</h2>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="task-list-empty">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
