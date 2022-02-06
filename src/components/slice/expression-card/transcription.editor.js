import React, {useState, useEffect} from "react";
import styled from "styled-components";

import api from "../../../utils/api";
import Input from "../../shared/input";

const StyledTranscriptionEditor = styled.div`
margin-bottom: 5px;

& > .transc-options {
    display: flex;
    margin-bottom: 5px;

    & > .transc-column {
        display: flex;
        flex-direction: column;
        text-align: center;
    
        &:not(:first-child) {
            margin-left: 5px;
        }
    
        & > .word {
            font-family: "KaiTi";
            font-size: 1.5em;
        }
    
        & > *:not(:first-child) {
            background: #ddd;
            border-radius: 5px;
            font-size: 0.8em;
        }
    }
}
& > .input-container {
    position: relative;

    & > .add-transcription-btn {
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
}
`;

const TranscriptionEditor = ({expression}) => {
    const [transcMap, setTranscMap] = useState({});
    const [transcInput, setTranscInput] = useState(expression.value);

    useEffect(() => {
        async function loadTranscriptionParts() {
            try {
                const {data:res} = await api.get(`/x/${expression.id}/transcription-parts?type=${1}`);
                console.log(res);
                res.data && setTranscMap(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        loadTranscriptionParts();
    }, []);

    function handleTranscChange(e) {
        setTranscInput(e.target.value);
    }

    function handleAddNew() {
        console.log('add new transcription');
        try {
            const {data:res} = api.post(`/x/${expression.id}/transcriptions`, {
                type: 1,
                value: transcInput.trim(),
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const applyWordTranscription = (word, transcription) => () => {
        setTranscInput(prev => prev.replaceAll(word, `${transcription} `));
    }

    return (
        <StyledTranscriptionEditor>
            <div className="transc-options">
                {expression.value.split('').map((item, i) => (
                    <div key={i} className="transc-column">
                        <span className="word">{item}</span>
                        {item in transcMap && transcMap[item].map(t => (
                            <span onClick={applyWordTranscription(item, t.value)}>{t.value}</span>
                        ))}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <Input value={transcInput} onChange={handleTranscChange} />
                <span className="add-transcription-btn" onClick={handleAddNew}>↵</span>
            </div>
        </StyledTranscriptionEditor>
    );
};

export default TranscriptionEditor;