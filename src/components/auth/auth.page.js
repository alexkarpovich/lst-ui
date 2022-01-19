import React from "react";
import styled from "styled-components";

import Signup from "./signup";
import Login from "./login";


const StyledAuthPage = styled.div`
height: 100%;
width: 100%;
position: absolute;
display: flex;
justify-content: center;
align-items: flex-start;
margin-top: 15%;

.auth-components {
    display: flex;
    position: relative;

    & > *:last-child {
        margin-left: 80px;
    }

    .divider{
        --div-border: 1px solid #f3f3f3;
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        border-left: var(--div-border);
        border-right: var(--div-border);
        border-radius: 3px;
    }
}
`;

const AuthPage = () => {
    return (
        <StyledAuthPage>
            <div className="auth-components">
                <Signup />
                <div className="divider" />
                <Login />
            </div>   
        </StyledAuthPage>
    );
};

export default AuthPage;