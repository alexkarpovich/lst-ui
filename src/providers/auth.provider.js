import React, { createContext, useReducer, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";

import api from "../utils/api";
import { getToken, removeToken, setToken } from "../utils/session";

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

let initialState = {
    user: null
};

const token = getToken();

if (token) {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
        console.log('removing expired token');
        removeToken()
    }
}

export const AuthContext = createContext({
    user: null,
    login: (data) => { },
    logout: () => { },
    reloadUser: async () => {},
});

export function useAuthContext() {
   return useContext(AuthContext);
}

function authReducer(state, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

export function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    console.log(state);

    useEffect(() => {
        token && !state.user && reloadUser();
    }, []);

    async function reloadUser () {
        const {data:res} = await api.get('/me');
        login(res.data);
    }

    function login(userData) {
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
            value={{ ...state, login, logout, reloadUser }}
            {...props}
        />
    );
}
