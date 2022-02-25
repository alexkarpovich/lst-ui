import React, {useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Input from "../../shared/input";

const StyledEditableName = styled.div`
font-size: 0.8em;
font-weight: 300;
white-space: nowrap;

input {
    background: transparent;
    padding: 0;
    margin: 0;
    width: 100%;
    border: none;
    outline: none;
    color: #fff;
}
`;

const EditableName = ({obj, onChange}) => {
    const [name, setName] = useState(obj.name);
    
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleNameChange();
        }

        if (e.key === "Escape") {
            console.log("cancelling editing");
        }
    }

    function handleNameChange() {
        onChange && onChange(name);
    }

    return (
        <StyledEditableName>
            {obj.editMode ? (
                <Input 
                    autoFocus
                    value={name} 
                    placeholder="Enter node name..."
                    onKeyDown={handleKeyDown} 
                    onChange={({target}) => setName(target.value)}
                    onBlur={handleNameChange} 
                />
            ) : (
                <span>{obj.name}</span>
            )}
        </StyledEditableName>
    );
};

EditableName.propTypes = {
    obj: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

export default EditableName;
