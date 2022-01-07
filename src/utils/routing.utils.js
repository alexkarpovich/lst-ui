import React from 'react';
import { createSearchParams, useLocation, Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../providers/auth.provider';

export function GuestRoute() {
    const {user} = useAuthContext();

    return user ? <Navigate to="/" /> : <Outlet />;
}

export function MemberRoute() {
    const {user} = useAuthContext();
    const location = useLocation();

    console.log('member', user, location);

    return user ? <Outlet /> : (
        <Navigate to={`/auth?${createSearchParams({next: location.pathname})}`} />
    );
}

