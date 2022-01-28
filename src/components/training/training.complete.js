import React from "react";
import styled from "styled-components";

import {useTrainingContext} from "./training.page";

const StyledTrainingComplete = styled.div`

`;

const TrainingComplete = ({trainingId}) => {
    const {dispatch} = useTrainingContext();

    return (
        <StyledTrainingComplete>
            Training complete
        </StyledTrainingComplete>
    );
};

TrainingComplete.propTypes = {
};

export default TrainingComplete;
