import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import "./index.scss";
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./providers/auth.provider";
import {GuestRoute, MemberRoute} from "./utils/routing.utils";
import App from "./App";
import AuthPage from "./components/auth/auth.page";
import HomePage from "./components/home.page";
import SignupConfirmPage from "./components/auth/signup-confirm.page";
import DashboardPage from "./components/dashboard/dashboard.page";
import GroupsPage from "./components/group/groups.page";
import SlicesPage from "./components/slices/slices.page";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter basename='/'>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route exact path="/auth" element={<GuestRoute />}>
                        <Route exact path="" element={<AuthPage />} />
                        <Route exact path="signup/:token" element={<SignupConfirmPage />} />
                    </Route>
                    <Route path="/me" element={<App />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="groups" element={<GroupsPage />} />
                        <Route path="slices" element={<SlicesPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
