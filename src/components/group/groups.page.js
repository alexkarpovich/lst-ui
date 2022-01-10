import React, { createContext, useEffect, useReducer, useContext } from "react";
import axios from "axios";

import "./groups.page.scss";
import api from "../../utils/api";
import { SET_CREATING_MODE, SET_FETCHING, SET_GROUPS_LANGS } from "./groups.const";
import { groupsReducer } from "./groups.reducer";
import GroupItem, {MODE_EDITING} from "./group-item";


let initialState = {
    isFetching: true,
    isCreatingMode: false,
    groups: [],
    langs: [],
};

export const GroupsContext = createContext(initialState);

export function useGroupsContext() {
   return useContext(GroupsContext);
}

const GroupsPage = () => {
    const [state, dispatch] = useReducer(groupsReducer, initialState);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true });

            const [groupsRes, langsRes] = await axios.all([
                api.get('/me/group'),
                api.get('/langs')
            ]);

            if (isMounted) {
                dispatch({ type: SET_GROUPS_LANGS, payload: {
                    groups: groupsRes.data.data,
                    langs: langsRes.data.data
                }});
            }
        }

        loadInitialData();

        return () => (isMounted = false);
    }, [])

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
