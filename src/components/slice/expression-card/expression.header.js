import React, {Fragment, isValidElement, useEffect, useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TranscriptionEditor from "./transcription.editor";

const StyledExpressionHeader = styled.div`
position: relative;
border-bottom: 1px solid #fff;

&:hover {
    border-radius: 3px 3px 3px 0;
    border-bottom: 1px solid #eee;

    & > .expand-btn {
        display: block;
    }
}

& > .expand-btn {
    display: none;
    position: absolute;
    width: 30px;
    height: 13px;
    border-radius: 0 0 3px 3px;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background: #fff;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
}

& > .target-value {
    font-family: "KaiTi";
    font-size: 1.5em;
}
& > .transcriptions {
    padding-left: 2px;

    & > .tsc-item {
        position: relative;
        cursor: pointer;
        color: #007bff;
        font-size: 0.8em;

        &:not(:first-child) {
            margin-left: 7px;

            &::after {
                content: ",";
                position: absolute;
                top: 0;
                left: -7px;
            }
        }
        &:hover {
            text-decoration: underline;
        }
    }
}
`;

const ExpressionHeader = ({expression}) => {
    const [expanded, setExpanded] = useState(false);

    function toggle() {
        setExpanded(prev => !prev);
    }

    return (
        <StyledExpressionHeader>
            <span className="expand-btn" onClick={toggle} />
            {expanded ? (
                <TranscriptionEditor expression={expression} />
            ) : (
                <Fragment>
                    <div className="target-value">{expression.value}</div>
                    <div className="transcriptions">
                        {expression.transcriptions?.map(t => (
                            <span key={t.id} className="tsc-item">{t.value}</span>
                        ))}
                    </div>
                </Fragment>
            )}
        </StyledExpressionHeader>
    );
};

ExpressionHeader.propTypes = {
    expression: PropTypes.object.isRequired,
};

export default ExpressionHeader;
