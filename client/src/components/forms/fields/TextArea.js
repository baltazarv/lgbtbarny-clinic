import React from 'react';
import classNames from 'classnames';
import { Form } from 'react-bootstrap';
import { InputFeedback } from '../formElements';

const TextArea = ({
	field: { name, value, onChange, onBlur },
	form: { errors, touched, setFieldValue },
	id,
	label,
	placeholder,
	rows,
	className,
	...props
}) => {
	return (
		<div>
			<Form.Group className="mb-1">
				<Form.Label>{label}</Form.Label>
				<Form.Control
				as="textarea"
				type="textarea"
				name={name}
				id={id}
				rows={rows}
				placeholder={placeholder}
				onChange={onChange}
				onBlur={onBlur}
				className={classNames(className)}
				value={value}
			/>
			</Form.Group>
			{touched[name] && <InputFeedback error={errors[name]} />}
		</div>
	)
};

export default TextArea;
