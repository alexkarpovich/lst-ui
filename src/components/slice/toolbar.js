import React, { useState } from "react";
import PropTypes from "prop-types";
import CreatableSelect from 'react-select/creatable';
import { createSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import api from "../../utils/api";
import { useSlicesContext } from "./slices.page";
import { ATTACH_EXPRESSION, INCREASE_NODE_COUNT } from "./slices.const";
import { TYPE_CYCLES, TYPE_DIRECT } from "../training/training.const";
import { useSlicesViewContext } from "./slices.view";

const StyledToolBar = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;
max-width: 860px;

.training-items {
    * {
        padding: 7px;
    }
}

.searchbar {
    width: 100%;
}

`;

const ToolBar = ({nodeIds, isEditable}) => {
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
        const nodeId = nodeIds[0];
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
                slices: nodeIds,
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
                <span onClick={() => doExercise(TYPE_DIRECT)}>Direct</span>
                <span onClick={() => doExercise(TYPE_CYCLES)}>Cycles</span>
            </div>
        </StyledToolBar>
    );
};

ToolBar.propTypes = {
    nodeIds: PropTypes.array.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default ToolBar;
