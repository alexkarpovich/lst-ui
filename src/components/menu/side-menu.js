import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAuthContext } from "../../providers/auth.provider";
import MenuItem from "./menu-item";

const StyledSideMenu = styled.div`
position: fixed;
background-color: ${props => props.theme.colors.bgMenu};
border-right: 1px solid ${props => props.theme.colors.bgActiveMenu};
width: 48px;
height: 100vh;
z-index: 999;

& > .brand {
    text-align: center;
    font-size: 1.2em;
}
`;

const SideMenu = () => {
    const {logout} = useAuthContext();
    const navigate = useNavigate();

    function logoutHandler() {
        logout();
        navigate("/");
    }

    return (
        <StyledSideMenu>
            <div className="brand">#</div>
            <div className="menu-items">
                <MenuItem to="/me/profile" title="Profile">
                    <i className="icon-user-profile" />
                </MenuItem>
                <MenuItem to="/me/groups" title="Groups">
                    <i className="icon-group" />
                </MenuItem>
                <MenuItem to="/me/slices" title="Slices" paths={['/me/groups/:id/slices']}>
                    <i className="icon-pie-chart" />
                </MenuItem>
                <MenuItem to="/me/trainings" title="Trainings" paths={['/me/trainings/:id']}>
                    <i className="icon-dumbbell" />
                </MenuItem>
                <hr />
                <MenuItem onClick={logoutHandler} title="Log out">
                    <i className="icon-arrow-right-from-bracket" />
                </MenuItem>                
            </div>
        </StyledSideMenu>
    );
};

export default SideMenu;
