import { createSelector } from 'reselect';

const getEntities = (state) => state.entities;
const getUi = (state) => state.ui;
const getOptimistic = (state) => state.optimistic;

export const selectAllTasks = createSelector(
  getEntities,
  (entities) => entities.tasks.allIds.map((id) => entities.tasks.byId[id])
);

export const selectAllUsers = createSelector(
  getEntities,
  (entities) => entities.users.allIds.map((id) => entities.users.byId[id])
);

export const selectAllProjects = createSelector(
  getEntities,
  (entities) => entities.projects.allIds.map((id) => entities.projects.byId[id])
);

export const selectFilters = (state) => state.ui.filters;

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilters,
  (tasks, filters) => {
    return tasks.filter((task) => {
      if (filters.projectId && task.projectId !== filters.projectId) return false;
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
      if (filters.status && filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.taskType && filters.taskType !== 'all' && task.taskType !== filters.taskType) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return task.title?.toLowerCase().includes(s) || task.description?.toLowerCase().includes(s);
      }
      return true;
    });
  }
);

export const selectTaskFormState = (state) => state.ui.taskForm;
export const selectLoading = (state) => state.ui.loading;
export const selectErrors = (state) => state.ui.errors;
export const selectPendingCreates = (state) => state.optimistic.pendingCreates;
export const selectPendingDeletes = (state) => state.optimistic.pendingDeletes;

export const selectTaskById = (state, taskId) => state.entities.tasks.byId[taskId];
