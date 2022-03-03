/* eslint-disable react/no-multi-comp */
import React, {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
  
const text =
'In this editor a toolbar shows up once you select part of the text …';

const StyledSimpleInlineToolbarEditor = styled.div`
box-sizing: border-box;
border: 1px solid #ddd;
cursor: text;
padding: 10px;
border-radius: 2px;
margin-bottom: 2em;
  
& :global(.public-DraftEditor-content) {
    min-height: 140px;
}
`;

const SimpleInlineToolbarEditor = () => {
    const [plugins, InlineToolbar] = useMemo(() => {
        const inlineToolbarPlugin = createInlineToolbarPlugin();
        return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
    }, []);

    const [editorState, setEditorState] = useState(() =>
        createEditorStateWithText('')
    );

    useEffect(() => {
        // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
        setEditorState(createEditorStateWithText(text));
    }, []);

    const editorRef = useRef(null);

    const onChange = (value) => {
        setEditorState(value);
    };

    const focus = () => {
        editorRef.current?.focus();
    };

    return (
        <StyledSimpleInlineToolbarEditor onClick={focus}>
            <Editor
                editorKey="SimpleInlineToolbarEditor"
                editorState={editorState}
                onChange={onChange}
                plugins={plugins}
                ref={editorRef}
            />
            <InlineToolbar />
        </StyledSimpleInlineToolbarEditor>
    );
};


const StyledTextView = styled.div``;

const TextView = () => {
    return (
        <StyledTextView>
            <SimpleInlineToolbarEditor />
        </StyledTextView>
    );
};

export default TextView;
