import React from "react";
import {createGlobalStyle, ThemeProvider} from "styled-components";

const theme = {
    colors: {
        bgMenu: '#293a4c',
        bgActiveMenu: '#17212b',
        colorMenu: '#419fd9',
        linkColor: '#007bff',
    },
};

const GlobalStyle = createGlobalStyle`
*, ::before, ::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    margin: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
`;

export const AppThemeProvider = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {props.children}
        </ThemeProvider>
    );
};