import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.scss";
import { AuthProvider } from "./providers/auth.provider";
import GuestRoute from "./utils/routing.utils";
import SignupPage from "./components/auth/signup.page";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter basename='/'>
                <Routes>
                    <Route exact path="/signup" element={<GuestRoute />}>
                        <Route exact path='' element={<SignupPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
