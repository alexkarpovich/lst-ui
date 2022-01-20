import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { NODE_FOLDER } from "./slices.const";
import { getNestedNodeIds, prepareQueryParams } from "./slices.service";

const StyledMenuItemContainer = styled.div`
& > .children {
    display: ${props => props.expanded ? 'inherit' : 'none'}
    margin-left: 3px;
    padding-left: 5px;
    border-left: 1px dashed #333;
}
`;

const StyledMenuItem = styled.div`
display: flex;
padding: 7px 3px;
color: ${props => props.active ? props.theme.colors.colorMenu : '#bbb'};

& > .expand-btn {
    font-size: 0.8em;
    margin-right: 3px;
}

& > .content {
    & > .label {
        font-size: 0.8em;
        font-weight: 500;
    }

    & > .details {
        font-size: 0.7em;
    }
}

&:hover {
    cursor: pointer;
    color: lighten(${props => props.theme.colors.colorMenu}, 15%);
}
`;

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
        <StyledMenuItemContainer expanded={isExpanded}>
            <StyledMenuItem active={qp.ids.indexOf(obj.id) !== -1} onClick={select}>
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
            </StyledMenuItem>
            {obj.children && (
                <div className="children">
                    {obj.children.map(child => (
                        <SlicesMenuItem key={child.id} obj={child} />
                    ))}
                </div>
            )}
        </StyledMenuItemContainer>
    );
};

SlicesMenuItem.propTypes = {
    obj: PropTypes.object.isRequired,
};

export default SlicesMenuItem;
