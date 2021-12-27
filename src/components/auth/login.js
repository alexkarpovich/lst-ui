import React from "react";

import './login.scss';
import { Input } from "../library/input";

const Login = () => {
    return (
        <div className="login">
            <h3>Log in</h3>
            <div className="login-controls">
                <Input type="email" placeholder="Enter email address" />
                <Input type="password" placeholder="Enter password" />
                <button type="submit" className="button">Submit</button>
            </div>
        </div>
    );
};

export default Login;