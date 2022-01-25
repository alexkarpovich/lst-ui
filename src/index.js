import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./providers/auth.provider";
import { AppThemeProvider } from "./providers/theme.provider";
import {GuestRoute, MemberRoute} from "./utils/routing.utils";
import App from "./App";
import AuthPage from "./components/auth/auth.page";
import HomePage from "./components/home.page";
import SignupConfirmPage from "./components/auth/signup-confirm.page";
import DashboardPage from "./components/dashboard/dashboard.page";
import GroupsPage from "./components/group/groups.page";
import SlicesPage from "./components/slice/slices.page";
import ConfirmInvitationPage from "./components/group/confirm-invitation.page";
import TrainingPage from "./components/training/training.page";


ReactDOM.render(
    <React.StrictMode>
        <AppThemeProvider>
            <AuthProvider>
                <BrowserRouter basename='/'>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route exact path="/auth" element={<GuestRoute />}>
                            <Route index element={<AuthPage />} />
                            <Route exact path="signup/:token" element={<SignupConfirmPage />} />
                        </Route>
                        <Route path="/me" element={<MemberRoute />}>
                            <Route path="/me" element={<App />}>
                                <Route index element={<DashboardPage />} />
                                <Route exact path="groups" element={<Outlet />}>
                                    <Route index element={<GroupsPage />} />
                                    <Route exact path="confirm-invitation/:token" element={<ConfirmInvitationPage />} />
                                </Route>
                                <Route path="slices" element={<SlicesPage />} />
                                <Route path="trainings" element={<TrainingPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </AppThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
