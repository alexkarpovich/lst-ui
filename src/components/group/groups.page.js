import React, { createContext, useEffect, useState, useReducer, useContext } from "react";

import "./groups.page.scss";
import api from "../../utils/api";
import GroupItem, {MODE_EDITING} from "./group-item";

export const SET_CREATING_MODE = 'SET_CREATING_MODE';
export const LOAD_GROUPS_FETCHING = 'LOAD_GROUPS_FETCHING';
export const LOAD_GROUPS_SUCCESS = 'LOAD_GROUPS_SUCCESS';
export const DELETE_GROUP = 'DELETE_GROUP';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_MEMBER = 'ADD_MEMBER';

let initialState = {
    isFetching: true,
    isCreatingMode: false,
    groups: []
};

export const GroupsContext = createContext(initialState);

export function useGroupsContext() {
   return useContext(GroupsContext);
}

function groupsReducer(state, action) {
    switch (action.type) {
        case SET_CREATING_MODE:
            return {...state, isCreatingMode: action.payload}
        case LOAD_GROUPS_FETCHING:
            return {...state, isFetching: true};
        case LOAD_GROUPS_SUCCESS:
            return {...state, isFetching: false, groups: action.payload};
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
                if (group.id == groupId) {
                    group.members.push(member);
                }

                return group;
            });

            return {...state, groups};
        }
        
        default:
            return state;
    }
}

const GroupsPage = () => {
    const [state, dispatch] = useReducer(groupsReducer, initialState);

    useEffect(() => {
        let isMounted = true;

        async function loadGroups() {
            dispatch({ type: LOAD_GROUPS_FETCHING });

            const {data:res} = await api.get('/me/group');
            console.log(res, isMounted);

            isMounted && dispatch({ type: LOAD_GROUPS_SUCCESS, payload: res.data});
        }

        loadGroups();

        return () => (isMounted = false);
    }, [])

    console.log(state);

    return (
        <GroupsContext.Provider value={{ ...state, dispatch }}>
            <div className="groups-page">
                <h3>Group list</h3>
                {state.isCreatingMode ? (
                    <GroupItem key="-1" defaultMode={MODE_EDITING}/>
                    ) : (
                    <button className="button add-new" onClick={() => dispatch({type: SET_CREATING_MODE, payload: true})}>+ new group</button>
                )}

                {
                    state.groups.map(group => (
                        <GroupItem key={group.id} obj={group} />
                    ))
                }
                
            </div>
        </GroupsContext.Provider>
    );
};

export default GroupsPage;
