/**
 * Bootstrap props sent in props object:
 * `controlId` taken from Redux Form `name`
 */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField, ErrorMessage } from 'formik'; // , useFormikContext
import { reqAsterisk } from '../formElements';

const InputField = ({
	label,
	info,
	style,
	required,
	onBlur,
	...props
}) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input> and also replace ErrorMessage entirely.

	const [field, meta] = useField(props);
	const { name } = field;
	// const { setTouched } = useFormikContext();

	// console.log('props', name, props) // ...placeholder, style
	// console.log('field', field) // name, value, onChange, onBlur
	// console.log('meta', meta) // value, error, touched, initialValue

	let formLabel = null;
	if (label) formLabel = <Form.Label>{label}</Form.Label>

	let controlStyle = {}
	if (style) controlStyle = style;

	if (meta.error && meta.touched) {
		controlStyle = { ...controlStyle, border: '1px solid #d93025' };
	}

	let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
	if (required) {
		_reqAsterisk = reqAsterisk;
	}

	let infoTxt = null;
	if (info) infoTxt = <Form.Text className="text-muted mt-0 mb-1">{info}</Form.Text>

	// const handleBlur = evt => {
	// 	if (onBlur) {
	// 		onBlur(evt);
	// 		if (name === 'email' || name === 'phone') {
	// 			setTouched({
	// 				phone: true,
	// 				email: true,
	// 			}, true)
	// 		}
	// 	}
	// }

	return (
		<>
			<Form.Group controlId={name}>
				{/* <label htmlFor={props.id || props.name}>{label}</label> */}
				{formLabel}{label && _reqAsterisk}
				{infoTxt}
				<Form.Control
					{...field}
					{...props}
					// onBlur={handleBlur}
					style={controlStyle}
				/>{!label && _reqAsterisk}
				{/* {meta.touched && meta.error ? (
					<div className="error" style={{ color: "red" }}>{meta.error}</div>
				) : null} */}
				<ErrorMessage name={name} component="div" className="text-danger small" />
			</Form.Group>
		</>
	);
};

export default InputField;
