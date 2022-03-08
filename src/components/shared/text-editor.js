/* eslint-disable react/no-multi-comp */
import React, { useRef, useState, useEffect, ReactElement } from 'react';
import styled from "styled-components";
import {EditorState, RichUtils, Modifier} from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';

import createInlineToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/inline-toolbar';

import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import "@draft-js-plugins/text-alignment/lib/plugin.css";

const HeadlinesPicker = (props) => {
  const onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    props.onOverrideContent(undefined);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.addEventListener('click', onWindowClick);
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      window.removeEventListener('click', onWindowClick);
    };
  });

  const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
  return (
    <div>
      {buttons.map((
        Button,
        i // eslint-disable-next-line
      ) => (
        // eslint-disable-next-line react/no-array-index-key
        <Button key={i} {...props} />
      ))}
    </div>
  );
};

const StyledHeadlinesButton = styled.div`
display: inline-block;
`;

const StyledHeadlineButton = styled.button`
background: #fbfbfb;
color: #888;
font-size: 18px;
border: 0;
padding-top: 5px;
vertical-align: bottom;
height: 34px;
width: 36px;

&:hover,
&:focus {
    background: #f3f3f3;
}
`;

const HeadlinesButton = ({ onOverrideContent }) => {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  const onMouseDown = (event) => event.preventDefault();

  const onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    onOverrideContent(HeadlinesPicker);

  return (
    <StyledHeadlinesButton onMouseDown={onMouseDown}>
      <StyledHeadlineButton onClick={onClick}>
        H
      </StyledHeadlineButton>
    </StyledHeadlinesButton>
  );
};

const textAlignmentPlugin = createTextAlignmentPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar} = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin, textAlignmentPlugin];
const text =
  'In this editor a toolbar shows up once you select part of the text …';

const StyledTextEditor = styled.div`
box-sizing: border-box;
border: 1px solid #ddd;
cursor: text;
padding: 16px;
border-radius: 2px;
margin-bottom: 2em;

& :global(.public-DraftEditor-content) {
  min-height: 140px;
}

pre {
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

ul, ol {
    margin-left: 16px;
}
`;

export const TextEditor = () => {
  const [editorState, setEditorState] = useState(
    createEditorStateWithText(text)
  );
  const editor = useRef();

  const onChange = (value) => {
    setEditorState(value);
  };

  const focus = () => {
    editor.current.focus();
  };

  const onTab = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    if (blockType === "unordered-list-item" || blockType === "ordered-list-item") {
        setEditorState(RichUtils.onTab(e, editorState, 3));
    } else {
        let newContentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            '    '
        );
        
        setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'))
    }
}

  return (
    <StyledTextEditor onClick={focus}>
      <Editor
        editorState={editorState}
        onChange={onChange}
        onTab={onTab}
        plugins={plugins}
        ref={(element) => {
          editor.current = element;
        }}
      />
      <InlineToolbar>
        {
          // may be use React.Fragment instead of div to improve perfomance after React 16
          (externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
              <Separator {...externalProps} />
              <HeadlinesButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
              <textAlignmentPlugin.TextAlignment {...externalProps} />
            </div>
          )
        }
      </InlineToolbar>
    </StyledTextEditor>
  );
};
