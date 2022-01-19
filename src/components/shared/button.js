import styled from "styled-components";

const StyledButton = styled.button`
display: inline-block;
padding: 7px;
font-size: 0.8em;
cursor: pointer;
text-align: center;
text-decoration: none;
text-transform: uppercase;
outline: none;
color: #fff;
background-color: #6eb4c9;
border: none;
border-radius: 5px;
box-shadow: 0 1px #999;
width: 100%;

&:hover {
    background-color: #7ac7df;
}

&:active {
    background-color: #5d97a8;
    box-shadow: 0 0 #666;
    transform: translateY(2px);
}
`;

export default StyledButton;
