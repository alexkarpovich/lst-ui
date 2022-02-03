import React, {useState, useEffect} from "react";
import styled from "styled-components";

import api from "../../../utils/api";

const StyledTranscriptionEditor = styled.div`
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
`;

const TranscriptionEditor = ({expression}) => {
    const [transcMap, setTranscMap] = useState({});

    useEffect(() => {
        async function loadTranscriptionParts() {
            try {
                const {data:res} = await api.get(`/x/${expression.id}/transcription-parts?type=${1}`);
                console.log(res);
                setTranscMap(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        loadTranscriptionParts();
    }, []);

    return (
        <StyledTranscriptionEditor>
            {expression.value.split('').map((item, i) => (
                <div key={i} className="transc-column">
                    <span className="word">{item}</span>
                    {item in transcMap && transcMap[item].map(t => (
                        <span>{t.value}</span>
                    ))}
                </div>
            ))}
        </StyledTranscriptionEditor>
    );
};

export default TranscriptionEditor;