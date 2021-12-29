import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.scss";
import { AuthProvider } from "./providers/auth.provider";
import {GuestRoute, MemberRoute} from "./utils/routing.utils";
import AuthPage from "./components/auth/auth.page";
import HomePage from "./components/home.page";
import SignupConfirmPage from "./components/auth/signup-confirm.page";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter basename='/'>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route exact path="/auth" element={<GuestRoute />}>
                        <Route exact path='/auth' element={<AuthPage />} />
                        <Route exact path='/auth/signup/:token' element={<SignupConfirmPage />} />
                    </Route>
                    <Route path="/" element={<MemberRoute />}>
                        <Route path="/dashboard" element={<HomePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
