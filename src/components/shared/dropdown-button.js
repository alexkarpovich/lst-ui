import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

import "./dropdown-button.scss";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

const DropdownButton = ({value, options, trigger, onChange, getOptionValue, getOptionLabel}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  function toggleOpen() {
    setIsOpen(prev => !prev);
  }

  function onSelectChange(selected) {
    toggleOpen();
    onChange(getOptionValue(selected));
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={toggleOpen}
      trigger={React.cloneElement(trigger, {onClick: toggleOpen})}
    >
      <Select
        autoFocus
        backspaceRemovesValue={false}
        components={{ IndicatorSeparator: null }}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        menuIsOpen
        onChange={onSelectChange}
        options={options}
        placeholder="Search..."
        styles={selectStyles}
        tabSelectsValue={false}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        value={value}
      />
    </Dropdown>
  );
}
DropdownButton.propTypes = {
    trigger: PropTypes.element.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
};

export default DropdownButton;

// styled components

const Menu = (props) => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: 'absolute',
        zIndex: 2,
      }}
      {...props}
    />
  );
};
const Blanket = (props) => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
);

const Dropdown = ({
  children,
  isOpen,
  trigger,
  onClose,
}) => (
  <div style={{ position: 'relative' }}>
    {trigger}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);