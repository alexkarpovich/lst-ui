import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Tree} from "@minoru/react-dnd-treeview";

import api from "../../../utils/api";
import MenuToolbar from "./menu-toolbar";
import ContextMenu from "./context-menu";
import {CustomNode} from "./custom-node";
import {NodePlaceholder} from "./node-placeholder";
import {useEventListener} from "../../../hooks/event-listener";
import {useSlicesContext} from "../slices.page";
import { prepareNodePath, prepareTreeData } from "../slices.service";

const StyledSlicesMenu = styled.div.attrs(props => ({
    style: {
        width: `${props.width}px`,
    },
}))`
background-color: ${props => props.theme.colors.bgActiveMenu};
position: fixed;

& > .content {
    width: 100%;
    height: 100vh;

    .node-tree {
        height: 100vh;
        padding-bottom: 64px;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }   
    }
}

& > .holder {
    color: #fff;
    font-size: 1.2em;
    padding: 4px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(100%,0);
    background: #17212b;
    border: 1px solid #17212b;
    cursor: col-resize;
}
`

const SlicesMenu = ({width, holderWidth, onWidthChange}) => {
    const {activeGroup, allNodes, dispatch} = useSlicesContext();
    const [startWidth, setStartWidth] = useState(200);
    const [startX, setStartX] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [contextData, setContextData] = useState({});
    const [nodes, setNodes] = useState(prepareTreeData(allNodes));

    useEffect(() => {
        setNodes(prepareTreeData(allNodes)); 
    }, [JSON.stringify(allNodes)]);

    useEventListener("mousemove", (e) => {
        if (isResizing) {
            onWidthChange(Math.max(startWidth + e.clientX - startX, 0));
        }
    });

    function handleHolderDown(e) {
        setStartX(e.clientX);
        setStartWidth(width);
        setIsResizing(true);
    }

    function handleHolderUp(e) {
        setIsResizing(false);
    }

    function handleMenuChange(contextData) {
        setContextData(contextData);
        setIsMenuOpen(true);
    }

    function handleMenuClose() {
        setIsMenuOpen(false);
    }

    const handleDrop = (newTree, {dragSourceId, dropTarget}) => {
        const parentPath = prepareNodePath(dropTarget?.data);
        moveNode(dragSourceId, parentPath, newTree.map(node => node.id));
        setNodes(newTree);
    }

    async function moveNode(nodeId, parentPath, nodeOrder) {
        try {
            await api.post(`/me/groups/${activeGroup.id}/move-node`, {
                nodeId,
                parentPath,
                nodeOrder,
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledSlicesMenu width={width} holderWidth={holderWidth}>
            <div className="content">
                <MenuToolbar />
                {isMenuOpen && (
                    <ContextMenu 
                        {...contextData} 
                        onClose={handleMenuClose}
                    />
                )}
                <div className="node-tree">
                    <Tree
                        tree={nodes}
                        rootId={null}
                        render={(node, { depth, isOpen, onToggle }) => (
                            <CustomNode
                                node={node}
                                depth={depth}
                                isOpen={isOpen}
                                onToggle={onToggle}
                                onMenuChange={handleMenuChange}
                            />
                        )}
                        onDrop={handleDrop}
                        sort={false}
                        insertDroppableFirst={false}
                        canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                            if (dragSource?.parent === dropTargetId) {
                                return true;
                            }
                        }}
                        dropTargetOffset={5}
                        placeholderRender={(node, { depth }) => (
                            <NodePlaceholder node={node} depth={depth} />
                        )}
                    />
                </div>
            </div>
            <i className="holder icon-grip-lines-vertical-solid" 
                onMouseDown={handleHolderDown} 
                onMouseUp={handleHolderUp}
            />
        </StyledSlicesMenu>
    );
};

SlicesMenu.propTypes = {
};

export default SlicesMenu;
