import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import { useSlicesViewContext } from "../slices.view";
import { DETACH_EXPRESSION } from "../slices.const";
import TranslationInput from "./translation.input";
import TranslationRow from "./translation.row";

const StyledExpressionRow = styled.div`
display: table-row;

.col {
    display: table-cell;
    border-bottom: 1px solid #eee;
    padding: 5px;

    &.index {
        width: 20px;
        font-size: 0.7em;
        color: #aaa;
    }

    &.target {
        width: 120px;
        vertical-align: top;

        & > .value {
            font-family: "KaiTi";
            font-size: 1.5em;
        }
        & > .transcriptions {
            padding-left: 2px;
        
            & > .tsc-item {
                position: relative;
                cursor: pointer;
                color: #007bff;
                font-size: 0.8em;
        
                &:not(:first-child) {
                    margin-left: 7px;
        
                    &::after {
                        content: ",";
                        position: absolute;
                        top: 0;
                        left: -7px;
                    }
                }
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .translations {
        position: relative;
    }

    & > .controls {
        display: none;
        position: absolute;
    }
}
`;

const ExpressionRow = ({index, obj, nodeId, isEditable}) => {
    const {dispatch} = useSlicesViewContext();

    async function detach() {
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/detach-expression/${obj.id}`);
            console.log(res);
            dispatch({type: DETACH_EXPRESSION, payload: {
                expressionId: obj.id,
            }});
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <StyledExpressionRow>
            <div className="col index">{index}</div>
            <div className="col target">
                <div className="value">{obj.value}</div>
                <div className="transcriptions">
                    {obj.transcriptions?.map(t => (
                        <span key={t.id} className="tsc-item">{t.value}</span>
                    ))}
                </div>
            </div>
            <div className="col">
                <div className="translations">
                    {
                        obj.translations && obj.translations.map(trans => (
                            <TranslationRow 
                                key={trans.id} 
                                obj={trans}
                                nodeId={nodeId}
                                expressionId={obj.id}
                                availableTranscriptions={obj.transcriptions || []}
                                isEditable={isEditable} 
                            />
                        ))
                    }
                    {isEditable && (
                        <TranslationInput 
                            expressionId={obj.id} 
                            nodeId={nodeId}
                        />
                    )}
                </div>
                <div className="controls">
                    {isEditable && (
                        <span onClick={detach}>×</span>
                    )}
                </div>
            </div>

        </StyledExpressionRow>
    );
};

ExpressionRow.propTypes = {
    index: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
    nodeId: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionRow;
