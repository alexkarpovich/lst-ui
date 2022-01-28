import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
    width: 20px;
    height: 20px;
    stroke: #23c274;
    stroke-width: 6;

    .circle {
        stroke-dasharray: 320;
        stroke-dashoffset: 320;
        fill: ${({active, progress}) => 
            (!active && progress === 0 && '#d2d2d2') ||
            (active && '#234dc2') || 
            '#23c274'
        };
        transition: stroke-dashoffset 0.5s,
            fill 0.5s 0.3s cubic-bezier(0.45, 0, 0.55, 1);
    }

    .check {
        stroke-dasharray: 70;
        stroke-dashoffset: ${({active, progress}) => !active && progress === 0 ? 70 : 0};
        stroke: #fff;
        fill: none;
        transition: all 0.2s 0.2s cubic-bezier(0.45, 0, 0.55, 1);
    }
}

.progress-line {
    width: 140px;
    margin: 0 10px;
    height: 4px;
    overflow: hidden;
    display: inline-block;
    background: ${({active, progress}) => 
        (!active && progress === 0 && '#d2d2d2') ||
        (active && '#234dc2') || 
        '#23c274'
    };
    border-radius: 10px;

    .progress-percent {
        height: inherit;
        background: #23c274;
        width: ${({progress}) => progress}%;
        transition: all 0.2s 0.2s cubic-bezier(0.45, 0, 0.55, 1);
    }
}
`;

const Stepper = ({steps, onResetClick}) => {
    const [stepStates, setStepStates] = useState(prepareStepStates(steps));

    useEffect(() => {
        setStepStates(prepareStepStates(steps));
    }, [JSON.stringify(steps)])

    function prepareStepStates(steps) {
        let foundActive = false;

        return steps.map(step => {
            if (step.progress < 100 & !foundActive) {
                foundActive = true;
                step.active = true;
            } else {
                step.active = false;
            }

            return step;
        });
    }

    function handleReset() {
        onResetClick && onResetClick();
    }

    return (
        <StyledStepper>
            <div className="container">
                <StyledCheckbox key={-1} active={false} progress={100} onClick={handleReset}>
                    <svg id="checkbox" viewBox="0 0 100 100">
                        <circle className="circle" cx="50.5" cy="49" r="45" />
                        <circle cx="50.5" cy="49" r="25" fill="#234dc2" />
                    </svg>
                </StyledCheckbox>
                {stepStates.map((step, i) => (
                    <StyledCheckbox key={i} active={step.active} progress={step.progress}>
                        <div className="progress-line">
                            <div className="progress-percent" />
                        </div>
                        <svg id="checkbox" viewBox="0 0 100 100">
                            <circle className="circle" cx="50.5" cy="49" r="45" />
                            {step.progress === 100 && (
                                <polyline className="check" points="28.5,51.9 41.9,65.3 72.5,32.8 " />
                            )}
                        </svg>
                    </StyledCheckbox>
                ))}
            </div>
        </StyledStepper>
    );
};

Stepper.propTypes = {
    steps: PropTypes.array.isRequired,
    onResetClick: PropTypes.func,
};

export default Stepper;
