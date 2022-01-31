import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import SlicesMenuItem from "./slices.menu-item";
import { useEventListener } from "../../hooks/event-listener";

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

const SlicesMenu = ({groupId, groups, activeNodeIds, nodes}) => {
    const [width, setWidth] = useState(200);
    const [startWidth, setStartWidth] = useState(200);
    const [startX, setStartX] = useState(0);
    const [isResizing, setIsResizing] = useState(false);

    useEventListener("mousemove", (e) => {
        if (isResizing) {
            setWidth(startWidth + e.clientX - startX);
        }
    });

    function handleHolderDown(e) {
        console.log('down', e);
        setStartX(e.clientX);
        setStartWidth(width);
        setIsResizing(true);
    }

    function handleHolderUp(e) {
        console.log('up', e);
        setIsResizing(false);
    }

    return (
        <StyledSlicesMenu width={width}>
            <div className="content">
                {nodes && nodes.map(node => (
                    <SlicesMenuItem key={node.id} obj={node} />
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
    groupId: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
    activeNodeIds: PropTypes.array.isRequired,
};

export default SlicesMenu;
