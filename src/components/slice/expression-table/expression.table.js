import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import ExpressionRow from "./expression-row";

const StyledExpressionTable = styled.div`
height: 100%;
`;

const ExpressionTable = ({nodeId, expressions, isEditable}) => {
    return (
        <StyledExpressionTable>
            {expressions.map((expr, i) => (
                <ExpressionRow 
                    key={expr.id}
                    index={expressions.length - i}
                    obj={expr}
                    nodeId={nodeId}
                    isEditable={isEditable}
                />
            ))}
        </StyledExpressionTable>
    );
};

ExpressionTable.propTypes = {
    nodeId: PropTypes.number.isRequired,
    expressions: PropTypes.array,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionTable;
