import React, {createContext, useContext, useEffect, useReducer} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import api from "../../utils/api";
import { SET_FETCHING } from "../slice/slices.const";
import { SET_TRAINING, SET_TRAINING_AND_ITEM } from "./training.const";
import {trainingReducer} from "./training.reducer";
import TrainingCard from "./training.card";

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

.card-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TrainingPage = () => {
    const {id} = useParams();
    const [state, dispatch] = useReducer(trainingReducer, initialState);

    useEffect(() => {
        console.log('training did mount', id);
        async function fetchTraining() {
            dispatch({type: SET_FETCHING, payload: true});
            try {
                const [trainingRes, trainingItemRes] = await axios.all([
                    api.get(`/me/trainings/${id}`),
                    api.get(`/me/trainings/${id}/next`)
                ]);
                dispatch({type: SET_TRAINING_AND_ITEM, payload: {
                    training: trainingRes.data.data,
                    item: trainingItemRes.data.data,
                }});
            } catch (err) {
                console.log(err);
            }
        }

        fetchTraining();
    }, [id])

    return state.isFetching ? 'Fetching...' : (
        <TrainingContext.Provider value={{ ...state, dispatch }}>
            <StyledTrainingPage>
                <div className="progress">
                    Progress
                </div>
                <div className="card-container">
                    <TrainingCard obj={state.item} />
                </div>
            </StyledTrainingPage>
        </TrainingContext.Provider>
    );
};

export default TrainingPage;
