import {INCREASE_COMPLETE_COUNT, SET_FETCHING, SET_TRAINING, RESET_TRAINING, SET_TRAINING_AND_ITEM, SET_TRAINING_ITEM} from "./training.const.js";


export const trainingReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_TRAINING: {
            return {...state, isFetching: false, training: action.payload}
        }
        case RESET_TRAINING: {
            const meta = {...state.training.meta, completeCount: 0};
            const training = {...state.training, meta};

            return {...state, training}
        }
        case SET_TRAINING_AND_ITEM: {
            return {...state, isFetching: false, ...action.payload};
        }
        case SET_TRAINING_ITEM: {
            return {...state, item: action.payload};
        }
        case INCREASE_COMPLETE_COUNT: {
            const meta = {...state.training.meta};
            meta.completeCount++;
            let training = {...state.training, meta};

            return {...state, training};
        }
        default:
            return state;
    }
};