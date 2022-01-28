import React, {createContext, useContext, useEffect, useReducer} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import api from "../../utils/api";
import { SET_FETCHING } from "../slice/slices.const";
import { SET_TRAINING, SET_TRAINING_ITEM } from "./training.const";
import {trainingReducer} from "./training.reducer";
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
}

.card-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
`;

const TrainingPage = () => {
    const {id} = useParams();
    const [state, dispatch] = useReducer(trainingReducer, initialState);
    const steps = [
        {progress: 100},
        {progress: 35},
    ];

    useEffect(() => {
        console.log('training did mount', id);
        async function fetchTraining() {
            dispatch({type: SET_FETCHING, payload: true});
            try {
                const {data:trainingRes} = await api.get(`/me/trainings/${id}`);
                dispatch({type: SET_TRAINING, payload: trainingRes.data});
                
                const {data:itemRes} = await api.get(`/me/trainings/${id}/next`);
                dispatch({type: SET_TRAINING_ITEM, payload: itemRes.data});
            } catch (err) {
                dispatch({type: SET_FETCHING, payload: false});
                console.log(err);
            }
        }

        fetchTraining();
    }, [id])

    async function reset() {
        try {
            await api.post(`/me/trainings/${id}/reset`);
            const {data:res} = await api.post(`/me/trainings/${id}/next`);
            dispatch({type: SET_TRAINING, payload: res.data});
        } catch (err) {
            console.log(err);
        }
    }

    return state.isFetching ? 'Fetching...' : (
        <TrainingContext.Provider value={{ ...state, dispatch }}>
            <StyledTrainingPage>
                <div className="header">
                    <span className="icon-reset" onClick={reset} />
                    <Stepper steps={steps} />
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
