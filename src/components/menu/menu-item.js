import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

import "./menu-item.scss";


const MenuItem = ({children, to, onClick}) => {
    const location = useLocation();
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(location.pathname.indexOf(to) !== -1)

    useEffect(() => {
        setIsActive(location.pathname.indexOf(to) !== -1);
    }, [location])

    function open() {
        if (onClick) {
            onClick()
        } else {
            navigate(to);
        }
    }

    return (
        <div className={`menu-item ${isActive ? 'active' : ''}`} onClick={open}>
            {children}
        </div>
    );
};

MenuItem.propTypes = {
    to: PropTypes.string,
    onClick: PropTypes.func
};

export default MenuItem;
