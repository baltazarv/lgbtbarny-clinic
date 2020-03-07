/**
 * Used with Formik
 */
import React from 'react';
import { Select as AntSelect } from 'antd';
import { Form, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { reqAsterisk, InputFeedback } from '../formElements';

const Select = ({
	// data array
	options,
	// function to transform data array into select options, eg, etPeopleOptions, getLawTypeOptions
	optFunc,

	// name for formik touched and errors
	name,
	touched,
	error,
	// formik values
	value,
	// calls formik setFieldValue
	onChange,
	// calls formik setFieldTouched
	onBlur,

	// optional
	label,
	// for asterisk
	required,
	isDisabled,
	info,
}) => {

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
		formLabel = (<Form.Label column md={3} className="text-md-right">
			{_reqAsterisk}<span className={labelTxtStyle}>{label}</span>
		</Form.Label>);
		inputCols = 9;
	}

	let infoTxt = null;
	if (info) infoTxt = <Form.Text className="text-muted mt-0 mb-1">{info}</Form.Text>

	return (
		<>
			<Form.Group as={Row} controlId={name} className="mb-0">
				{formLabel}
				<Col md={inputCols}>
					{infoTxt}
					<AntSelect
						// key={new Date()}
						mode="multiple"
						style={{ width: '100%' }}
						placeholder="Select..."
						// defaultValue=""
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						optionFilterProp="children"
						allowClear={true}
					// autoFocus={true}
					>
						{optFunc(options)}
					</AntSelect>
				</Col>
			</Form.Group>
			{touched && <InputFeedback error={error} />}
		</>
	)
}

export default Select;
