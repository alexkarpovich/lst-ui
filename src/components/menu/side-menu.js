import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/auth.provider";
import MenuItem from "./menu-item";

import "./side-menu.scss";

const SideMenu = () => {
    const {logout} = useAuthContext();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

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
                <MenuItem to="/me/profile">User Profile</MenuItem>
                <MenuItem to="/me/groups">Groups</MenuItem>
                <MenuItem to="/me/slices">Slices</MenuItem>
                <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </div>
            <button className="toggle-button" onClick={toggle}>{isOpen ? '<<<' : '>>>'}</button>
        </div>
    );
};

export default SideMenu;
