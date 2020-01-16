import React from "react";
import Form from 'react-bootstrap/Form';
import classNames from "classnames";
import { InputFeedback } from '../formElements';
import { reqAsterisk } from '../formElements';

const RadioButtonGroup = ({
	value,
	error,
	touched,
	id,
	label,
	className,
	children,
	required,
}) => {

	const classes = classNames(
		"input-field",
		{
			"is-success": value || (!error && touched), // handle prefilled or user-filled
			"is-error": !!error && touched
		},
		className
	);

	let formLabel = null;
	if (label) formLabel = <Form.Label className="mb-1">{label}</Form.Label>

	let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (required) {
		_reqAsterisk = reqAsterisk;
	}

	return (
		<Form.Group controlId={id} className={classes}>
			<fieldset>
				{formLabel}{_reqAsterisk}
				{children}
				{touched && <InputFeedback error={error} />}
			</fieldset>
		</Form.Group>
	);
};

export default RadioButtonGroup;
