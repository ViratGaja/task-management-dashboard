import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import entitiesReducer from './reducers/entitiesReducer';
import uiReducer from './reducers/uiReducer';
import optimisticReducer from './reducers/optimisticReducer';
import rootSaga from './sagas/taskSagas';

const rootReducer = combineReducers({
  entities: entitiesReducer,
  ui: uiReducer,
  optimistic: optimisticReducer,
});

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  collapsed: true,
  diff: true,
  duration: true,
  predicate: () => process.env.NODE_ENV === 'development',
});

const composeEnhancers =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger))
);

sagaMiddleware.run(rootSaga);

export default store;
