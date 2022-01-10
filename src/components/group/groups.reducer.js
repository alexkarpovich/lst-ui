import { 
    SET_CREATING_MODE, SET_GROUPS, SET_LANGS, SET_GROUPS_LANGS, DELETE_GROUP, 
    ADD_GROUP, ADD_MEMBER, SET_FETCHING 
} from "./groups.const";

export const groupsReducer = (state, action) => {
    switch (action.type) {
        case SET_CREATING_MODE:
            return {...state, isCreatingMode: action.payload}
        case SET_FETCHING:
            return {...state, isFetching: action.payload};
        case SET_GROUPS:
            return {...state, groups: action.payload};
        case SET_LANGS:
            return {...state, langs: action.payload};
        case SET_GROUPS_LANGS:
            const {groups, langs} = action.payload;
            return {...state, groups, langs};
        case DELETE_GROUP: {
            const {groupId} = action.payload;
            const groups = state.groups.filter(group => group.id !== groupId)
            
            return {...state, groups};
        }
        case ADD_GROUP: {
            const {group} = action.payload;
            const groups = [group, ...state.groups];

            return {...state, groups, isCreatingMode: false};
        }
        case ADD_MEMBER: {
            const {groupId, member} = action.payload;
            const groups = state.groups.map(group => {
                if (group.id === groupId) {
                    group.members.push(member);
                }

                return group;
            });

            return {...state, groups};
        }
        
        default:
            return state;
    }
};