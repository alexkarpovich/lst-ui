import { SET_FETCHING, SET_GROUPS, SET_NODES, SET_GROUPS_NODES } from "./slices.const";

export const slicesReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_NODES: {
            const {nodes} = action.payload;

            return {...state, nodes};
        }
        case SET_GROUPS: {
            const {groups} = action.payload;

            return {...state, groups};
        }
        case SET_GROUPS_NODES: {
            const {groups, nodes} = action.payload;

            return {...state, groups, nodes};
        }
        default:
            return state;
    }
};