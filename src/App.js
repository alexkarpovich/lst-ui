import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import SideMenu from "./components/menu/side-menu";

const StyledApp = styled.div`
display: flex;
height: 100%;
width: 100%;
position: absolute;
overflow-y: auto;

& > .outlet {
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
