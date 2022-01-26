import {SET_FETCHING, SET_TRAINING, SET_TRAINING_AND_ITEM} from "./training.const.js";


export const trainingReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_TRAINING: {
            return {...state, isFetching: false, training: action.payload}
        }
        case SET_TRAINING_AND_ITEM: {
            return {...state, isFetching: false, ...action.payload};
        }
        default:
            return state;
    }
};