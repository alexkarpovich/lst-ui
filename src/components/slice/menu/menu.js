import React, {useState} from "react";
import styled from "styled-components";

import MenuToolbar from "./menu-toolbar";
import ContextMenu from "./context-menu";
import SlicesMenuItem from "./menu-item";
import {useEventListener} from "../../../hooks/event-listener";
import {useSlicesContext} from "../slices.page";

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
    const {allNodes} = useSlicesContext();
    const [width, setWidth] = useState(200);
    const [startWidth, setStartWidth] = useState(200);
    const [startX, setStartX] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [contextData, setContextData] = useState({});

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

    function handleRootChange(e) {
        console.log('root');
        setContextData({
            node: null,
            x: e.clientX,
            y: e.clientY,
        });
        setIsMenuOpen(true);
        e.preventDefault();
    }

    function handleMenuChange(contextData) {
        setContextData(contextData);
        setIsMenuOpen(true);
    }

    function handleMenuClose() {
        setIsMenuOpen(false);
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
                {allNodes && allNodes.map(node => (
                    <SlicesMenuItem 
                        key={node.id}
                        obj={node}
                        onMenuChange={handleMenuChange}
                    />
                ))}
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
