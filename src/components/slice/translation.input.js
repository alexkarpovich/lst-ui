import React, {Fragment, useEffect, useState} from "react";
import PropTypes from "prop-types";

import api from "../../utils/api";
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

    function onInputChange(e) {
        setInputValue(e.target.value);
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
        <div className="translation-input">
            {isOpen ? (
                <div>
                    <div>
                        Top control
                    </div>
                    <input
                        autoFocus
                        type="text"
                        placeholder="+ add translation" 
                        value={inputValue} 
                        onChange={onInputChange} 
                    />

                    <div className="translations">
                        {translations.map(trans => (
                            <div>{trans.value}</div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="placeholder" onClick={toggleOpen}>+ add transltion</div>
            )}
        </div>
    );
}

TranslationInput.propTypes = {
    expressionId: PropTypes.number.isRequired,
    nodeId: PropTypes.number.isRequired,
};

export default TranslationInput;
