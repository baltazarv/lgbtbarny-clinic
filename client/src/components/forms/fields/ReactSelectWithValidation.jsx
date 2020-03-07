import React, { Component } from 'react';
// https://alligator.io/react/react-select/
import ReactSelect from 'react-select';

class ReactSelectWithValidation extends Component {
	render() {
		let {
			isValid
		} = this.props
		this.props.required && this.props.value.length > 0 ? isValid = true : isValid = false;

		const regColor = 'rgb(204, 204, 204);';
		const redBorderColor = '#d93025';
		const redBoxShadow = '0 0 0 0.2rem rgba(217, 48, 37, 0.25)';

		const customStyles = {
			control: (base, state) => ({
				...base,
				borderColor: isValid ? regColor : redBorderColor,
				'&:hover': {
					borderColor: isValid ? regColor : redBorderColor,
					boxShadow: isValid ? 0 : redBoxShadow
				}
			})
		}
		return <ReactSelect styles={customStyles} {...this.props} />
	}
}

export default ReactSelectWithValidation;
