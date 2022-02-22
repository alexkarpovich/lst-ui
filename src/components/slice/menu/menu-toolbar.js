import React, {Fragment} from "react";
import styled from "styled-components";
import {darken} from "polished";

import api from "../../../utils/api";
import {useSlicesContext} from "../slices.page";
import {
    ADD_NODE, NODE_SLICE, NODE_FOLDER, MENU_MODE_DEFAULT, 
    MENU_MODE_SELECT, SET_MENU_MODE, SELECT_ALL_NODES,
    CANCEL_SELECTION_MODE,
} from "../slices.const";

const StyledMenuToolbar = styled.div`
position: sticky;
top: 0;
background: ${({theme}) => theme.colors.bgActiveMenu};
border-bottom: 1px solid ${({theme}) => darken(0.05, theme.colors.bgActiveMenu)};
box-shadow: 0 1px 5px ${({theme}) => darken(0.05, theme.colors.bgActiveMenu)};
z-index: 9999;

& > .content {
    display: flex;

    & > div {
        display: inline-flex;
        
        &.pull-left {
            width: 100%;
        }

        & > * {
            padding: 5px;
            cursor: pointer;
            color: #eee;
            
            &:hover {
                color: #aaa;
            }
        }
        
        & > .new-folder, & > .new-slice {
            &:hover {
                color: #4db345;
            }
        }

        .select-all {
            display: flex;
            align-items: center;
            font-size: 0.8em;
            padding-right: 3px;
        }

        .apply-selection {
            color: #4db345;
        }
    }
}
`;

const MenuToolbar = () => {
    const {menuMode, activeGroup, dispatch} = useSlicesContext();

    function switchMode(mode) {
        dispatch({type: SET_MENU_MODE, payload: mode});
    }

    function applySelection() {
        dispatch({type: SET_MENU_MODE, payload: MENU_MODE_DEFAULT});
    }

    function cancelSelection() {
        dispatch({type: CANCEL_SELECTION_MODE});
    }

    function selectAll() {
        dispatch({type: SELECT_ALL_NODES});
    }

    async function addNode(type) {
        try {
            const {data:res} = await api.post(`/me/groups/${activeGroup.id}/nodes`, {
                type,
                name: Math.random().toString(36).substr(2, 20),
                parentPath: "",
            });
            dispatch({type: ADD_NODE, payload: {
                parentId: null,
                node: res.data,
            }});
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <StyledMenuToolbar>
            <div className="content">
                <div className="pull-left">
                    <div className="new-slice icon-circle-plus" 
                        onClick={() => addNode(NODE_SLICE)} />
                    <div className="new-folder icon-folder-plus" 
                        onClick={() => addNode(NODE_FOLDER)} />
                </div>
                <div>
                    {menuMode === MENU_MODE_DEFAULT && (
                        <div className="list-check icon-list-check-solid" onClick={() => switchMode(MENU_MODE_SELECT)} />
                    )}
                    
                    {menuMode === MENU_MODE_SELECT && (
                        <Fragment>
                            <div className="cancel-selection" onClick={cancelSelection}>×</div>
                            <div className="apply-selection icon-checkmark" onClick={applySelection} />
                            <div className="select-all icon-checkbox-unchecked" onClick={selectAll} />
                        </Fragment>
                    )}
                </div>
            </div>
        </StyledMenuToolbar>
    );
};

export default MenuToolbar;
