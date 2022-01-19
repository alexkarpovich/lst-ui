import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuthContext } from "../providers/auth.provider";

const StyledHomePage = styled.div`
& > .header {
    height: 256px;
    padding: 24px;
    background: rgb(209,209,209);
    background: linear-gradient(180deg, rgba(241,241,241,1) 0%, rgba(255,255,255,1) 100%);
    
    h2 {
        text-transform: uppercase;
    }

    h2, p, .auth-section {
        text-align: center;
    }

    .auth-section {
        padding-top: 15px;

        a {
            padding: 10px;
            background-color: #000;
            font-size: 1.2rem;
            border-radius: 3px;
            color: #dedede;
            text-decoration: none;
            text-transform: uppercase;

            &:hover {
                background-color: #333;
            }

            &:not(:first-child) {
                margin-left: 30px;
            }
        }
    }
}
`;

const HomePage = () => {
    const {user} = useAuthContext();
    
    return (
        <StyledHomePage>
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
        </StyledHomePage>
    );
};

export default HomePage;