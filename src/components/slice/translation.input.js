import React, {useEffect, useState} from "react";
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

    function onInputChange(e) {
        setInputValue(e.target.value);
    }

    function onKeyPress(e) {
        if (e.key === "Enter") {
            handleAttachNew();
        }
    }

    function handleAttachNew() {
        inputValue && attachTranslation({value: inputValue});
    }

    async function attachTranslation(translation) {
        try {
            const {data:res} = await api.post(`/me/nodes/${nodeId}/attach-translation`, {
                expressionId,
                translation
            });
            dispatch({ type: ATTACH_TRANSLATION, payload: {
                expressionId,
                translation: res.data,
            }});
            setInputValue('');
            fetchTranslations();
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

    return (
        <div className="translation-input">
            {isOpen ? (
                <div className="content">
                    <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
                    <input
                        autoFocus
                        type="text"
                        placeholder="+ add translation" 
                        value={inputValue}
                        onChange={onInputChange}
                        onKeyPress={onKeyPress}
                    />
                    <span className="attach-translation-btn" onClick={handleAttachNew}>↵</span>
                    <div className="popover-content">
                        <div className="translations">
                            {
                                translations.length > 0 ? translations.map(trans => (
                                    <div key={trans.id} className="translation-item" onClick={() => attachTranslation({id: trans.id})}>{trans.value}</div>
                                )) : (
                                    <div className="no-records">No existing translations.</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="placeholder" onClick={toggleOpen}>+ add translation</div>
            )}
        </div>
    );
}

TranslationInput.propTypes = {
    expressionId: PropTypes.number.isRequired,
    nodeId: PropTypes.number.isRequired,
};

export default TranslationInput;
