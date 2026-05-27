// Task Action Types
export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_PROJECTS_REQUEST = 'FETCH_PROJECTS_REQUEST';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE = 'FETCH_PROJECTS_FAILURE';

export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
export const CREATE_TASK_OPTIMISTIC = 'CREATE_TASK_OPTIMISTIC';
export const CREATE_TASK_ROLLBACK = 'CREATE_TASK_ROLLBACK';

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE';
export const UPDATE_TASK_OPTIMISTIC = 'UPDATE_TASK_OPTIMISTIC';
export const UPDATE_TASK_ROLLBACK = 'UPDATE_TASK_ROLLBACK';

export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE';
export const DELETE_TASK_OPTIMISTIC = 'DELETE_TASK_OPTIMISTIC';
export const DELETE_TASK_ROLLBACK = 'DELETE_TASK_ROLLBACK';

// Action Creators
export const fetchTasksRequest = (filters = {}) => ({ type: FETCH_TASKS_REQUEST, payload: filters });
export const fetchTasksSuccess = (tasks) => ({ type: FETCH_TASKS_SUCCESS, payload: tasks });
export const fetchTasksFailure = (error) => ({ type: FETCH_TASKS_FAILURE, payload: error });

export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });
export const fetchUsersSuccess = (users) => ({ type: FETCH_USERS_SUCCESS, payload: users });
export const fetchUsersFailure = (error) => ({ type: FETCH_USERS_FAILURE, payload: error });

export const fetchProjectsRequest = () => ({ type: FETCH_PROJECTS_REQUEST });
export const fetchProjectsSuccess = (projects) => ({ type: FETCH_PROJECTS_SUCCESS, payload: projects });
export const fetchProjectsFailure = (error) => ({ type: FETCH_PROJECTS_FAILURE, payload: error });

export const createTaskRequest = (taskData) => ({ type: CREATE_TASK_REQUEST, payload: taskData });
export const createTaskOptimistic = (task) => ({ type: CREATE_TASK_OPTIMISTIC, payload: task });
export const createTaskSuccess = (task, tempId) => ({ type: CREATE_TASK_SUCCESS, payload: { task, tempId } });
export const createTaskFailure = (error, tempId) => ({ type: CREATE_TASK_FAILURE, payload: { error, tempId } });
export const createTaskRollback = (tempId) => ({ type: CREATE_TASK_ROLLBACK, payload: tempId });

export const updateTaskRequest = (taskId, updates) => ({ type: UPDATE_TASK_REQUEST, payload: { taskId, updates } });
export const updateTaskOptimistic = (taskId, updates) => ({ type: UPDATE_TASK_OPTIMISTIC, payload: { taskId, updates } });
export const updateTaskSuccess = (task) => ({ type: UPDATE_TASK_SUCCESS, payload: task });
export const updateTaskFailure = (error, taskId, originalTask) => ({ type: UPDATE_TASK_FAILURE, payload: { error, taskId, originalTask } });
export const updateTaskRollback = (taskId, originalTask) => ({ type: UPDATE_TASK_ROLLBACK, payload: { taskId, originalTask } });

export const deleteTaskRequest = (taskId) => ({ type: DELETE_TASK_REQUEST, payload: taskId });
export const deleteTaskOptimistic = (taskId) => ({ type: DELETE_TASK_OPTIMISTIC, payload: taskId });
export const deleteTaskSuccess = (taskId) => ({ type: DELETE_TASK_SUCCESS, payload: taskId });
export const deleteTaskFailure = (error, taskId) => ({ type: DELETE_TASK_FAILURE, payload: { error, taskId } });
export const deleteTaskRollback = (task) => ({ type: DELETE_TASK_ROLLBACK, payload: task });
