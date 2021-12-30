import React, { createContext, useState, useReducer, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";

import api from "../utils/api";
import { getToken, removeToken } from "../utils/session";

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

let initialState = {
    user: null
};

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
    const [isFetching, setIsFetching] = useState(false)
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = getToken();

        if (token) {
            const decoded = jwtDecode(token);

            if (decoded.exp * 1000 < Date.now()) {
                console.log('removing expired token');
                removeToken()
            } else {
                !state.user && reloadUser();
            }
        }
    }, []);

    async function reloadUser () {
        setIsFetching(true);
        const {data:res} = await api.get('/me');        
        login(res.data);
        setIsFetching(false);
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

    return ( isFetching ? 'Fetching...' : 
        <AuthContext.Provider
            value={{ ...state, login, logout, reloadUser }}
            {...props}
        />        
    );
}
