import React, { createContext, useEffect, useReducer, useContext, Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import "./slices.page.scss";
import api from "../../utils/api";
import { slicesReducer } from "./slices.reducer";
import { SET_FETCHING, SET_GROUPS, SET_GROUPS_NODES } from "./slices.const";
import SlicesMenu from "./slices.menu";
import SlicesView from "./slices.view";


let initialState = {
    isFetching: true,
    groups: [],
    nodes: [],
};

export const SlicesContext = createContext(initialState);

export function useSlicesContext() {
   return useContext(SlicesContext);
}

const SlicesPage = () => {
    const [searchParams] = useSearchParams();
    const [state, dispatch] = useReducer(slicesReducer, initialState);
    const groupId = +searchParams.get('group');
    const activeNodeIds = JSON.parse(searchParams.get('ids') || '[]');


    useEffect(() => {
        console.log('slices page', groupId);
        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true});
            
            if (groupId) {
                const [groupsRes, nodesRes] = await axios.all([
                    api.get('/me/groups'),
                    api.get(`/me/groups/${groupId}/nodes`)
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
    }, [groupId])

    console.log('Page', activeNodeIds);

    return state.isFetching ? 'Fetching...' : (
        <SlicesContext.Provider value={{ ...state, dispatch }}>
            <div className="slices-page">
                {groupId ? (
                    <Fragment>
                        <SlicesMenu 
                            groupId={groupId}
                            groups={state.groups}
                            nodes={state.nodes}
                            activeNodeIds={activeNodeIds}
                        />
                        <div className="outlet">
                            <SlicesView activeIds={activeNodeIds} />
                        </div>
                    </Fragment>
                ) : (
                    <div className="group-select-container">
                        <h3>Select group</h3>

                        <div className="groups-select">
                            {state.groups.map(group => (
                                <Link key={group.id} to={`/me/slices?group=${group.id}`}>{group.name}</Link>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
        </SlicesContext.Provider>
    );
};

export default SlicesPage;
