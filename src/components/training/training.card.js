import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../utils/api";
import {useEventListener} from "../../hooks/event-listener";
import {useTrainingContext} from "./training.page";
import { SET_TRAINING_ITEM } from "./training.const";

const StyledTrainingCard = styled.div`
font-size: 1.4em;
`;

const TrainingCard = ({obj}) => {
    const {dispatch} = useTrainingContext();

    useEventListener("keydown", (event) => {
        if (event.key === ' ') {
            if (event.shiftKey) {
                next();
            } else {
                complete()
            }
        }
    });
    async function next() {
        try {
            const {data:res} = await api.get(`/me/trainings/${obj.trainingId}/next`);
            console.log(res);
            dispatch({type: SET_TRAINING_ITEM, payload: res.data});
        } catch (err) {
            console.log(err);
        }
    }

    async function complete() {
        try {
            await api.post(`/me/training-items/${obj.id}/complete`);
            await next();            
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <StyledTrainingCard>
            {obj.expression.value}
        </StyledTrainingCard>
    );
};

TrainingCard.propTypes = {
    obj: PropTypes.object.isRequired,
};

export default TrainingCard;
