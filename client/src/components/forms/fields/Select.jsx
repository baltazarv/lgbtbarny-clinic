/**
 * Used with Formik
 */
import React from 'react';
import { Select as AntSelect } from 'antd';
import { Form, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { reqAsterisk, InputFeedback } from '../formElements';

const Select = ({
	// antd <Options> array
	options,

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
	className = "mb-0",
	// for asterisk
	required,
	mode = '', // multiple, tags
	placeholder = 'Select...',
	loading = false,
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
		formLabel = (<Form.Label column sm={4} className="text-sm-right">
			{_reqAsterisk}<span className={labelTxtStyle}>{label}</span>
		</Form.Label>);
		inputCols = 8;
	}

	let infoTxt = null;
	if (info) infoTxt = <Form.Text className="text-muted mt-0 mb-1">{info}</Form.Text>

	return (
		<>
			<Form.Group as={Row} controlId={name} className={className}>
				{formLabel}
				<Col sm={inputCols}>
					{infoTxt}
					<AntSelect
						mode={mode}
						showSearch={mode === 'multiple' ? true : false}
						loading={loading}
						style={{ width: '100%' }}
						placeholder={placeholder}
						// defaultValue=""
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						optionFilterProp="children"
						allowClear={true}
						// autoFocus={true}
						className="mt-1" // help vert alignment
					>
						{options}
					</AntSelect>
					{touched && <InputFeedback error={error} />}
				</Col>
			</Form.Group>
		</>
	)
}

export default Select;
