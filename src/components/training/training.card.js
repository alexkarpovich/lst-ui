import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {useEventListener} from "../../hooks/event-listener";

const StyledTrainingCard = styled.div`

`;

const TrainingCard = ({obj}) => {
    const handler = ({ key , ...rest}) => {
        console.log(key, rest);
        if (key === ' ') {
            console.log('SPACE');
        }
        // if (ESCAPE_KEYS.includes(String(key))) {
        //   console.log("Escape key pressed!");
        // }
    };
    useEventListener("keydown", handler);
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
