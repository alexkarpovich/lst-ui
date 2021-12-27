import React from "react";

import './auth.page.scss';
import Signup from "./signup";
import Login from "./login";

const AuthPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-components">
                <Signup />
                <div className="divider" />
                <Login />
            </div>   
        </div>
    );
};

export default AuthPage;