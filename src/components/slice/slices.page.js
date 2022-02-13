import React, { createContext, useEffect, useReducer, useContext, Fragment } from "react";
import { Link, createSearchParams, useSearchParams } from "react-router-dom";
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
display: flex;
height: 100%;

& > .outlet {
    width: 100%;
    height: 100hv;
    overflow-y: auto;
}

& > .group-select-container {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;  

    & > .groups-select {
        width: 50%;
        padding: 20px;
        border: 1px solid #c3c3c3;
        border-radius: 7px;
    }
}
`;

const SlicesPage = () => {
    const [searchParams] = useSearchParams();
    const [state, dispatch] = useReducer(slicesReducer, initialState);
    const qp = prepareQueryParams(searchParams);

    useEffect(() => {
        console.log('Slices page group change', qp.group);
        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true});
            
            if (qp.group) {
                const [groupsRes, nodesRes] = await axios.all([
                    api.get('/me/groups'),
                    api.get(`/me/groups/${qp.group}/nodes`)
                ]);
                dispatch({ type: SET_GROUPS_NODES, payload: {
                    groupId: +qp.group,
                    allGroups: groupsRes.data.data,
                    allNodes: nodesRes.data.data,
                    activeNodes: qp.ids,
                }});
            } else {
                const {data:res} = await api.get('/me/groups');
                dispatch({ type: SET_GROUPS, payload: {
                    groupId: +qp.group,
                    allGroups: res.data
                }});
            }
            
            dispatch({ type: SET_FETCHING, payload: false});
        }

        loadInitialData();
    }, [qp.group])

    useEffect(() => {
        window.history.replaceState(null, null, `?group=${state.activeGroup.id}&ids=[${state.activeNodes.join(',')}]`)
    }, [state.activeNodes.join('')]);

    return state.isFetching ? 'Fetching...' : (
        <SlicesContext.Provider value={{ ...state, dispatch }}>
            <StyledSlicesPage>
                {state.activeGroup?.id ? (
                    <Fragment>
                        <SlicesMenu />
                        <div className="outlet">
                            <SlicesView />
                        </div>
                    </Fragment>
                ) : (
                    <div className="group-select-container">
                        <h3>Select group</h3>

                        <div className="groups-select">
                            {state.allGroups.map(group => (
                                <div key={group.id}>
                                    <Link to={`/me/slices?group=${group.id}`}>{group.name}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
            </StyledSlicesPage>
        </SlicesContext.Provider>
    );
};

export default SlicesPage;
