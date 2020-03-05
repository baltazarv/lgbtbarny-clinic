import React from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

const toolbarStyles = {
  backgroundColor: '#39C1FA',
	borderBottom: '2px solid #ffa9a1',
	borderRadius: 'calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0',
}

const toggleBtnStyles = {
  borderRight: "1px solid rgb(255, 255, 255, .5)",
  borderLeft: "1px solid rgb(255, 255, 255, .5)",
}

const ToggleButtons = ({
  settings,
  callback,
}) => {

	const onToggle = val => {
		callback(val);
	}

  let toggleButtons = [];
  if (settings) {
    for (var item in settings) {
      let key = item, value = settings[item];
      toggleButtons.push(<ToggleButton key={key} value={key} className="btn-sm" style={toggleBtnStyles}>{value.buttonLabel}</ToggleButton>)
    }
  }

  return <ButtonToolbar style={toolbarStyles}>
    <ToggleButtonGroup type="radio" name="options" onChange={onToggle}>
      {toggleButtons}
    </ToggleButtonGroup>
  </ButtonToolbar>
}

export default ToggleButtons;
