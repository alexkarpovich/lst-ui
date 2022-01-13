import { SET_FETCHING, SET_VIEW_FETCHING, SET_GROUPS, SET_NODES, SET_GROUPS_NODES, INCREASE_NODE_COUNT } from "./slices.const";


export const slicesReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_VIEW_FETCHING:
            return {...state, isViewFetching: action.payload};
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
        case INCREASE_NODE_COUNT: {
            const {nodeId} = action.payload;
            const nodes = [...state.nodes];

            function mapNodes(items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === nodeId) {
                        items[i].count++;

                        return 1;
                    }

                    if (items[i].children) {
                        const count = mapNodes(items[i].children);
                        items[i].count += count;

                        return count;
                    }
                }

                return 0;
            }

            mapNodes(nodes);

            return {...state, nodes};
        }
        default:
            return state;
    }
};