import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import SideMenu from "./components/menu/side-menu";

const StyledApp = styled.div`
width: 100%;

& > .outlet {
    margin-left: 48px;
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
