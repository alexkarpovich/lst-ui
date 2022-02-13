import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {lighten} from "polished";


import api from "../../../utils/api";
import {MENU_MODE_DEFAULT, MENU_MODE_SELECT, NODE_FOLDER, SELECTION_TOGGLE_NODE, SET_ACTIVE_NODES, UPDATE_NODE, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC } from "../slices.const";
import {useSlicesContext} from "../slices.page";
import EditableName from "./editable-name";

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
position: relative;
color: ${props => props.active ? props.theme.colors.colorMenu : '#eee'};

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
        margin-left: 4px;

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

    & > .details {
        font-size: 0.7em;
        white-space: nowrap;
    }
}

& > .checkbox {
    & > i {
        cursor: pointer;
        font-size: 0.8em;

        &.checked {
            font-size: 0.9em;
        }
    }
}
`;

const SlicesMenuItem = ({obj, onMenuChange}) => {
    const {activeNodes, nodeSelection, menuMode, dispatch} = useSlicesContext();
    const [isExpanded, setIsExpanded] = useState(true);

    function toggle() {
        setIsExpanded(prev => !prev);
    }

    function select() {
        if (menuMode === MENU_MODE_DEFAULT) {
            dispatch({type: SET_ACTIVE_NODES, payload: [obj.id]});
        } else {
            dispatch({type: SELECTION_TOGGLE_NODE, payload: obj.id});
        }
    }

    const handleContextMenu =(node) => (e) => {
        onMenuChange && onMenuChange({node, x: e.clientX, y: e.clientY});
        e.preventDefault();
    }

    function toggleVisibility() {
        const visibility = obj.visibility === VISIBILITY_PRIVATE ? VISIBILITY_PUBLIC : VISIBILITY_PRIVATE;

        update({visibility});
    }

    async function update(data) {
        try {
            const params = Object.assign({
                name: obj.name,
                path: obj.path,
                visibility: obj.visibility,
            }, data);

            await api.post(`/me/nodes/${obj.id}`, params);
            dispatch({type: UPDATE_NODE, payload: {
                id: obj.id,
                ...data
            }})
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledMenuItemContainer expanded={isExpanded}>
            <StyledMenuItem 
                active={activeNodes.indexOf(obj.id) !== -1} 
                type={obj.type}
                onContextMenu={handleContextMenu(obj)}
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
                    <EditableName obj={obj} onChange={name => update({name})} />
                    <div className="details">{`${obj.count} expression(s)`}</div>
                </div>
                {menuMode === MENU_MODE_SELECT && (
                    <div className="checkbox">
                        <i className={`${nodeSelection.indexOf(obj.id) !== -1 ? 'checked icon-square-check' : 'icon-checkbox-unchecked'}`} 
                            onClick={select} />
                    </div>
                )}
            </StyledMenuItem>
            {obj.children && (
                <div className="children">
                    {obj.children.map(child => (
                        <SlicesMenuItem 
                            key={child.id} 
                            obj={child} 
                            onMenuChange={onMenuChange}
                        />
                    ))}
                </div>
            )}
        </StyledMenuItemContainer>
    );
};

SlicesMenuItem.propTypes = {
    obj: PropTypes.object.isRequired,
    onMenuChange: PropTypes.func,
};

export default SlicesMenuItem;
