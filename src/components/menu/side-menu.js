import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/auth.provider";
import MenuItem from "./menu-item";

import "./side-menu.scss";

const SideMenu = () => {
    const {logout} = useAuthContext();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    function toggle() {
        setIsOpen(prev => !prev);
    }

    function logoutHandler() {
        logout();
        navigate("/");
    }

    return (
        <div className={`side-menu ${!isOpen ? 'close' : ''}`}>
            <div className="brand">#</div>
            <div className="menu-items">
                <MenuItem to="/me/profile">
                    <i className="icon-user-profile" />
                    <span className="label">Profile</span>
                </MenuItem>
                <MenuItem to="/me/groups">
                    <i className="icon-group" />
                    <span className="label">Groups</span>
                </MenuItem>
                <MenuItem to="/me/slices">
                    <i className="icon-pie-chart" />
                    <span className="label">Slices</span>
                </MenuItem>
                <hr />
                <MenuItem onClick={logoutHandler}>
                    <i className="icon-exit" />
                    <span className="label">Log out</span>
                </MenuItem>                
            </div>
            <div className="toggle-button" onClick={toggle}>{isOpen ? '<<<' : '>>>'}</div>
        </div>
    );
};

export default SideMenu;
