/**
 * Props for antd:
 * * options: <Options>{value}</Options>
 * * mode: 'multiple', 'tags'
 *
 * Props for fornik:
 *  * name: fornik name
 *
 * Props for component functionality:
 *  * onChange: func to call when handle change
 *  * disabled: to add required asterisk
 *  * label: to add field label
 *  *
 */
import React, { useState } from 'react';
import { Select } from 'antd';
import { Form, Row, Col } from 'react-bootstrap';
import { reqAsterisk } from '../../forms/formElements';
import classNames from 'classnames';

const VisitorSelect = ({
	options,
	name,
	value,
	onChange,
	onBlur,
	label,
	required,
	isDisabled,
	info,
}) => {
	let [touched, setTouched] = useState(false);
	let [error, setError] = useState(null);

	const handleChange = selection => {
		if (onChange) onChange(selection);
		setError(validate());
	}

	const handleBlur = evt => {
		setTouched(true);
		if (onBlur) onBlur(value);
		setError(validate());
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
	let inputCols = 12;
	if (label) {
		formLabel = (<Form.Label column sm={4} className="text-md-right">
			{_reqAsterisk}<span className={labelTxtStyle}>{label}</span>
		</Form.Label>);
		inputCols = 8;
	}

	let infoTxt = null;
	if (info) infoTxt = <Form.Text className="text-muted mt-0 mb-1">{info}</Form.Text>

	let selectErrorClass = '';
	if (touched && error) selectErrorClass = 'has-error';

	return (
		<>
			<Form.Group as={Row} controlId={name} className="mb-0">
				{formLabel}
				<Col sm={inputCols}>
					{infoTxt}
					<div className={selectErrorClass}>
						<Select
							showSearch
							style={{ width: '100%' }}
							placeholder="Select..."
							value={value}
							onChange={handleChange}
							onBlur={handleBlur}
							optionFilterProp="children"
							allowClear={true}
							autoFocus={true}
						>
							{options}
						</Select>
					</div>
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

export default VisitorSelect;
