import React, {useState} from "react";
import styled from "styled-components";

const StyledDropdownMenu = styled.div`
width: 100%;

& > .content {
    position: relative;

    & > .placeholder {
        padding: 7px;
        font-size: 0.8em;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        border-radius: 4px 4px 0 0; 
    }

    & > .close-btn {
        cursor: pointer;
        position: absolute;
        background: rgb(255,255,255);
        top: 7px;
        right: 10px;
        text-align: center;
    }

    & > .popover-content {
        position: absolute;
        background: #fff;
        border-right: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
        border-left: 1px solid #e7e7e7;
        border-radius: 0 0 3px 3px;
        width: 100%;
        z-index: 100;
    }
}

& > .placeholder {
    color: #007bff;
    cursor: pointer;
    padding: 7px;
    font-size: 0.8em;
    border: 1px solid #fff;

    &:hover {
        color: #333;
    }
}
`;

export const DropdownMenu = ({className, placeholder, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleOpen() {
        setIsOpen(prev => !prev);
    }

    return (
        <StyledDropdownMenu className={className}>
            {isOpen ? (
                <div className="content">
                    <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
                    <div className="placeholder">{placeholder}</div>
                    <div className="popover-content">
                        <div className="items">{children}</div>
                    </div>
                </div>
            ) : (
                <div className="placeholder" onClick={toggleOpen}>{placeholder}</div>
            )}
        </StyledDropdownMenu>
    );
};

const StyledDropdownItem = styled.div`
padding: 7px;
border-top: 1px solid #f9f9f9;
font-size: 0.8em;

&:hover {
    cursor: pointer;
    background-color: #eee;
}
`;

export const DropdownItem = ({label, onClick}) => {
    function handleClick(e) {
        onClick && onClick(e);
    }

    return (
        <StyledDropdownItem onClick={handleClick}>{label}</StyledDropdownItem>
    );
};
