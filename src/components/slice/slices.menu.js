import React from "react";
import PropTypes from "prop-types";
import SlicesMenuItem from "./slices.menu-item";

const SlicesMenu = ({groupId, groups, activeNodeIds, nodes}) => {
    return (
        <div className="slices-menu-container">
            {nodes && nodes.map(node => (
                <SlicesMenuItem key={node.id} obj={node} />
            ))}
        </div>
    );
};

SlicesMenu.propTypes = {
    groupId: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
    activeNodeIds: PropTypes.array.isRequired,
};

export default SlicesMenu;
