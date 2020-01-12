/**
 * Bootstrap props sent in props object:
 * `controlId` taken from Redux Form `name`
 */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField, useFormikContext, ErrorMessage } from 'formik';

const InputField = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and also replace ErrorMessage entirely.

	const [field, meta] = useField(props);
	const { setTouched } = useFormikContext();

	// console.log('props', field.name, props) // ...placeholder, style
	// console.log('field', field) // field: name, value, onChange, onBlur
	// console.log('meta', meta) // value, error, touched, initialValue

	let formLabel = null;
	if (label) formLabel = <Form.Label>{label}</Form.Label>

	let controlStyle = {}
	if (props.style) controlStyle = props.style;

	if (meta.error && meta.touched) {
		controlStyle = {...controlStyle, border: '1px solid #d93025'};
	}

	let reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (props.required) reqAsterisk = <span className="text-danger">* </span>;

	const handleBlur = evt => {
		if (props.onBlur) {
			props.onBlur(evt);
			if (field.name === 'email' || field.name === 'phone') {
				setTouched({
					phone: true,
					email: true,
				}, true)
			}
		}
	}

	return (
		<>
			<Form.Group controlId={field.name}>
				{/* <label htmlFor={props.id || props.name}>{label}</label> */}
				{formLabel}&nbsp;
				{/* <input className="text-input" {...field} {...props} /> */}
				{reqAsterisk}<Form.Control
					{...field}
					{...props}
					onBlur={handleBlur}
					style={controlStyle}
				/>
				{/* {meta.touched && meta.error ? (
					<div className="error" style={{ color: "red" }}>{meta.error}</div>
				) : null} */}
				<ErrorMessage name={field.name} component="div" className="text-danger small" />
			</Form.Group>
		</>
	);
};

export default InputField;
