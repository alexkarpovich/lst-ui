import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import { useSlicesViewContext } from "../slices.view";
import { ATTACH_TRANSLATION } from "../slices.const";
import Input from"../../shared/input";


const StyledTranslationInput = styled.div`
width: 100%;

& > .content {
    position: relative;
    background: #333;
    border-radius: 4px 4px 0 0;

    input {
        margin: 0;
        border-radius: 3px 0 0 0;
        outline: none;
        padding-right: 25px;

        &::placeholder {
            color: #007bff
        }
    }

    & > .close-btn {
        cursor: pointer;
        position: absolute;
        background: rgb(255, 255, 255);
        top: -19px;
        right: 0;
        width: 32px;
        height: 20px;
        text-align: center;
        border-left: 1px solid #e7e7e7;
        border-top: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        border-radius: 5px 5px 0 0;
    }

    & > .attach-translation-btn {
        cursor: pointer;
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 3px;
        border: 1px solid rgb(197, 197, 197);
        text-align: center;
        right: 5px;
        top: 5px;

        &:hover {
            background: rgb(241, 241, 241);
        }

        &:active {
            background: rgb(182, 182, 182);
        }
    }

    & > .popover-content {
        position: absolute;
        background: #fff;
        border-right: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
        border-left: 1px solid #e7e7e7;
        border-radius: 0 0 3px 3px;
        width: 100%;
        z-index: 100;

        & > .translations {
            & > .no-records {
                padding: 7px;
                text-align: center;
                font-size: 0.8em;
                color: #8b8b8b;
            }

            & > .translation-item {
                padding: 7px;

                &:not(:first-child) {
                    border-top: 1px solid #f9f9f9;
                }

                &:hover {
                    cursor: pointer;
                    background-color: #eee;
                }
            }
        }
    }
}

& > .placeholder {
    color: #007bff;
    font-size: 0.8em;
    padding: 7px;
    border: 1px solid #fff;

    &:hover {
        border: 1px solid #eee;
        border-radius: 3px;
    }
}
`;

const TranslationInput = ({expressionId, nodeId}) => {
    const {dispatch} = useSlicesViewContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [translations, setTranslations] = useState([]);

    useEffect(() => {console.log('Translation input mount')}, [])

    useEffect(() => {
        setIsMounted(true);
        isOpen && fetchTranslations();

        return () => (setIsMounted(false));
    }, [isOpen])

    async function fetchTranslations() {
        try {
            const {data:res} = await api.get(`/me/nodes/${nodeId}/translations?expression_id=${expressionId}`);
            isMounted && setTranslations(res.data);
        } catch (err) {
            console.log(err);
        }
    }

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

    return (
        <StyledTranslationInput>
            {isOpen ? (
                <div className="content">
                    <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="+ translation" 
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
                <div className="placeholder" onClick={toggleOpen}>+ translation</div>
            )}
        </StyledTranslationInput>
    );
}

TranslationInput.propTypes = {
    expressionId: PropTypes.number.isRequired,
    nodeId: PropTypes.number.isRequired,
};

export default TranslationInput;
