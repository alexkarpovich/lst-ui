import React from "react";
import PropTypes from "prop-types";
import SlicesMenuItem from "./slices.menu-item";

const SlicesMenu = ({groupId, groups, activeSliceIds, slices}) => {
    return (
        <div className="slices-menu-container">
            {slices && slices.map(slice => (
                <SlicesMenuItem key={slice.id} obj={slice} />
            ))}
        </div>
    );
};

SlicesMenu.propTypes = {
    groupId: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    slices: PropTypes.array.isRequired,
    activeSliceIds: PropTypes.array.isRequired,
};

export default SlicesMenu;
