import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import SlicesMenuItem from "./slices.menu-item";

const StyledSlicesMenu = styled.div`
background-color: ${props => props.theme.colors.bgActiveMenu};
position: fixed;
width: 200px;
height: 100%;
overflow-y: auto;
-ms-overflow-style: none;
scrollbar-width: none;

&::-webkit-scrollbar {
    display: none;
}
`;

const SlicesMenu = ({groupId, groups, activeNodeIds, nodes}) => {
    return (
        <StyledSlicesMenu>
            {nodes && nodes.map(node => (
                <SlicesMenuItem key={node.id} obj={node} />
            ))}
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
