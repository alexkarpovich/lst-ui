import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import {useSlicesViewContext} from "../slices.view";
import {DETACH_TRANSLATION} from "../slices.const";


const StyledTranslationRow = styled.div`
padding: 2px;
margin-left: 10px;
font-size: 0.9em;
color: #444;

&::before {
    content: "-";
    color: #b1b1b1;
    position: absolute;
    left: 0;
}

&:hover {
    background: #f9f9f9;

    & > .controls {
        display: inherit;
    }
}

& > .controls {
    display: none;
    float: right;

    & > * {
        cursor: pointer;
    }
}
`;

const TranslationRow = ({obj, nodeId, expressionId, isEditable}) => {
    const {dispatch} = useSlicesViewContext();

    async function detach() {
        console.log('detach translation', obj.id);
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/detach-translation/${obj.id}`);
            console.log('detach t', res);
            dispatch({type: DETACH_TRANSLATION, payload: {
                expressionId,
                translationId: obj.id,
            }})
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledTranslationRow>
            <span>{obj.value}</span>
            {isEditable && (
                <div className="controls">
                    <span onClick={detach}>✕</span>
                </div>
            )}
        </StyledTranslationRow>
    );
};

TranslationRow.propTypes = {
    isEditable: PropTypes.bool.isRequired,
    nodeId: PropTypes.number.isRequired,
    expressionId: PropTypes.number.isRequired,
    obj: PropTypes.object.isRequired,
};

export default TranslationRow;
