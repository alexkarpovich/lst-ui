import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import SideMenu from "./components/menu/side-menu";

const StyledApp = styled.div`
display: flex;
position: fixed;
height: 100%;
width: 100%;
overflow-y: auto;

& > .outlet {
    padding-left: 48px;
    width: 100%;
}
`;

function App() {
    return (
        <StyledApp>
            <SideMenu />
            <div className="outlet">
                <Outlet />
            </div>            
        </StyledApp>
    );
}

export default App;
