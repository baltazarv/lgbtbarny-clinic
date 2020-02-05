import React from 'react';
import { Form } from 'react-bootstrap';
import classNames from 'classnames';
import { reqAsterisk, InputFeedback } from '../formElements';

const TextArea = ({
	field: { name, value, onChange, onBlur },
	form: { errors, touched, setFieldValue },
	id,
	label,
	description,
	placeholder,
	rows,
	className,
	required,
	...props
}) => {

	let formLabel = null;
	if (label) formLabel = <Form.Label className="mb-1">{label}</Form.Label>

	let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (required) {
		_reqAsterisk = reqAsterisk;
	}

	let descText = null;
	if (description) descText = <div className="mb-2 small  text-muted">{description}</div>

	return (
		<div>
			<Form.Group controlId={id} className="mb-1">
				{formLabel}{_reqAsterisk}
				{descText}
				<Form.Control
					as="textarea"
					type="textarea"
					name={name}
					// id={id}
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
