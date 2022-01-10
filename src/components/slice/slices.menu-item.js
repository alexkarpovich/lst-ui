import React, { useState } from "react";
import PropTypes from "prop-types";

const SlicesMenuItem = ({obj}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    function toggle() {
        setIsExpanded(prev => !prev);
    }

    return (
        <div className={`slices-menu-item-container ${isExpanded ? 'expand' : ''}`}>
            <div className="slices-menu-item">
                <div className="expand-btn" onClick={toggle}>{isExpanded ? '+' : '-'}</div>
                <div className="content">
                    <div className="label">{obj.name}</div>
                    <div className="details">{`${obj.count} expression(s)`}</div>
                </div>
            </div>
            {obj.children && (
                <div className="children">
                    {obj.children.map(child => (
                        <SlicesMenuItem obj={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

SlicesMenuItem.propTypes = {
    obj: PropTypes.object.isRequired,
};

export default SlicesMenuItem;
