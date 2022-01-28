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
    }

    async function fetchAnswers() {
        try {
            const {data:res} = await api.get(`/me/training-items/${obj.id}/answers`);
            console.log(res);
            setAnswers(res.data);
        } catch (err) {
            console.log(err);
        }
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
    }

    console.log(answers);

    return (
        <StyledTrainingCard>
            <div>{obj.expression.value}</div>
            {showAnswers && (
                <div>
                    {
                        answers.map((answer, i) => (
                            <div key={i}>{answer.value}</div>
                        ))
                    }
                </div>
            )}
            

        </StyledTrainingCard>
    );
};

TrainingCard.propTypes = {
    obj: PropTypes.object.isRequired,
};

export default TrainingCard;
