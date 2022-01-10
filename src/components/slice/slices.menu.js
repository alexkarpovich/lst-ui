import React from "react";
import PropTypes from "prop-types";
import SlicesMenuItem from "./slices.menu-item";

const SlicesMenu = ({groupId, groups, slices}) => {
    return (
        <div className="slices-menu-container">
            {slices && slices.map(slice => (
                <SlicesMenuItem obj={slice} />
            ))}
        </div>
    );
};

SlicesMenu.propTypes = {
    groupId: PropTypes.number,
    groups: PropTypes.array.isRequired,
    slices: PropTypes.array.isRequired,
};

export default SlicesMenu;
