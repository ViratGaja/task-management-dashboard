import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import FilterBar from './FilterBar';
import { fetchTasksRequest, createTaskRequest, updateTaskRequest, deleteTaskRequest } from '../store/actions/taskActions';
import { fetchUsersRequest, fetchProjectsRequest } from '../store/actions/taskActions';
import { openTaskForm, closeTaskForm, setFilters } from '../store/actions/uiActions';
import {
  selectFilteredTasks, selectTaskFormState, selectAllUsers,
  selectAllProjects, selectFilters, selectLoading, selectErrors, selectTaskById,
} from '../store/selectors';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const taskForm = useSelector(selectTaskFormState);
  const users = useSelector(selectAllUsers);
  const projects = useSelector(selectAllProjects);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const editingTask = useSelector(state => taskForm.taskId ? selectTaskById(state, taskForm.taskId) : null);

  useEffect(() => {
    dispatch(fetchTasksRequest({}));
    dispatch(fetchUsersRequest());
    dispatch(fetchProjectsRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTasksRequest(filters));
  }, [filters, dispatch]);

  const handleCreateTask = useCallback(() => dispatch(openTaskForm('create')), [dispatch]);
  const handleEditTask = useCallback((taskId) => dispatch(openTaskForm('edit', taskId)), [dispatch]);

  const handleDeleteTask = useCallback((taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTaskRequest(taskId));
    }
  }, [dispatch]);

  const handleFormSubmit = useCallback((formData) => {
    if (taskForm.mode === 'create') {
      dispatch(createTaskRequest(formData));
    } else {
      dispatch(updateTaskRequest(taskForm.taskId, formData));
    }
    dispatch(closeTaskForm());
  }, [dispatch, taskForm]);

  const handleFormClose = useCallback(() => {
    localStorage.removeItem('taskFormDraft');
    dispatch(closeTaskForm());
  }, [dispatch]);

  const handleFiltersChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  return (
    <div className="task-dashboard">
      <header className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <button className="create-task-btn" onClick={handleCreateTask}>
          + Create Task
        </button>
      </header>

      {errors.tasks && (
        <div className="error-banner">⚠️ {errors.tasks}</div>
      )}

      <FilterBar
        filters={filters}
        projects={projects}
        users={users}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        tasks={tasks}
        loading={loading.tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        isOpen={taskForm.isOpen}
        mode={taskForm.mode}
        initialData={editingTask}
        users={users}
        projects={projects}
        loading={loading.tasks}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
};

export default TaskDashboard;
