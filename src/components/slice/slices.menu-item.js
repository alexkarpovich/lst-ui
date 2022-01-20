import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {lighten} from "polished";

import api from "../../utils/api";
import { NODE_FOLDER, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC } from "./slices.const";
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

&:hover {
    & > .controls {
        display: block;
    }
}

& > .expand-btn {
    font-size: 0.8em;
    margin-right: 3px;
    display: flex;
    flex-direction: column;

    & > * {
        cursor: pointer;
    }

    & > .visibility {
        opacity: 15%;
        font-size: 0.9em;
        margin-left: ${props => props.type === 0 ? '0' : '3px'};

        &:hover {
            opacity: 100%;
        }
    }
}

& > .content {
    width: 100%;

    &:hover {
        cursor: pointer;
        color: ${props => lighten(0.15, props.theme.colors.colorMenu)};
    }

    & > .label {
        font-size: 0.8em;
        font-weight: 500;
    }

    & > .details {
        font-size: 0.7em;
    }
}

& > .controls {
    cursor: pointer;
    display: none;
    font-size: 0.7em;
    margin-top: auto;
    margin-bottom: auto;
    color: ${props => lighten(0.15, props.theme.colors.colorMenu)}

    i {
        &:not(:first-child) {
            margin-left: 2px;
        }
    }
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

    async function toggleVisibility() {
        try {
            await api.post(`/me/nodes/${obj.id}`, {
                name: obj.name,
                path: obj.path,
                visibility: obj.visibility === VISIBILITY_PRIVATE ? VISIBILITY_PUBLIC : VISIBILITY_PRIVATE,
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledMenuItemContainer expanded={isExpanded}>
            <StyledMenuItem 
                active={qp.ids.indexOf(obj.id) !== -1} 
                type={obj.type}
            >
                <div className="expand-btn" onClick={toggle}>
                    {obj.type === NODE_FOLDER ? (
                        <i className={`${isExpanded ? 'icon-folder' : 'icon-folder-open'}`} />
                    ) : (
                        <i className="icon-dot" />
                    )}
                    <i className={`visibility ${obj.visibility === VISIBILITY_PRIVATE ? 'icon-lock' : 'icon-unlocked'}`} 
                        onClick={toggleVisibility} 
                    />
                </div>
                <div className="content" onClick={select}>
                    <div className="label">                        
                        {obj.name}
                    </div>
                    <div className="details">{`${obj.count} expression(s)`}</div>
                </div>
                <div className="controls">
                    <i className="icon-edit-box" />
                    <i className="icon-bin" />
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
