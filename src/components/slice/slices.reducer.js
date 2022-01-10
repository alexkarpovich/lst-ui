import { SET_FETCHING, SET_GROUPS, SET_SLICES, SET_GROUPS_SLICES } from "./slices.const";

export const slicesReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_SLICES: {
            const {slices} = action.payload;

            return {...state, slices};
        }
        case SET_GROUPS: {
            const {groups} = action.payload;

            return {...state, groups};
        }
        case SET_GROUPS_SLICES: {
            const {groups, slices} = action.payload;

            return {...state, groups, slices};
        }
        default:
            return state;
    }
};