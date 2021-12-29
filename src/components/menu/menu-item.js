import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import "./menu-item.scss";


const MenuItem = ({children, to, onClick}) => {
    const navigate = useNavigate()

    function open() {
        if (onClick) {
            onClick()
        } else {
            navigate(to);
        }
    }

    return (
        <div className="menu-item" onClick={open}>
            {children}
        </div>
    );
};

MenuItem.propTypes = {
    to: PropTypes.string,
    onClick: PropTypes.func
};

export default MenuItem;
