import React, { useState } from "react";
import PropTypes from "prop-types";
import CreatableSelect from 'react-select/creatable';
import { createSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import api from "../../utils/api";
import { useSlicesContext } from "./slices.page";
import { ATTACH_EXPRESSION, EXERCISE_DIRECT, EXERCISE_CYCLES, INCREASE_NODE_COUNT } from "./slices.const";
import { useSlicesViewContext } from "./slices.view";


const StyledToolBar = styled.div`
display: flex;
align-items: center;
padding: 10px;

.training-items {
    * {
        padding: 7px;
    }
}

.searchbar {
    width: 70%;
}

`;

const ToolBar = ({nodeId, isEditable}) => {
    const navigate = useNavigate();
    const {dispatch} = useSlicesContext();
    const {dispatch:dispatchView} = useSlicesViewContext();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    async function loadOptions(search) {
        if (search === '') {
            return
        }

        try {
            const queryString = createSearchParams({
                lang: 'zh',
                search
            });
            const {data:res} = await api.get(`/x?${queryString}`);

            setOptions(res.data ? [res.data] : []);
        } catch (err) {
            console.log(err)
        }
    }

    async function attachExpression(expr) {
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/attach-expression`, expr);
            dispatchView({type: ATTACH_EXPRESSION, payload: res.data});
            dispatch({type: INCREASE_NODE_COUNT, payload: {nodeId}});
        } catch (err) {
            console.log(err)
        }
    }

    async function doExercise(type) {
        try {
            const {data:res} = await api.post(`/me/trainings`, {
                type,
                slices: [],
            });
            console.log(res);
            navigate(`/me/trainings/${res.data.id}`);
        } catch (err) {
            console.log(err);
        }
    }

    function handleInputChange(value) {
        setInputValue(value);
        loadOptions(value);
    }

    function handleSelectChange(expr) {
        if (!expr) {
            return
        }

        attachExpression({id: expr.id});
    }

    function handleCreateOption(value) {
        attachExpression({value});
    }

    return (
        <StyledToolBar>
            {isEditable && (
                <div className="searchbar">
                    <CreatableSelect
                        isClearable
                        // isDisabled={isLoading}
                        // isLoading={isLoading}
                        components={{ DropdownIndicator: null }}
                        options={options}
                        placeholder="Type expression..."
                        value={inputValue}
                        onChange={handleSelectChange}
                        onInputChange={handleInputChange}
                        onCreateOption={handleCreateOption}
                        getOptionLabel={option => option.value}
                        getOptionValue={option => option.id}
                    />
                </div>
            )}
            <div className="training-items">
                <span onClick={() => doExercise(EXERCISE_DIRECT)}>Through</span>
                <span onClick={() => doExercise(EXERCISE_CYCLES)}>Cycles</span>
            </div>
        </StyledToolBar>
    );
};

ToolBar.propTypes = {
    nodeId: PropTypes.number.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ToolBar;
