import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../providers/auth.provider";

import './home.page.scss';

const HomePage = () => {
    const {user} = useAuthContext();
    
    return (
        <div className="home-page">
            <div className="header">
                <h2>Language Study Tool</h2>
                <p>It allows you to learn languages simplier using flashcards with specific sets of expressions, adding texts and translations. Learning multiple languages at the same time.</p>
                <div className="auth-section">
                    {user && user.id ? (
                        <Link to="/me">Dashboard</Link>                        
                    ) : (
                        <Link to="/auth">Authentication</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;