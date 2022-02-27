import React from "react";
import styled from "styled-components";

const StyledEmptyNodeView = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;

& > .container {
    & > div {
        text-align: center;
        font-weight: 200;

        &:first-child {
            text-transform: uppercase;
            font-size: 2em;
        }
    }
}
`;

const EmptyNodeView = () => {
    return (
        <StyledEmptyNodeView>
            <div className="container">
                <div>No node selected</div>
                <div>Please select node(s) from menu.</div>
            </div>
        </StyledEmptyNodeView>
    );
};

export default EmptyNodeView;
