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
import { Select, Button, Tooltip } from 'antd';
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

	// refresh
	onRefresh,
	placeholder,
	loading = false,
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

	let selectErrorClass = '';
	if (touched && error) selectErrorClass = 'has-error';

	return (
		<>
			<Form.Group as={Row} controlId={name} className="mb-0">
				<Form.Label column xs="12" sm="3" md="4" className="text-sm-right">
					{_reqAsterisk}<span className={labelTxtStyle}>{label}</span>
				</Form.Label>
				<Col xs="9" sm="7" md="6">
					<Form.Text className="text-muted mt-0 mb-1">{info}</Form.Text>
					<div className={selectErrorClass}>
						<Select
							showSearch
							style={{ width: '100%' }}
							placeholder={placeholder}
							loading={loading}
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
				<Col xs="3" sm="2" className="justify-content-left">
					<Tooltip title="refresh visitor options">
						<Button
							shape="circle"
							onClick={onRefresh}
							className="mr-3 pb-1"
							icon="reload"
						/>
					</Tooltip>
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
