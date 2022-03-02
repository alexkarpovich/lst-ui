import React, {createContext, useContext, useEffect, useReducer} from "react";
import {createSearchParams} from "react-router-dom";
import styled from "styled-components";

import api from "../../utils/api";
import { SET_VIEW_FETCHING, SET_VIEW_DATA } from "./slices.const";
import { slicesViewReducer } from "./view.reducer";
import { useSlicesContext } from "./slices.page";
import ToolBar from "./toolbar";
import ExpressionTable from "./expression-table/expression.table";
import EmptyNodeView from "./empty-node.view";
import TextView from "./text-view";

let initialState = {
    isFetching: true,
    showTranslationTranscriptions: false,
    subrowObjectId: null,
    expressions: []
};

export const SlicesViewContext = createContext(initialState);

export function useSlicesViewContext() {
   return useContext(SlicesViewContext);
}

const StyledSlicesView = styled.div`
padding: 10px;
height: 100%;

.expression-table {
    max-width: 860px;
}
`;

const SlicesView = () => {
    const {activeNodes} = useSlicesContext();
    const [state, dispatch] = useReducer(slicesViewReducer, initialState);
    const isEditable = activeNodes.length === 1;
    const prefix = activeNodes.join('');

    useEffect(() => {
        console.log('slices view active node ids', activeNodes);
        async function loadData() {
            dispatch({type: SET_VIEW_FETCHING, payload: true});
            try {
                const queryString = createSearchParams({ids: activeNodes});
                const {data:res} = await api.get(`/me/nodes?${queryString}`);
                
                dispatch({type: SET_VIEW_DATA, payload: res.data});
            } catch (err) {
                console.log(err);
            }
        }

        if (activeNodes.length) {
            loadData();
        } else {
            dispatch({type: SET_VIEW_FETCHING, payload: false});   
        }
    }, [prefix])

    return state.isFetching ? 'Fetching...' : (
        <SlicesViewContext.Provider value={{ ...state, dispatch }}>
            {activeNodes.length ? (
                <StyledSlicesView>
                    <ToolBar
                        nodeIds={activeNodes}
                        isEditable={isEditable}
                    />
                    <TextView />
                    {state.expressions && (
                        <ExpressionTable 
                            nodeId={activeNodes[0]}
                            expressions={state.expressions}
                            isEditable={isEditable}
                        />
                    )}
                </StyledSlicesView>
            ) : (
                <EmptyNodeView />
            )}
        </SlicesViewContext.Provider>
    );
};

SlicesView.propTypes = {};

export default SlicesView;
