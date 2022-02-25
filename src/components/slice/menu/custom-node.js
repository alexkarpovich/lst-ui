import React from "react";
import styled from "styled-components";
import {lighten} from "polished";

import api from "../../../utils/api";
import {MENU_MODE_DEFAULT, MENU_MODE_SELECT, NODE_FOLDER, SELECTION_TOGGLE_NODE, SET_ACTIVE_NODES, UPDATE_NODE, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC } from "../slices.const";
import {useSlicesContext} from "../slices.page";
import EditableName from "./editable-name";

const StyledCustomNode = styled.div`
display: flex;
margin-left: ${({depth}) => depth * 12}px;
padding: 3px;
position: relative;
color: ${props => props.active ? props.theme.colors.colorMenu : '#eee'};

& > .expand-btn {
    font-size: 0.8em;
    margin-right: 3px;
    display: flex;
    flex-direction: column;

    & > * {
        cursor: pointer;
    }

    & > .visibility {
        font-size: 0.7em;
        margin-top: 3px;
        font-size: 0.7em;
        margin-left: 4px;

        &:hover {
            color: #fc0;
        }
    }
}

& > .content {
    width: 100%;
    overflow-y: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    &:hover {
        cursor: pointer;
        color: ${props => lighten(0.15, props.theme.colors.colorMenu)};
    }

    & > .details {
        font-size: 0.7em;
        font-weight: 200;
        white-space: nowrap;
    }
}

& > .checkbox {
    & > i {
        cursor: pointer;
        font-size: 0.8em;

        &.checked {
            font-size: 0.9em;
        }
    }
}
`;

export const CustomNode = ({depth, node, isOpen, onToggle, onMenuChange}) => {
    const {droppable, data} = node;
    const {activeNodes, nodeSelection, menuMode, dispatch} = useSlicesContext();

    const handleToggle = (e) => {
        e.stopPropagation();
        onToggle(data.id);
    };

    const handleContextMenu = (e) => {
        onMenuChange && onMenuChange({node: data, x: e.clientX, y: e.clientY});
        e.preventDefault();
    }

    function select() {
        if (menuMode === MENU_MODE_DEFAULT) {
            dispatch({type: SET_ACTIVE_NODES, payload: [data.id]});
        } else {
            dispatch({type: SELECTION_TOGGLE_NODE, payload: data.id});
        }
    }

    function toggleVisibility() {
        const visibility = data.visibility === VISIBILITY_PRIVATE ? VISIBILITY_PUBLIC : VISIBILITY_PRIVATE;

        update({visibility});
    }

    async function update(obj) {
        try {
            const params = Object.assign(obj, data);

            await api.post(`/me/nodes/${data.id}`, params);
            dispatch({type: UPDATE_NODE, payload: {
                id: data.id,
                ...obj
            }})
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledCustomNode 
            depth={depth}
            active={activeNodes.indexOf(data.id) !== -1}
            onContextMenu={handleContextMenu}
        >
            <div className="expand-btn" onClick={handleToggle}>
                {droppable ? (
                    <i className={`${isOpen ? 'icon-folder-open' : 'icon-folder'}`} />
                ) : (
                    <i className="icon-dot" />
                )}
                <i className={`visibility ${data.visibility === VISIBILITY_PRIVATE ? 'icon-lock' : 'icon-unlocked'}`} 
                    onClick={toggleVisibility} 
                />
            </div>
            <div className="content" onClick={select}>
                <EditableName obj={data} onChange={name => update({name})} />
                <div className="details">{`${data.count} expression(s)`}</div>
            </div>
            {menuMode === MENU_MODE_SELECT && (
                <div className="checkbox">
                    <i className={`${nodeSelection.indexOf(data.id) !== -1 ? 'checked icon-square-check' : 'icon-checkbox-unchecked'}`} 
                        onClick={select} />
                </div>
            )}

        </StyledCustomNode>
    );
};
