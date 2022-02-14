import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import {useSlicesViewContext} from "../slices.view";
import {DETACH_TRANSLATION, ATTACH_TRANSLATION_TRANSCRIPTION, DETACH_TRANSLATION_TRANSCRIPTION} from "../slices.const";


const StyledTranslationRow = styled.div`
position: relative;
padding: 2px;
margin-left: 10px;
font-size: 0.9em;
color: #444;

&::before {
    content: "-";
    color: #b1b1b1;
    position: absolute;
    left: -7px;
}

&:hover {
    & > .controls {
        display: inherit;
    }
}

& > .transcriptions {
    & > .tsc-item {
        cursor: pointer;
        font-size: 0.8em;
        border: 1px solid #e7e7e7;
        padding: 1px 5px;
        border-radius: 10px;

        &:hover {
            border: 1px solid #f5f5f5;
        }

        &.active {
            border: 1px solid ${({theme}) => theme.colors.linkColor};
            color: ${({theme}) => theme.colors.linkColor};
        }

        &:not(:first-child) {
            margin-left: 3px;
        }
    }
}

& > .controls {
    display: none;
    position: absolute;
    right: 0;
    top: 3px;

    & > * {
        cursor: pointer;
    }
}
`;

const TranslationRow = ({obj, nodeId, expressionId, availableTranscriptions, isEditable}) => {
    const {showTranslationTranscriptions, dispatch} = useSlicesViewContext();

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

    const toggleTranscription = (transcription, notSelected) => async () => {
        const url = `/translations/${obj.id}/transcriptions/${transcription.id}`;
        try {
            if (notSelected) {
                await api.post(url);
                dispatch({type: ATTACH_TRANSLATION_TRANSCRIPTION, payload: {
                    expressionId: expressionId,
                    translationId: obj.id,
                    transcription,
                }})
            } else {
                await api.delete(url);
                dispatch({type: DETACH_TRANSLATION_TRANSCRIPTION, payload: {
                    expressionId: expressionId,
                    translationId: obj.id,
                    transcription,
                }})
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledTranslationRow>
            <span>{obj.value}</span>
            {showTranslationTranscriptions && (
                <div className="transcriptions">
                    {availableTranscriptions.map(t => {
                        const notSelected = !obj.transcriptions || obj.transcriptions.find(tr => tr.id === t.id) === undefined;
                        return (
                            <span 
                                key={t.id} 
                                className={`tsc-item ${notSelected ? '' : 'active'}`} 
                                onClick={toggleTranscription(t, notSelected)}
                            >
                                {t.value}
                            </span>
                        )
                    })}
                </div>
            )}
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
