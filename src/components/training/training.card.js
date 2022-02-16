import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../utils/api";
import {useEventListener} from "../../hooks/event-listener";
import {useTrainingContext} from "./training.page";
import {SET_TRAINING_ITEM, INCREASE_COMPLETE_COUNT} from "./training.const";
import {isComplete} from "./training.service";

const StyledTrainingCard = styled.div`
font-size: 1.4em;
margin-top: 20vh;
text-align: center;

.expression {
    padding: 7px;
    color: ${({showAnswer}) => showAnswer ? '#aaa' : '#000'};
    border-top: 1px solid ${({showAnswer}) => showAnswer ? '#eee' : 'transparent'};
}

.answer-container {
    display: flex;
    justify-content: center;

    .answer {
        padding: 7px;

        &:not(:first-child) {
            border-left: 1px solid #eee;
        }

        .value {
            font-family: "KaiTi";
            font-size: 1.7em;
            color: #000;
        }

        .transcriptions {
            font-size: 0.7em;
            color: ${({theme}) => theme.colors.linkColor};
        }
    }
}

`;

const TrainingCard = ({obj}) => {
    const {training, dispatch} = useTrainingContext();
    const [showAnswers, setShowAnswers] = useState(false);
    const [answers, setAnswers] = useState([]);

    useEventListener("keydown", (event) => {
        if (event.key === ' ') {
            if (showAnswers) {
                if (event.shiftKey) {
                    next();
                } else {
                    complete()
                }
            } else {
                fetchAnswers();
            }
        }
    });
    async function next() {
        try {
            const {data:res} = await api.get(`/me/trainings/${obj.trainingId}/next`);
            dispatch({type: SET_TRAINING_ITEM, payload: res.data});
        } catch (err) {
            console.log(err);
            dispatch({type: SET_TRAINING_ITEM, payload: null});
        }
        setShowAnswers(false);
    }

    async function fetchAnswers() {
        try {
            const {data:res} = await api.get(`/me/training-items/${obj.id}/answers`);
            setAnswers(res.data);
        } catch (err) {
            console.log(err);
        }
        setShowAnswers(true);
    }

    async function complete() {
        const {completeCount} = training.meta;

        try {
            await api.post(`/me/training-items/${obj.id}/complete`);
            dispatch({type: INCREASE_COMPLETE_COUNT});

            if (isComplete({...training.meta, completeCount: completeCount + 1})) {
                dispatch({type: SET_TRAINING_ITEM, payload: null});
            } else {
                await next();
            }
        } catch (err) {
            console.log(err);
        }
        setShowAnswers(false);
    }

    return (
        <StyledTrainingCard showAnswer={showAnswers}>
            {showAnswers && (
                <div className="answer-container">
                    {
                        answers.map((answer, i) => (
                            <div key={i} className="answer">
                                <div className="value">{answer.value}</div>
                                <div className="transcriptions">
                                    {
                                        answer.transcriptions?.map(tsc => (
                                            <span key={tsc.id}>{tsc.value}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
            <div className="expression">{obj.expression.value}</div>
        </StyledTrainingCard>
    );
};

TrainingCard.propTypes = {
    obj: PropTypes.object.isRequired,
};

export default TrainingCard;
