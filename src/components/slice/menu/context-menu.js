import React, {Fragment, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import api from "../../../utils/api";
import {NODE_SLICE, NODE_FOLDER, ADD_NODE, DELETE_NODE, EDIT_NODE_MODE} from "../slices.const";
import {useSlicesContext} from "../slices.page";
import {prepareNodePath} from "../slices.service";

const StyledContextMenu = styled.div.attrs(props => ({
    style: {
        left: `${props.x}px`,
        top: `${props.y}px`
    },
}))`
position: absolute;
background: #eee;
outline: none;
border-radius: 3px;
box-shadow: 0 0 15px #333;
z-index: 999;

& > .content {
    & > .menu-item {
        padding: 7px;
        cursor: pointer;
        color: #333;
        font-size: 0.8em;

        &:hover {
            background: #fff;
        }

        &:active {
            background: #ddd;
        }

        &:first-child {
            border-radius: 3px 3px 0 0;
        }

        &:last-child {
            border-radius: 0 0 3px 3px;
        }
    }
}
`;

const ContextMenu = ({node, x, y, onClose}) => {
    const rootRef = useRef();
    const {activeGroup, dispatch} = useSlicesContext();

    useEffect(() => {
        rootRef.current.focus();
    })

    function handleBlur() {
        onClose && onClose();
    }

    function handleRenameNode() {
        dispatch({type: EDIT_NODE_MODE, payload: {
            nodeId: node.id,
        }})
        onClose();
    }

    async function addNode(type) {
        try {
            const {data:res} = await api.post(`/me/groups/${activeGroup.id}/nodes`, {
                type,
                name: Math.random().toString(36).substr(2, 20),
                parentPath: prepareNodePath(node),
            });
            dispatch({type: ADD_NODE, payload: {
                parentId: node.id,
                node: res.data,
            }});
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteNode() {
        try {
            await api.delete(`/me/groups/${activeGroup.id}/nodes/${node.id}`);
            dispatch({type: DELETE_NODE, payload: {
                nodeId: node.id
            }});
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledContextMenu
            x={x} y={y} 
            ref={rootRef}
            tabIndex="-1"
            onBlur={handleBlur}
        >
            <div className="content">
                {(!node || node.type === NODE_FOLDER) && (
                    <Fragment>
                        <div className="menu-item" onClick={() => addNode(NODE_SLICE)}>Add slice</div>
                        <div className="menu-item" onClick={() => addNode(NODE_FOLDER)}>Add folder</div>
                    </Fragment>
                )}
                <div className="menu-item" onClick={handleRenameNode}>Rename</div>
                <div className="menu-item" onClick={deleteNode}>Delete</div>
            </div>
        </StyledContextMenu>
    );
};

ContextMenu.propTypes = {
    node: PropTypes.object,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onClose: PropTypes.func,
};

export default ContextMenu;
