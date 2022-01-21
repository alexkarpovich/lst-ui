import React, { createContext, useEffect, useReducer, useContext, Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import api from "../../utils/api";
import { slicesReducer } from "./slices.reducer";
import { SET_FETCHING, SET_GROUPS, SET_GROUPS_NODES } from "./slices.const";
import SlicesMenu from "./slices.menu";
import SlicesView from "./slices.view";
import { prepareQueryParams } from "./slices.service";


let initialState = {
    isFetching: true,
    groups: [],
    nodes: [],
};

export const SlicesContext = createContext(initialState);

export function useSlicesContext() {
   return useContext(SlicesContext);
}

const StyledSlicesPage = styled.div`
& > .outlet {
    margin-left: 200px;
}

& > .group-select-container {
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
                    groups: groupsRes.data.data,
                    nodes: nodesRes.data.data
                }});
            } else {
                const {data:res} = await api.get('/me/groups');
                dispatch({ type: SET_GROUPS, payload: {
                    groups: res.data
                }});
            }
            
            dispatch({ type: SET_FETCHING, payload: false});
        }

        loadInitialData();
    }, [qp.group])

    return state.isFetching ? 'Fetching...' : (
        <SlicesContext.Provider value={{ ...state, dispatch }}>
            <StyledSlicesPage>
                {qp.group ? (
                    <Fragment>
                        <SlicesMenu 
                            groupId={qp.group}
                            groups={state.groups}
                            nodes={state.nodes}
                            activeNodeIds={qp.ids}
                        />
                        <div className="outlet">
                            <SlicesView activeIds={qp.ids} />
                        </div>
                    </Fragment>
                ) : (
                    <div className="group-select-container">
                        <h3>Select group</h3>

                        <div className="groups-select">
                            {state.groups.map(group => (
                                <div>
                                    <Link key={group.id} to={`/me/slices?group=${group.id}`}>{group.name}</Link>
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
