import React, { createContext, useEffect, useState, useReducer, useContext, Fragment } from "react";
import { Link, createSearchParams, useSearchParams, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import api from "../../utils/api";
import { slicesReducer } from "./slices.reducer";
import { SET_FETCHING, SET_GROUPS, SET_GROUPS_NODES, MENU_MODE_DEFAULT } from "./slices.const";
import SlicesMenu from "./menu/menu";
import SlicesView from "./slices.view";
import { prepareQueryParams } from "./slices.service";


let initialState = {
    isFetching: true,
    activeGroup: {},
    activeNodes: [],
    allGroups: [],
    allNodes: [],
    menuMode: MENU_MODE_DEFAULT,
    nodeSelection: [],
};

export const SlicesContext = createContext(initialState);

export function useSlicesContext() {
   return useContext(SlicesContext);
}

const StyledSlicesPage = styled.div`
& > .outlet {
    margin-left: 200px;
}
`;

const SlicesPage = () => {
    const {groupId} = useParams();
    const [searchParams] = useSearchParams();
    const [state, dispatch] = useReducer(slicesReducer, initialState);
    const [menuWidth, setMenuWidth] = useState(200);
    const qp = prepareQueryParams(searchParams);

    useEffect(() => {
        console.log('Slices page group change', groupId);
        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true});
            
            const [groupsRes, nodesRes] = await axios.all([
                api.get('/me/groups'),
                api.get(`/me/groups/${groupId}/nodes`)
            ]);
            dispatch({ type: SET_GROUPS_NODES, payload: {
                groupId: +groupId,
                allGroups: groupsRes.data.data,
                allNodes: nodesRes.data.data,
                activeNodes: qp.ids,
            }});
        }

        loadInitialData();
    }, [groupId])

    useEffect(() => {
        window.history.replaceState(null, null, `?ids=[${state.activeNodes.join(',')}]`)
    }, [state.activeNodes.join('')]);

    return state.isFetching ? 'Fetching...' : (
        <SlicesContext.Provider value={{ ...state, dispatch }}>
            <StyledSlicesPage>
                <SlicesMenu 
                    width={menuWidth} 
                    onWidthChange={w => setMenuWidth(w)}
                />

                <div className="outlet">
                    <SlicesView />
                </div>
            </StyledSlicesPage>
        </SlicesContext.Provider>
    );
};

export default SlicesPage;
