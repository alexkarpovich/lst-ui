import React, { useState } from "react";
import PropTypes from "prop-types";
import CreatableSelect from 'react-select/creatable';
import { createSearchParams } from "react-router-dom";

import "./slices.view.scss";
import api from "../../utils/api";
import { useSlicesContext } from "./slices.page";
import { ATTACH_EXPRESSION, INCREASE_NODE_COUNT } from "./slices.const";
import { useSlicesViewContext } from "./slices.view";

const SearchBar = ({nodeId}) => {
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
        <div className="search-bar">
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
    );
};

SearchBar.propTypes = {
    nodeId: PropTypes.number.isRequired,
};

export default SearchBar;
