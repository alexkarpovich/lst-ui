import React, { createContext, useState, useReducer, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";

import api from "../utils/api";
import { getToken, removeToken } from "../utils/session";

const LOGIN_FETCHING = 'LOGIN_FETCHING';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';

let initialState = {
    isFetching: true,
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
        case LOGIN_FETCHING:
            return {...state, isFetching: true};
        case LOGIN_SUCCESS:
            return {
                ...state,
                isFetching: false,
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

    useEffect(() => {
        let isGuest = true;
        const token = getToken();

        if (token) {
            const decoded = jwtDecode(token);

            if (decoded.exp * 1000 < Date.now()) {
                console.log('removing expired token');
                removeToken()
            } else {
                if (!state.user) {
                    isGuest = false;
                    reloadUser();
                }
            }
        }

        if (isGuest) {
            dispatch({ type: LOGIN_SUCCESS, payload: null});
        }
    }, []);

    async function reloadUser () {
        dispatch({ type: LOGIN_FETCHING })
        const {data:res} = await api.get('/me');        
        login(res.data);
    }

    function login(userData) {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: userData
        });
    }

    function logout() {
        removeToken()
        dispatch({ type: LOGOUT });
    }

    return ( state.isFetching ? 'Fetching...' : 
        <AuthContext.Provider
            value={{ ...state, login, logout, reloadUser }}
            {...props}
        />
    );
}
