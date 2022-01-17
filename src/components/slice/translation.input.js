import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/creatable";

import api from "../../utils/api";
import { selectStyles, Dropdown } from "../shared/dropdown-button";
import { createSearchParams } from "react-router-dom";
import { useSlicesViewContext } from "./slices.view";
import { ATTACH_TRANSLATION } from "./slices.const";

const TranslationInput = ({expressionId, nodeId}) => {
    const {dispatch} = useSlicesViewContext();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [translations, setTranslations] = useState([]);

    useEffect(() => {
        isOpen && fetchTranslations();
    }, [isOpen])

    function toggleOpen() {
        setIsOpen(prev => !prev);
    }

    function onSelectChange(selected) {
        toggleOpen();
        attachTranslation({id: selected.id});
    }

    function onInputChange(value) {
        setInputValue(value);
    }

    function onCreateOption(value) {
        console.log(value);
        attachTranslation({value});
    }

    async function attachTranslation(translation) {
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/attach-translation`, {
                expressionId,
                translation
            });
            console.log(res);
            dispatch({ type: ATTACH_TRANSLATION, payload: {
                expressionId,
                translation: res.data,
            }});
        } catch (err) {
            console.log(err)
        }
    }

    async function fetchTranslations() {
        try {
            const {data:res} = await api.get(`/me/nodes/${nodeId}/translations?expression_id=${expressionId}`);
            console.log(res);
            setTranslations(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    console.log(nodeId, expressionId);

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={toggleOpen}
            trigger={<span onClick={toggleOpen}>+ add translation</span>}
        >
            <CreatableSelect
                autoFocus
                menuIsOpen
                backspaceRemovesValue={false}
                components={{ IndicatorSeparator: null }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                onChange={onSelectChange}
                onInputChange={onInputChange}
                onCreateOption={onCreateOption}
                options={translations}
                //placeholder="Search..."
                styles={selectStyles}
                tabSelectsValue={false}
                getOptionLabel={option => option.value}
                getOptionValue={option => option.id}
                //value={value}
            />
        </Dropdown>
    );
}

TranslationInput.propTypes = {
    expressionId: PropTypes.number.isRequired,
    nodeId: PropTypes.number.isRequired,
};

export default TranslationInput;
