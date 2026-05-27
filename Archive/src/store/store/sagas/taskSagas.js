import { call, put, takeLatest, takeEvery, select, delay } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { mockApi } from '../../api/mockApi';
import {
  FETCH_TASKS_REQUEST, FETCH_USERS_REQUEST, FETCH_PROJECTS_REQUEST,
  CREATE_TASK_REQUEST, UPDATE_TASK_REQUEST, DELETE_TASK_REQUEST,
  fetchTasksSuccess, fetchTasksFailure,
  fetchUsersSuccess, fetchUsersFailure,
  fetchProjectsSuccess, fetchProjectsFailure,
  createTaskOptimistic, createTaskSuccess, createTaskRollback,
  updateTaskOptimistic, updateTaskSuccess, updateTaskRollback,
  deleteTaskOptimistic, deleteTaskSuccess, deleteTaskRollback,
} from '../actions/taskActions';
import { setLoading, setError, clearError } from '../actions/uiActions';
import { selectTaskById } from '../selectors';

// Retry helper
function* withRetry(fn, args, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return yield call(fn, ...args);
    } catch (err) {
      if (i === retries) throw err;
      yield delay(1000 * (i + 1));
    }
  }
}

function* fetchTasksSaga(action) {
  yield put(setLoading('tasks', true));
  yield put(clearError('tasks'));
  try {
    const response = yield call(withRetry, mockApi.fetchTasks.bind(mockApi), [action.payload]);
    yield put(fetchTasksSuccess(response.data));
  } catch (err) {
    yield put(fetchTasksFailure(err.message));
    yield put(setError('tasks', err.message));
  } finally {
    yield put(setLoading('tasks', false));
  }
}

function* fetchUsersSaga() {
  try {
    const response = yield call(mockApi.fetchUsers.bind(mockApi));
    yield put(fetchUsersSuccess(response.data));
  } catch (err) {
    yield put(fetchUsersFailure(err.message));
  }
}

function* fetchProjectsSaga() {
  try {
    const response = yield call(mockApi.fetchProjects.bind(mockApi));
    yield put(fetchProjectsSuccess(response.data));
  } catch (err) {
    yield put(fetchProjectsFailure(err.message));
  }
}

function* createTaskSaga(action) {
  const tempId = `temp_${uuidv4()}`;
  const optimisticTask = {
    ...action.payload,
    id: tempId,
    status: 'Todo',
    createdAt: new Date().toISOString(),
    _isPending: true,
  };

  yield put(createTaskOptimistic(optimisticTask));
  yield put(setLoading('tasks', true));
  yield put(clearError('form'));

  try {
    const response = yield call(mockApi.createTask.bind(mockApi), action.payload);
    yield put(createTaskSuccess(response.data, tempId));
    localStorage.removeItem('taskFormDraft');
  } catch (err) {
    yield put(createTaskRollback(tempId));
    yield put(setError('form', err.message));
  } finally {
    yield put(setLoading('tasks', false));
  }
}

function* updateTaskSaga(action) {
  const { taskId, updates } = action.payload;
  const originalTask = yield select(selectTaskById, taskId);

  yield put(updateTaskOptimistic(taskId, updates));

  try {
    const response = yield call(mockApi.updateTask.bind(mockApi), taskId, updates);
    yield put(updateTaskSuccess(response.data));
  } catch (err) {
    yield put(updateTaskRollback(taskId, originalTask));
    yield put(setError('form', err.message));
  }
}

function* deleteTaskSaga(action) {
  const taskId = action.payload;
  const originalTask = yield select(selectTaskById, taskId);

  yield put(deleteTaskOptimistic(taskId));

  try {
    yield call(mockApi.deleteTask.bind(mockApi), taskId);
    yield put(deleteTaskSuccess(taskId));
  } catch (err) {
    yield put(deleteTaskRollback(originalTask));
    yield put(setError('tasks', err.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeEvery(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeEvery(FETCH_PROJECTS_REQUEST, fetchProjectsSaga);
  yield takeEvery(CREATE_TASK_REQUEST, createTaskSaga);
  yield takeEvery(UPDATE_TASK_REQUEST, updateTaskSaga);
  yield takeEvery(DELETE_TASK_REQUEST, deleteTaskSaga);
}
