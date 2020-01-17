/**
 * Props for react-select:
 * * option: { value: 'xxx', label: 'Baltazar Villegas' }
 * * isMulti
 *
 * For react-select async option loading, import AsyncSelect from react-select/lib/Async or the AsyncCreatable -- can then use loadOptions, defaultOptions, cacheOptions props.
 *
 * Props for fornik:
 *  * name: fornik name
 *
 * Props for component functionality:
 *  * onChange: func to call when handle change
 *  * disabled: to add *
 *  * label: to add field label
 *  *
 */
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';
import { reqAsterisk } from '../formElements';
import classNames from 'classnames';

const Select = ({
	options,
	defaultValue,
	label,
	onChange,
	onBlur,
	required,
	isDisabled,
	name,
}) => {
	let [value, setValue] = useState(null);
	let [touched, setTouched] = useState(false);
	let [error, setError] = useState(null);

	const handleChange = selection => {
		setValue(selection);
		setError(validate());
		// setTouched(true);
		if (onChange) onChange(selection);
	}

	const handleBlur = evt => {
		setError(validate());
		setTouched(true);
		if (onBlur) onBlur(value);
	}

	const validate = () => {
		let _error = '';
		if (!value) _error = 'Select a repeat visitor to proceed. If not on pulldown, do not enter as repeat visitor';
		return _error;
	}

	let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (required) {
		_reqAsterisk = reqAsterisk;
	}

	const labelTxtStyle = classNames({
		'text-muted': isDisabled,
	})

	let formLabel = null;
	if (label) {
		formLabel = (<Form.Label column sm={4} className="text-md-right">
			{_reqAsterisk}<span className={labelTxtStyle}>{label}</span>
		</Form.Label>);
	}

	const customStyles = {
		control: (provided, state) => {
			let borderColor = 'hsl(0,0%,80%)';
			if(error && touched) borderColor = 'red';
			return { ...provided, borderColor };
		},
		placeholder: (provided, state) => {
			let color = '#212529';
			if(error && touched) {
				color = 'red';
			}
			return { ...provided, color };
		},
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? 'white' : 'black',
		}),
	}

	return (
		<>
			<Form.Group as={Row} controlId={name} className="mb-0">
				{formLabel}
				<Col sm={8}>
					<ReactSelect
						options={options}
						defaultValue={defaultValue}
						onChange={handleChange}
						onBlur={handleBlur}
						isClearable
						// isMulti
						// isDisabled={disabled}
						styles={customStyles}
					/>
				</Col>
			</Form.Group>
			<Row>
				<Col>
					{error &&
						touched && (
							<div className="text-danger small">{error}</div>
						)}
				</Col>
			</Row>
		</>
	)
}

export default Select;
