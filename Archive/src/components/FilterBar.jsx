import React, { useState, useEffect, useCallback } from 'react';
import { TASK_TYPES, STATUSES } from '../api/mockApi';

const FilterBar = ({ filters = {}, projects = [], users = [], onFiltersChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line

  const handleChange = useCallback((key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const clearAll = () => {
    setSearchInput('');
    onFiltersChange({ projectId: null, assigneeId: null, status: 'all', taskType: 'all', search: '' });
  };

  const activeCount = [
    filters.projectId, filters.assigneeId,
    filters.status !== 'all' && filters.status,
    filters.taskType !== 'all' && filters.taskType,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <input
          type="text" placeholder="Search tasks..." value={searchInput}
          onChange={e => setSearchInput(e.target.value)} className="search-input"
        />
        <select value={filters.projectId || ''} onChange={e => handleChange('projectId', e.target.value || null)} className="filter-select">
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filters.assigneeId || ''} onChange={e => handleChange('assigneeId', e.target.value || null)} className="filter-select">
          <option value="">All Assignees</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={filters.status || 'all'} onChange={e => handleChange('status', e.target.value)} className="filter-select">
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.taskType || 'all'} onChange={e => handleChange('taskType', e.target.value)} className="filter-select">
          <option value="all">All Types</option>
          {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={clearAll} className={`clear-btn ${activeCount > 0 ? 'clear-btn--active' : ''}`} disabled={activeCount === 0}>
          Clear Filters {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
