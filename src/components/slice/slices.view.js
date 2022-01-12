import React, { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { createSearchParams } from "react-router-dom";

import "./slices.view.scss";
import api from "../../utils/api";
import { SET_VIEW_FETCHING, SET_VIEW_DATA } from "./slices.const";
import { slicesViewReducer } from "./view.reducer";
import SearchBar from "./search-bar";

let initialState = {
    isFetching: true,
    expressions: []
};

export const SlicesViewContext = createContext(initialState);

export function useSlicesViewContext() {
   return useContext(SlicesViewContext);
}

const SlicesView = ({activeIds}) => {
    const [state, dispatch] = useReducer(slicesViewReducer, initialState);

    useEffect(() => {
        console.log('view ids', activeIds);
        async function loadData() {
            dispatch({type: SET_VIEW_FETCHING, payload: true});
            try {
                const queryString = createSearchParams({ids: activeIds});
                const {data:res} = await api.get(`/me/nodes?${queryString}`);
                
                dispatch({type: SET_VIEW_DATA, payload: res.data});
            } catch (err) {
                console.log(err);
            }
        }

        if (activeIds.length) {
            loadData();
        } else {
            dispatch({type: SET_VIEW_FETCHING, payload: false});   
        }
    }, [activeIds])

    console.log('view root', state);

    return state.isFetching ? 'Fetching...' : (
        <SlicesViewContext.Provider value={{ ...state, dispatch }}>
            <div className="slices-view">
                {activeIds.length === 1 && (
                    <SearchBar nodeId={activeIds[0]} />
                )}

                <div className="expressions">
                    {state.expressions.map(expr => (
                        <div key={expr.id}>{expr.value}</div>
                    ))}
                </div>
            </div>
        </SlicesViewContext.Provider>
    );
};

SlicesView.propTypes = {
    activeIds: PropTypes.array.isRequired,
};

export default SlicesView;
