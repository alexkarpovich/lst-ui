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

let initialState = {
    isFetching: true,
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

const SlicesView = ({activeIds}) => {
    const [state, dispatch] = useReducer(slicesViewReducer, initialState);
    const isEditable = activeIds.length === 1;
    const prefix = activeIds.join('');

    useEffect(() => {
        console.log('slices view active node ids', activeIds);
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
    }, [prefix])

    return state.isFetching ? 'Fetching...' : (
        <SlicesViewContext.Provider value={{ ...state, dispatch }}>
            <StyledSlicesView>
                <ToolBar
                    nodeIds={activeIds}
                    isEditable={isEditable}
                />
                <Plock nColumns={2} gap={2} className="expressions">
                    {state.expressions.map(expr => (
                        <ExpressionCard
                            key={`${prefix}_${expr.id}`} 
                            obj={expr}
                            nodeId={activeIds[0]}
                            isEditable={isEditable}
                        />
                    ))}
                </Plock>
            </StyledSlicesView>
        </SlicesViewContext.Provider>
    );
};

SlicesView.propTypes = {
    activeIds: PropTypes.array.isRequired,
};

export default SlicesView;
