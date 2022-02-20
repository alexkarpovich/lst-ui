import React, { useState, forwardRef, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import { useSlicesViewContext } from "../slices.view";
import { DETACH_EXPRESSION } from "../slices.const";
import TranslationInput from "./translation.input";
import TranslationRow from "./translation.row";
import TranscriptionEditor from "./transcription.editor";

const StyledExpressionRow = styled.tr`
border-bottom: 1px solid #eee;

td {
    padding: 5px;
    width: 100%;

    &:not(:first-child) {
        vertical-align: top;
    }

    &.index {
        width: 20px;
        & > div {
            display: flex;
            height: 100%;
            flex-direction: column;
            justify-content: space-between;

            & > .value {
                font-size: 0.7em;
                color: #aaa;
            }

            & > .expand-subrow {
                cursor: pointer;
            }
        }
    }

    &.target {
        width: 120px;
        white-space: nowrap;

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

const StyledExpressionSubrow = styled.tr`
border-bottom: 1px solid #eee;

& > .controls {
    .detach {
        font-size: 0.8em;
        color: red;
        cursor: pointer;
    }
}
`;

const ExpressionRow = forwardRef(({index, style, obj, nodeId, isEditable}, ref) => {
    const {dispatch} = useSlicesViewContext();
    const [showSubrow, setShowSubrow] = useState(false);

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
        <Fragment>
            <StyledExpressionRow ref={ref}>
                <td className="index">
                    <div>
                        <div className="value">{index}</div>
                        <div className="expand-subrow" onClick={() => setShowSubrow(true)}>+</div>
                    </div>
                </td>
                <td className="target">
                    <div className="value">{obj.value}</div>
                    <div className="transcriptions">
                        {obj.transcriptions?.map(t => (
                            <span key={t.id} className="tsc-item">{t.value}</span>
                        ))}
                    </div>
                </td>
                <td>
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
                </td>
            </StyledExpressionRow>
            {showSubrow && (
                <StyledExpressionSubrow>
                    <td colSpan={3}>
                        <div className="controls">
                            {isEditable && (
                                <span className="detach" onClick={detach}>detach</span>
                            )}
                        </div>
                        <TranscriptionEditor 
                            expression={obj}
                        />
                    </td>
                </StyledExpressionSubrow>
            )}
        </Fragment>
    );
});

ExpressionRow.propTypes = {
    index: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
    nodeId: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionRow;
