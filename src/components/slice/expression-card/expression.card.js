import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import { useSlicesViewContext } from "../slices.view";
import { DETACH_EXPRESSION } from "../slices.const";
import TranslationInput from "./translation.input";
import TranslationRow from "./translation.row";
import ExpressionHeader from "./expression.header";

const StyledExpressionRow = styled.div`
padding: 3px 7px;
border: 1px solid #eee;
border-radius: 2px;
position: relative;

&:hover {
    & > .controls {
        display: flex;
        top: 2px;
        right: 5px;

        span {
            cursor: pointer;
            font-size: 0.9em;
            padding: 0 2px;
        
            &:hover {
                color: #ba3;
            }
        }
    }
}

& > .controls {
    display: none;
    position: absolute;
}

& > .translations {
    position: relative;
    margin-top: 5px;
    border-top: 1px solid #f9f9f9;
}
`;

const ExpressionCard = ({obj, nodeId, isEditable}) => {
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
            <ExpressionHeader expression={obj} />
            <div className="translations">
                {
                    obj.translations && obj.translations.map(trans => (
                        <TranslationRow 
                            key={trans.id} 
                            obj={trans}
                            nodeId={nodeId}
                            expressionId={obj.id}
                            availableTranscriptions={obj.transcriptions}
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
        </StyledExpressionRow>
    );
};

ExpressionCard.propTypes = {
    obj: PropTypes.object.isRequired,
    nodeId: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionCard;
