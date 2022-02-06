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
    & > .controls {
        display: inherit;
    }
}

& > .transcriptions {
    & > .tsc-item {
        cursor: pointer;
        font-size: 0.7em;
        background: #e7e7e7;
        padding: 3px 7px;
        border-radius: 10px;

        &:hover {
            background: #f5f5f5;
        }
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

const TranslationRow = ({obj, nodeId, expressionId, availableTranscriptions, isEditable}) => {
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

    const applyTranscription = (transcriptionId) => async () => {
        try {
            const {data:res} = api.post(`/translations/${obj.id}/transcriptions/${transcriptionId}`);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledTranslationRow>
            <span>{obj.value}</span>
            <div className="transcriptions">
                {availableTranscriptions.map(t => (
                    <span className="tsc-item" onClick={applyTranscription(t.id)}>{t.value}</span>
                ))}
            </div>
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
    availableTranscriptions: PropTypes.array.isRequired,
};

export default TranslationRow;
