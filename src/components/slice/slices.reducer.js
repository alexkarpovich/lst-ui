import { 
    SET_FETCHING, SET_VIEW_FETCHING, SET_GROUPS, SET_NODES, SET_GROUPS_NODES, 
    INCREASE_NODE_COUNT, UPDATE_NODE, ADD_NODE, RENAME_NODE, DELETE_NODE, 
    EDIT_NODE_MODE, SET_ACTIVE_NODES, SET_MENU_MODE, SELECTION_TOGGLE_NODE, 
    MENU_MODE_DEFAULT, SELECT_ALL_NODES, CANCEL_SELECTION_MODE,
} from "./slices.const";
import { getNestedNodeIds } from "./slices.service";

function mapNodes(items, cmpFunc, editFunc) {
    for (let i = 0; i < items.length; i++) {
        if (cmpFunc(items[i])) {
            items[i] = editFunc(items[i]);
        }

        if (items[i].children) {
            mapNodes(items[i].children, cmpFunc, editFunc);
        }
    }
}

function getNodeIds(ids, nodes, all=false) {
    let result = [];

    for (let i = 0; i < nodes.length; i++) {
        if (all || ids.indexOf(nodes[i].id) !== -1) {
            result = result.concat(getNestedNodeIds(nodes[i]));
        }
        
        if (nodes[i].children) {
            result = result.concat(getNodeIds(ids, nodes[i].children, all));
        }
    }

    return result;
}

export const slicesReducer = (state, action) => {
    switch (action.type) {
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_VIEW_FETCHING:
            return {...state, isViewFetching: action.payload};
        case SET_NODES: {
            const {allNodes} = action.payload;

            return {...state, allNodes: allNodes || []};
        }
        case SET_GROUPS: {
            const {groupId, allGroups} = action.payload;
            const activeGroup = allGroups.find(g => g.id === groupId);

            return {...state, activeGroup, allGroups};
        }
        case SET_GROUPS_NODES: {
            const {groupId, allGroups, allNodes, activeNodes} = action.payload;
            const activeGroup = allGroups.find(g => g.id === groupId);

            return {
                ...state,
                isFetching: false,
                activeGroup, 
                allGroups, 
                allNodes: allNodes || [], 
                activeNodes, 
            };
        }
        case SET_ACTIVE_NODES: {
            const ids = getNodeIds(action.payload, state.allNodes);

            return {...state, activeNodes: ids};
        }
        case INCREASE_NODE_COUNT: {
            const {nodeId} = action.payload;
            const allNodes = [...state.allNodes];

            // function mapNodes(items) {
            //     for (let i = 0; i < items.length; i++) {
            //         if (items[i].id === nodeId) {
            //             items[i].count++;

            //             return 1;
            //         }

            //         if (items[i].children) {
            //             const count = mapNodes(items[i].children);
            //             items[i].count += count;

            //             return count;
            //         }
            //     }

            //     return 0;
            // }

            // mapNodes(nodes);

            return {...state, allNodes};
        }
        case UPDATE_NODE: {
            const {id, ...rest} = action.payload;
            const allNodes = [...state.allNodes];

            mapNodes(allNodes, 
                (item) => (item.id === id),
                (node) => ({...node, ...rest, editMode: false}));

            return {...state, allNodes};
        }
        case ADD_NODE: {
            const {parentId, node} = action.payload;
            let allNodes = [...state.allNodes];

            if (parentId === null) {
                allNodes.push(node);
            } else {
                allNodes = [...state.allNodes];
                
                mapNodes(allNodes, 
                    (item) => (item.id === parentId),
                    (item) => {
                        item.children.push(node);

                        return item;
                    })
            }
            
            return {...state, allNodes};
        }
        case EDIT_NODE_MODE: {
            const {nodeId} = action.payload;
            const allNodes = [...state.allNodes];

            mapNodes(allNodes, 
                (item) => (item.id === nodeId),
                (item) => {
                    item.editMode = true;
                    return item;
                })

            return {...state, allNodes};
        }
        case RENAME_NODE: {
            const {nodeId, name} = action.payload;
            const allNodes = [...state.allNodes];
            
            mapNodes(allNodes, 
                (item) => (item.id === nodeId),
                (item) => {
                    item.isEditing = false;
                    item.name = name;
                    
                    return item;
                })

            return {...state, allNodes};
        }
        case DELETE_NODE: {
            const {nodeId} = action.payload;
            const allNodes = state.allNodes.filter(node => node.id !== nodeId);
            
            return {...state, allNodes};
        }
        case SET_MENU_MODE: {
            const menuMode = action.payload;

            if (menuMode === MENU_MODE_DEFAULT) {
                return {...state, menuMode, activeNodes: state.nodeSelection};
            } else {
                return {...state, menuMode, nodeSelection: state.activeNodes};
            }
        }
        case CANCEL_SELECTION_MODE: {
            return {...state, menuMode: MENU_MODE_DEFAULT};
        }
        case SELECT_ALL_NODES: {
            const allIds = getNodeIds([], state.allNodes, true);

            return {...state, nodeSelection: allIds};
        }
        case SELECTION_TOGGLE_NODE: {
            let nodeSelection;
            const nodeId = action.payload;
            const ids = getNodeIds([nodeId], state.allNodes);

            if (state.nodeSelection.indexOf(nodeId) !== -1) {
                nodeSelection = state.nodeSelection.filter(i => ids.indexOf(i) === -1);
            } else {
                nodeSelection = state.nodeSelection.concat(ids);
            }

            return {...state, nodeSelection}
        }
        default:
            return state;
    }
};