import React, {Fragment, useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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

& > .transcription-management {
    th {
        font-weight: 100;
        font-size: 1.6em;
        font-family: "KaiTi";
    }
    td {
        font-size: 0.8em;
    }
}

& > .target-value {
    font-family: "KaiTi";
    font-size: 1.5em;
}
& > .transcriptions {
    & > .add-new {
        cursor: pointer;
        color: #007bff;
        font-size: 0.8em;
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
                <div className="transcription-management">
                    <table>
                        <thead>
                            <tr>
                                <th>知</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>zhi</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <Fragment>
                    <div className="target-value">{expression.value}</div>
                    <div className="transcriptions">
                        <span className="add-new">nihao</span>    
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
