import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../providers/auth.provider';

export function GuestRoute({ component: Component, ...rest }) {
    const {user} = useAuthContext();

    return user ? <Navigate to="/" /> : <Outlet />;
}

export function MemberRoute({ component: Component, ...rest }) {
    const {user} = useAuthContext();

    return user ? <Outlet /> : <Navigate to="/" />;
}

