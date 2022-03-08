/* eslint-disable react/no-multi-comp */
import React from "react";
import styled from "styled-components";
import {TextEditor} from "../shared/text-editor";

const StyledTextView = styled.div``;

const TextView = () => {
    return (
        <StyledTextView>
            <TextEditor />
        </StyledTextView>
    );
};

export default TextView;
