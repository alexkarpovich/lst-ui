import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Tree} from "@minoru/react-dnd-treeview";

import api from "../../../utils/api";
import MenuToolbar from "./menu-toolbar";
import ContextMenu from "./context-menu";
import {CustomNode} from "./custom-node";
import {NodePlaceholder} from "./node-placeholder";
import {useEventListener} from "../../../hooks/event-listener";
import {UPDATE_NODE} from "../slices.const";
import {useSlicesContext} from "../slices.page";
import { prepareNodePath, prepareTreeData } from "../slices.service";

const StyledSlicesMenu = styled.div.attrs(props => ({
    style: {
        flexBasis: `${props.width}px`,
    },
}))`
background-color: ${props => props.theme.colors.bgActiveMenu};
display: inline-flex;
flex-grow: 0;
flex-shrink: 0;
height: 100vh;
overflow-y: auto;
-ms-overflow-style: none;
scrollbar-width: none;

&::-webkit-scrollbar {
    display: none;
}

& > .content {
    width: 100%;
}

& > .holder {
    cursor: col-resize;
    height: 100%;
    background: ${props => props.theme.colors.bgMenu};
    width: 4px;

    &:hover {
        background: ${props => props.theme.colors.colorMenu};
    }
}  
`

const SlicesMenu = () => {
    const {activeGroup, allNodes, dispatch} = useSlicesContext();
    const [width, setWidth] = useState(200);
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
            setWidth(startWidth + e.clientX - startX);
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
        <StyledSlicesMenu width={width}>
            <div className="content">
                <MenuToolbar />
                {isMenuOpen && (
                    <ContextMenu 
                        {...contextData} 
                        onClose={handleMenuClose}
                    />
                )}
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
            <div 
                className="holder" 
                onMouseDown={handleHolderDown} 
                onMouseUp={handleHolderUp}
            />
        </StyledSlicesMenu>
    );
};

SlicesMenu.propTypes = {
};

export default SlicesMenu;
