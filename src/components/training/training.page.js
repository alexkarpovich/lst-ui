import React, {createContext, useContext, useEffect, useMemo, useState, useReducer, useRef} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";

import api from "../../utils/api";
import {RESET_TRAINING, SET_FETCHING, SET_TRAINING, SET_TRAINING_ITEM} from "./training.const";
import {trainingReducer} from "./training.reducer";
import {isComplete, prepereSteps} from "./training.service";
import TrainingCard from "./training.card";
import TrainingComplete from "./training.complete";
import Stepper from "../shared/stepper";

let initialState = {
    isFetching: true,
    training: null,
    item: null,
};

export const TrainingContext = createContext(initialState);

export function useTrainingContext() {
   return useContext(TrainingContext);
}

const StyledTrainingPage = styled.div`
height: 100%;
width: 100%;
display: flex;
flex-direction: column;

.header {
    display: flex;
    justify-content: center;
    padding: 10px;
}

.card-container {
    height: 100%;
    display: flex;
    align-items: baseline;
    justify-content: center;
}
`;

const TrainingPage = () => {
    const {id} = useParams();
    const headerRef = useRef();
    const [headerWidth, setHeaderWidth] = useState(0);
    const [state, dispatch] = useReducer(trainingReducer, initialState);
    const steps = useMemo(() => prepereSteps(state.training?.meta), [JSON.stringify(state.training)]);

    useEffect(() => {
        async function fetchTraining() {
            dispatch({type: SET_FETCHING, payload: true});
            try {
                const {data:trainingRes} = await api.get(`/me/trainings/${id}`);
                dispatch({type: SET_TRAINING, payload: trainingRes.data});
                
                if (!isComplete(trainingRes.data.meta)) {
                    const {data:itemRes} = await api.get(`/me/trainings/${id}/next`);
                    dispatch({type: SET_TRAINING_ITEM, payload: itemRes.data});
                }
            } catch (err) {
                dispatch({type: SET_FETCHING, payload: false});
                console.log(err);
            }
        }

        fetchTraining();
    }, [id])

    useEffect(() => {
        if (headerRef.current) {
            setHeaderWidth(headerRef.current.clientWidth);
        }
    }, [headerRef.current]);

    async function reset() {
        try {
            await api.post(`/me/trainings/${id}/reset`);
            const {data:res} = await api.get(`/me/trainings/${id}/next`);
            dispatch({type: RESET_TRAINING});
            dispatch({type: SET_TRAINING_ITEM, payload: res.data});
        } catch (err) {
            console.log(err);
        }
    }

    return state.isFetching ? 'Fetching...' : (
        <TrainingContext.Provider value={{ ...state, dispatch }}>
            <StyledTrainingPage>
                <div ref={headerRef} className="header">
                    {headerWidth && (
                        <Stepper 
                            steps={steps}
                            width={headerWidth}
                            onResetClick={reset} 
                        />
                    )}
                </div>
                <div className="card-container">
                    {state.item ? (
                        <TrainingCard obj={state.item} />
                    ) : (
                        <TrainingComplete />
                    )}
                    
                </div>
            </StyledTrainingPage>
        </TrainingContext.Provider>
    );
};

export default TrainingPage;
