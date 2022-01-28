import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const STATUS_DEFAULT = 0;
const STATUS_ACTIVE = 1;
const STATUS_COMPLETE = 2;

const StyledStepper = styled.div`
grid-row: 1 / 2;
grid-column: 1 / -1;
align-self: center;

:host {
    margin-top: 20px;
    user-select: none;
    display: grid;
    grid-template-rows: 80px 1fr;
    grid-row-gap: 100px;
    justify-content: center;
    grid-template-columns: min-content;
}
  
.container {
    display: inline-flex;
    position: relative;
}
`;

const StyledCheckbox = styled.div`
display: flex;
align-items: center;
position: relative;

svg#checkbox {
    width: 15px;
    height: 15px;
    stroke: #23c274;
    stroke-width: 6;

    .circle {
        stroke-dasharray: 320;
        stroke-dashoffset: 320;
        fill: ${({status}) => 
            (status === STATUS_DEFAULT && '#d2d2d2') ||
            (status === STATUS_ACTIVE && '#234dc2') || 
            '#23c274'
        };
        transition: stroke-dashoffset 0.5s,
            fill 0.5s 0.3s cubic-bezier(0.45, 0, 0.55, 1);
    }

    .check {
        stroke-dasharray: 70;
        stroke-dashoffset: ${({status}) => status === STATUS_DEFAULT ? 70 : 0};
        stroke: #fff;
        fill: none;
        transition: all 0.5s 0.5s cubic-bezier(0.45, 0, 0.55, 1);
    }
}

.progress-line {
    width: 140px;
    margin: 0 10px;
    height: 4px;
    overflow: hidden;
    display: inline-block;
    background: #d2d2d2;
    border-radius: 10px;

    .progress-percent {
        height: inherit;
        background: ${({active}) => active ? '#234dc2' : '#23c274'}
        width: ${({progress}) => progress}%;
        transition: all 0.5s 0.5s cubic-bezier(0.45, 0, 0.55, 1);
    }
}
`;

const Stepper = ({steps}) => {
    const []
    return (
        <StyledStepper>
            <div className="container">
                {steps.map((step, i) => (
                    <StyledCheckbox progress={step.progress}>
                        <svg id="checkbox" viewBox="0 0 100 100">
                            <circle className="circle" cx="50.5" cy="49" r="45" />
                            <polyline className="check" points="28.5,51.9 41.9,65.3 72.5,32.8 " />
                        </svg>
                        {(i !== steps.length - 1) && (
                            <div className={`progress-line ${step.progress < 100 ? 'active' : 'complete'}`}>
                                <div className="progress-percent"></div>
                            </div>
                        )}
                    </StyledCheckbox>
                ))}
            </div>
        </StyledStepper>
    );
};

Stepper.propTypes = {
    steps: PropTypes.array.isRequired,
};

export default Stepper;
