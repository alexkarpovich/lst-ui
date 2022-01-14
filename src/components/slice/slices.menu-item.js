import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { NODE_FOLDER } from "./slices.const";
import { getNestedNodeIds, prepareQueryParams } from "./slices.service";

const SlicesMenuItem = ({obj}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const qp = prepareQueryParams(searchParams);

    function toggle() {
        setIsExpanded(prev => !prev);
    }

    function select() {
        const ids = getNestedNodeIds(obj);

        setSearchParams({...qp, ids: JSON.stringify(ids)});
    }

    return (
        <div className={`slices-menu-item-container ${isExpanded ? 'expand' : ''}`}>
            <div className={`slices-menu-item ${qp.ids.indexOf(obj.id) !== -1 ? 'active' : ''}`} onClick={select}>
                <div className="expand-btn" onClick={toggle}>
                    {obj.type === NODE_FOLDER ? (
                        <i className={`${isExpanded ? 'icon-folder' : 'icon-folder-open'}`} />
                    ) : (
                        <i className="icon-dot" />
                    )}
                    
                </div>
                <div className="content">
                    <div className="label">                        
                        {obj.name}
                    </div>
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
