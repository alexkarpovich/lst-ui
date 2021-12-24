import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import { getToken, removeToken, setToken } from '../utils/session';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

let initialState = {
    isAuthenticated: false,
    user: null
};

const token = getToken();

if (token) {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
        removeToken()
    } else {
        initialState.isAuthenticated = true;
    }
}

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: (data) => { },
    logout: () => { }
});

function authReducer(state, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        default:
            return state;
    }
}

function AuthProvider(props) {
    const data = null;
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        setToken(userData.token);

        dispatch({
            type: LOGIN,
            payload: userData
        });
    }

    function logout() {
        removeToken()
        dispatch({ type: LOGOUT });
    }

    return (
        <AuthContext.Provider
            value={{ user: data ? data.me : null, login, logout }}
            {...props}
        />
    );
}

export { AuthContext, AuthProvider };