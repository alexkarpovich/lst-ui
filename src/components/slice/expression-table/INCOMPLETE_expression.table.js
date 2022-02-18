import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {VariableSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import ExpressionRow from "./expression-row";

const StyledExpressionTable = styled.div`
height: 100%;
`;

const Row = ({ index, data, style }) => {
    const rowRef = useRef(null);
    const {expressions, nodeId, isEditable, setRowHeight} = data;

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.clientHeight);
        }
    }, [rowRef]);
    
    return (
        <div ref={rowRef} style={style}>
            <ExpressionRow
                key={index}
                index={index}
                obj={expressions[index]}
                nodeId={nodeId}
                isEditable={isEditable}
            />
        </div>
    );
};

const ExpressionTable = ({nodeId, expressions, isEditable}) => {
    const listRef = useRef();
    const [rowHeightMap, setRowHeightMap] = useState({});

    const getRowHeight = (index) => {
        console.log(index, rowHeightMap[index]);
        return rowHeightMap[index] || 82;
    };

    const setRowHeight = (index, height) => {
        listRef.current.resetAfterIndex(0);
        setRowHeightMap(prev => ({...prev, [index]: height}));
    };

    return (
        <StyledExpressionTable>
            <AutoSizer>
                {({width, height}) => (
                    <VariableSizeList
                        ref={listRef}
                        height={height}
                        itemCount={expressions.length}
                        itemSize={getRowHeight}
                        width={width}
                        itemData={{
                            expressions, 
                            nodeId, 
                            isEditable,
                            setRowHeight,
                        }}
                    >
                        {Row}
                    </VariableSizeList>
                )}
            </AutoSizer>
        </StyledExpressionTable>
    );
};

ExpressionTable.propTypes = {
    nodeId: PropTypes.number.isRequired,
    expressions: PropTypes.array,
    isEditable: PropTypes.bool.isRequired,
};

export default ExpressionTable;
