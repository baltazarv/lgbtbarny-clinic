import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useField, ErrorMessage } from 'formik';
import { reqAsterisk } from './formElements'

const CheckboxField = ({
	title,
	children,
	label,
	required,
	...props
}) => {
	// We need to tell useField what type of input this is
	// since React treats radios and checkboxes differently
	// than inputs/select/textarea.
	const [field, meta] = useField({ ...props, type: 'checkbox' });
	const { name } = field;

	const style = {
		check: {
			color: "#000"
		}
	}
	if (meta.touched && meta.error) style.check.color = "#d93025";

	let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (required) _reqAsterisk = reqAsterisk;

	return (
		<>
			<Form.Group controlId={name} className="mb-3">
				<Row className="mb-1">
					<Col className="form-label">{_reqAsterisk}{title}</Col>
				</Row>
				<Row className="mb-2">
					<Col>{children}</Col>
				</Row>
				<Row className="font-weight-bold">
					<Col>
						<Form.Check
							style={style.check}
							label={label}
							{...field}
							{...props}
						/>
					</Col>
				</Row>
				<ErrorMessage name={name} component="div" className="text-danger small" />
			</Form.Group>
		</>
	);
};

export default CheckboxField;
