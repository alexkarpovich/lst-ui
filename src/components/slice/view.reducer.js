import { SET_VIEW_FETCHING, SET_VIEW_DATA, ATTACH_EXPRESSION } from "./slices.const";


export const slicesViewReducer = (state, action) => {
    switch (action.type) {
        case SET_VIEW_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_VIEW_DATA: {
            return {...state, isFetching: false, ...action.payload};
        }
        case ATTACH_EXPRESSION: {
            const expressions = [action.payload, state.expressions];

            return {...state, expressions};
        }
        default:
            return state;
    }
};