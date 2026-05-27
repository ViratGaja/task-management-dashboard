import {
  FETCH_TASKS_SUCCESS,
  FETCH_USERS_SUCCESS,
  FETCH_PROJECTS_SUCCESS,
  CREATE_TASK_OPTIMISTIC,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ROLLBACK,
  UPDATE_TASK_OPTIMISTIC,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ROLLBACK,
  DELETE_TASK_OPTIMISTIC,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_ROLLBACK,
} from '../actions/taskActions';

const initialState = {
  tasks: { byId: {}, allIds: [] },
  users: { byId: {}, allIds: [] },
  projects: { byId: {}, allIds: [] },
};

const normalize = (items) => ({
  byId: items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
  allIds: items.map((item) => item.id),
});

export default function entitiesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TASKS_SUCCESS: {
      return { ...state, tasks: normalize(action.payload) };
    }
    case FETCH_USERS_SUCCESS: {
      return { ...state, users: normalize(action.payload) };
    }
    case FETCH_PROJECTS_SUCCESS: {
      return { ...state, projects: normalize(action.payload) };
    }

    case CREATE_TASK_OPTIMISTIC: {
      const task = action.payload;
      return {
        ...state,
        tasks: {
          byId: { ...state.tasks.byId, [task.id]: task },
          allIds: [task.id, ...state.tasks.allIds],
        },
      };
    }
    case CREATE_TASK_SUCCESS: {
      const { task, tempId } = action.payload;
      const { [tempId]: _, ...restById } = state.tasks.byId;
      return {
        ...state,
        tasks: {
          byId: { ...restById, [task.id]: task },
          allIds: state.tasks.allIds.map((id) => (id === tempId ? task.id : id)),
        },
      };
    }
    case CREATE_TASK_ROLLBACK: {
      const tempId = action.payload;
      const { [tempId]: _, ...restById } = state.tasks.byId;
      return {
        ...state,
        tasks: { byId: restById, allIds: state.tasks.allIds.filter((id) => id !== tempId) },
      };
    }

    case UPDATE_TASK_OPTIMISTIC: {
      const { taskId, updates } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          byId: { ...state.tasks.byId, [taskId]: { ...state.tasks.byId[taskId], ...updates } },
        },
      };
    }
    case UPDATE_TASK_SUCCESS: {
      const task = action.payload;
      return {
        ...state,
        tasks: { ...state.tasks, byId: { ...state.tasks.byId, [task.id]: task } },
      };
    }
    case UPDATE_TASK_ROLLBACK: {
      const { taskId, originalTask } = action.payload;
      return {
        ...state,
        tasks: { ...state.tasks, byId: { ...state.tasks.byId, [taskId]: originalTask } },
      };
    }

    case DELETE_TASK_OPTIMISTIC: {
      const taskId = action.payload;
      const { [taskId]: _, ...restById } = state.tasks.byId;
      return {
        ...state,
        tasks: { byId: restById, allIds: state.tasks.allIds.filter((id) => id !== taskId) },
      };
    }
    case DELETE_TASK_SUCCESS:
      return state;
    case DELETE_TASK_ROLLBACK: {
      const task = action.payload;
      return {
        ...state,
        tasks: {
          byId: { ...state.tasks.byId, [task.id]: task },
          allIds: [...state.tasks.allIds, task.id],
        },
      };
    }

    default:
      return state;
  }
}
