import React, { createContext, useEffect, useReducer, useContext } from "react";
import axios from "axios";
import styled from "styled-components";

import api from "../../utils/api";
import { SET_CREATING_MODE, SET_FETCHING, SET_GROUPS_LANGS } from "./groups.const";
import { groupsReducer } from "./groups.reducer";
import Button from "../shared/button";
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

const StyledGroupPage = styled.div`
padding: 15px;

& > .add-new {
    width: 120px;
}
`;

const GroupsPage = () => {
    const [state, dispatch] = useReducer(groupsReducer, initialState);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true });

            const [groupsRes, langsRes] = await axios.all([
                api.get('/me/groups'),
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
            <StyledGroupPage>
                <h3>Group list</h3>
                {state.isCreatingMode ? (
                    <GroupItem key="-1" defaultMode={MODE_EDITING}/>
                    ) : (
                    <Button className="add-new" onClick={() => dispatch({type: SET_CREATING_MODE, payload: true})}>+ new group</Button>
                )}

                {
                    state.groups.map(group => (
                        <GroupItem key={group.id} obj={group} />
                    ))
                }
                
            </StyledGroupPage>
        </GroupsContext.Provider>
    );
};

export default GroupsPage;
