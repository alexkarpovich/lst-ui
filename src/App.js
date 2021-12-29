import React from "react";
import { Outlet } from "react-router-dom";

import "./App.scss";
import SideMenu from "./components/menu/side-menu";


function App() {
    return (
        <div className="app-container">
            <SideMenu />
            <div className="outlet">
                <Outlet />
            </div>            
        </div>
    );
}

export default App;
