import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

import styled from "styled-components";

const StyledMenuItem = styled.div`
position: relative;
padding: 7px;
color: ${props => props.active ? props.theme.colors.colorMenu : '#c3c3c3'};
cursor: ${props => props.active ? 'default' : 'pointer'};
border-top: 1px solid ${props => props.active ? `darken(${props.theme.colors.bgActiveMenu}, 5%)` : props.theme.colors.bgMenu};
border-bottom: 1px solid ${props => props.active ? `lighten(${props.theme.colors.bgActiveMenu}, 15%)` : props.theme.colors.bgMenu};
background-color: ${props => props.active ? props.theme.colors.bgActiveMenu : 'inherit'};;

&:hover {
    &::before {
        width: 100px;
        height: 24px;
        position: absolute;
        background: ${props => props.theme.colors.bgMenu};
        left: 50px;
        font-weight: 700;
        content: "${props => props.text}";
        top: 11px;
        color: #fff;
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
        padding: 5px;
        z-index: 44;
    }

    &::after {
        width: 0;
        height: 0;
        position: absolute;
        left: 40px;
        border-left: 5px solid transparent;
        border-right: 5px solid ${props => props.theme.colors.bgMenu};
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        top: 18px;
        content: "";
    }
}

i {
    font-size: 2em;
}
`;

const MenuItem = ({children, to, title, onClick}) => {
    const location = useLocation();
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(location.pathname.indexOf(to) !== -1)

    useEffect(() => {
        setIsActive(location.pathname.indexOf(to) !== -1);
    }, [location, to])

    function open() {
        if (onClick) {
            onClick()
        } else {
            navigate(to);
        }
    }

    return (
        <StyledMenuItem
            active={isActive}
            text={title}
            onClick={open}>
            {children}
        </StyledMenuItem>
    );
};

MenuItem.propTypes = {
    to: PropTypes.string,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default MenuItem;
