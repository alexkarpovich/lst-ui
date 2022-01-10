import React, { createContext, useEffect, useReducer, useContext } from "react";
import { useParams } from "react-router-dom";
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
    const {groupId} = useParams();
    const [state, dispatch] = useReducer(slicesReducer, initialState);

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
                <SlicesMenu 
                    groupId={groupId ? +groupId : null}
                    groups={state.groups}
                    slices={state.slices} 
                />
                <div className="outlet">
                    Content
                </div>
            </div>
        </SlicesContext.Provider>
    );
};

export default SlicesPage;
