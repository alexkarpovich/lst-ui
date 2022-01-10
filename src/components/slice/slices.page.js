import React, { createContext, useEffect, useReducer, useContext, Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import "./slices.page.scss";
import api from "../../utils/api";
import { slicesReducer } from "./slices.reducer";
import { SET_FETCHING, SET_GROUPS, SET_GROUPS_SLICES } from "./slices.const";
import SlicesMenu from "./slices.menu";


let initialState = {
    isFetching: true,
    groups: [],
    slices: [],
};

export const SlicesContext = createContext(initialState);

export function useSlicesContext() {
   return useContext(SlicesContext);
}

const SlicesPage = () => {
    const [searchParams] = useSearchParams();
    const [state, dispatch] = useReducer(slicesReducer, initialState);
    const groupId = +searchParams.get('group');
    const activeSliceIds = JSON.parse(searchParams.get('slices') || '[]');

    useEffect(() => {
        async function loadInitialData() {
            dispatch({ type: SET_FETCHING, payload: true});
            
            if (groupId) {
                const [groupsRes, slicesRes] = await axios.all([
                    api.get('/me/group'),
                    api.get(`/me/group/${groupId}/slice`)
                ]);
                dispatch({ type: SET_GROUPS_SLICES, payload: {
                    groups: groupsRes.data.data,
                    slices: slicesRes.data.data
                }});
            } else {
                const {data:res} = await api.get('/me/group');
                dispatch({ type: SET_GROUPS, payload: {
                    groups: res.data
                }});
            }
            
            dispatch({ type: SET_FETCHING, payload: false});
        }

        loadInitialData();
    }, [groupId])

    return (
        <SlicesContext.Provider value={{ ...state, dispatch }}>
            <div className="slices-page">
                {groupId ? (
                    <Fragment>
                        <SlicesMenu 
                            groupId={groupId}
                            groups={state.groups}
                            slices={state.slices}
                            activeSliceIds={activeSliceIds}
                        />
                        <div className="outlet">
                            Content
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
