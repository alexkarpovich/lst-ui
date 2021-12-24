import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../providers/auth.provider';

function GuestRoute({ component: Component, ...rest }) {
    const { user } = useContext(AuthContext);

    return user ? <Navigate to="/" /> : <Outlet />;
}

export default GuestRoute;