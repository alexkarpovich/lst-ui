import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

const SlicesMenuItem = ({obj}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(false);

    function toggle() {
        setIsExpanded(prev => !prev);
    }

    function select() {
        setSearchParams({...Object.fromEntries(searchParams), slices: JSON.stringify([obj.id])});
    }

    return (
        <div className={`slices-menu-item-container ${isExpanded ? 'expand' : ''}`}>
            <div className={`slices-menu-item`} onClick={select}>
                <div className="expand-btn" onClick={toggle}>{isExpanded ? '+' : '-'}</div>
                <div className="content">
                    <div className="label">{obj.name}</div>
                    <div className="details">{`${obj.count} expression(s)`}</div>
                </div>
            </div>
            {obj.children && (
                <div className="children">
                    {obj.children.map(child => (
                        <SlicesMenuItem key={child.id} obj={child} />
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
