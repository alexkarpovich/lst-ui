import React, { createContext, memo, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { createSearchParams } from "react-router-dom";
import { Plock } from "react-plock";
import styled from "styled-components";

import api from "../../utils/api";
import { SET_VIEW_FETCHING, SET_VIEW_DATA } from "./slices.const";
import { slicesViewReducer } from "./view.reducer";
import ToolBar from "./toolbar";
import ExpressionCard from "./expression-card/expression.card";
import { useSlicesContext } from "./slices.page";

let initialState = {
    isFetching: true,
    showTranslationTranscriptions: false,
    expressions: []
};

export const SlicesViewContext = createContext(initialState);

export function useSlicesViewContext() {
   return useContext(SlicesViewContext);
}

const StyledSlicesView = styled.div`
padding: 10px;

.expressions {
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
            <StyledSlicesView>
                <ToolBar
                    nodeIds={activeNodes}
                    isEditable={isEditable}
                />
                <Plock nColumns={2} gap={2} className="expressions">
                    {state.expressions.map(expr => (
                        <ExpressionCard
                            key={expr.id} 
                            obj={expr}
                            nodeId={activeNodes[0]}
                            isEditable={isEditable}
                        />
                    ))}
                </Plock>
            </StyledSlicesView>
        </SlicesViewContext.Provider>
    );
};

SlicesView.propTypes = {};

export default SlicesView;
