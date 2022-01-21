import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {lighten} from "polished";

import api from "../../utils/api";
import { NODE_FOLDER, UPDATE_NODE, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC } from "./slices.const";
import { getNestedNodeIds, prepareQueryParams } from "./slices.service";
import { useSlicesContext } from "./slices.page";

const StyledMenuItemContainer = styled.div`
& > .children {
    display: ${props => props.expanded ? 'inherit' : 'none'};
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
        font-size: 0.7em;
        margin-top: 3px;
        font-size: 0.7em;
        margin-left: ${props => props.type === 0 ? '1px' : '4px'};

        &:hover {
            color: #fc0;
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
    const {dispatch} = useSlicesContext();
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
        const visibility = obj.visibility === VISIBILITY_PRIVATE ? VISIBILITY_PUBLIC : VISIBILITY_PRIVATE;
        try {
            await api.post(`/me/nodes/${obj.id}`, {
                name: obj.name,
                path: obj.path,
                visibility,
            });
            dispatch({type: UPDATE_NODE, payload: {
                id: obj.id,
                visibility,
            }})
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
                        <i className={`${isExpanded ? 'icon-folder-open' : 'icon-folder'}`} />
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
