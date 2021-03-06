import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/index';
import rootSaga from '../saga/rootSaga';

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(sagaMiddleware),
    );

    sagaMiddleware.run(rootSaga);

    return store;
}

export default configureStore;
