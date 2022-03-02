import React from "react";
import styled from "styled-components";
import {Editor, EditorState} from "draft-js";
import "draft-js/dist/Draft.css";

const StyledTextView = styled.div``;

const TextView = () => {
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

    return (
        <StyledTextView>
            <Editor editorState={editorState} onChange={setEditorState} />
        </StyledTextView>
    );
};

export default TextView;
