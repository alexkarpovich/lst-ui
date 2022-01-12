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

            function mapNodes(node) {
                if (node.id === nodeId) {
                    node.count++;
                }

                if (node.children) {
                    node.children = node.children.map(mapNodes);
                }

                return node;
            }

            const nodes = state.nodes.map(mapNodes);

            return {...state, nodes};
        }
        default:
            return state;
    }
};