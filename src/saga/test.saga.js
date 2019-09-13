import {
    takeEvery,
    delay,
    put,
} from 'redux-saga/effects';

function* fetchData(action) {
    try {
        yield delay(1000);
        yield put({
            type: 'FETCH_REQUEST_SUCCESS',
            data: 'test',
        });
    } catch(error) {
        yield put({
            type: 'FETCH_REQUEST_FAILED',
            error: 'error',
        });
    }
}

export default function* testSaga() {
    yield takeEvery('FETCH_REQUEST', fetchData);
};
