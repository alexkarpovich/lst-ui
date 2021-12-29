import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../providers/auth.provider';

export function GuestRoute() {
    const {user} = useAuthContext();

    return user ? <Navigate to="/" /> : <Outlet />;
}

export function MemberRoute() {
    const {user} = useAuthContext();
    console.log('Member router', user);

    return user ? <Outlet /> : <Navigate to="/" />;
}

