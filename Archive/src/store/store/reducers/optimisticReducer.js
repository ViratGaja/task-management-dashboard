import {
  CREATE_TASK_OPTIMISTIC, CREATE_TASK_SUCCESS, CREATE_TASK_ROLLBACK,
  UPDATE_TASK_OPTIMISTIC, UPDATE_TASK_SUCCESS, UPDATE_TASK_ROLLBACK,
  DELETE_TASK_OPTIMISTIC, DELETE_TASK_SUCCESS, DELETE_TASK_ROLLBACK,
} from '../actions/taskActions';

const initialState = { pendingCreates: [], pendingUpdates: {}, pendingDeletes: [] };

export default function optimisticReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TASK_OPTIMISTIC:
      return { ...state, pendingCreates: [...state.pendingCreates, action.payload.id] };
    case CREATE_TASK_SUCCESS:
    case CREATE_TASK_ROLLBACK:
      return { ...state, pendingCreates: state.pendingCreates.filter(id => id !== action.payload.tempId || action.payload) };

    case UPDATE_TASK_OPTIMISTIC:
      return { ...state, pendingUpdates: { ...state.pendingUpdates, [action.payload.taskId]: action.payload.updates } };
    case UPDATE_TASK_SUCCESS:
    case UPDATE_TASK_ROLLBACK: {
      const { [action.payload.taskId || action.payload.id]: _, ...rest } = state.pendingUpdates;
      return { ...state, pendingUpdates: rest };
    }

    case DELETE_TASK_OPTIMISTIC:
      return { ...state, pendingDeletes: [...state.pendingDeletes, action.payload] };
    case DELETE_TASK_SUCCESS:
    case DELETE_TASK_ROLLBACK:
      return { ...state, pendingDeletes: state.pendingDeletes.filter(id => id !== (action.payload.id || action.payload)) };

    default:
      return state;
  }
}
