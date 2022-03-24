/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react";
import styled from "styled-components";
import {convertToRaw} from "draft-js";

import api from "../../utils/api";
import {TextEditor} from "../shared/text-editor";

const StyledTextView = styled.div``;

const TextView = () => {
    useEffect(() => {

    });

    async function onSave(editorState) {
        const state = convertToRaw(editorState.getCurrentContent());
        console.log(state);
    }

    return (
        <StyledTextView>
            <TextEditor onSave={onSave} />
        </StyledTextView>
    );
};

export default TextView;
