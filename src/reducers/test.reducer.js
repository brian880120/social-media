const testReducer = (state = 0, action) => {
    switch(action.type) {
        case 'FETCH_REQUEST_SUCCESS':
            console.log(action.data);
            return state;
        case 'FETCH_REQUEST_FAILED':
            return state;
        default:
            return state;
    }
}

export default testReducer;
