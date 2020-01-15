import React from 'react';
import { withFormik, Form as FormikForm } from 'formik';
import { Form, Row, Col, Button } from 'react-bootstrap';
import InputField from './fields/InputField';
// import styles from './LawyerAddForm.module.css';

const initialValues = {

}

const validate = (values) => {
	const errors = {};

	return errors;
}

const handleSubmit = (values, { setSubmitting }) => {
	setTimeout(() => {
		alert(JSON.stringify(values, null, 2));
		setSubmitting(false);
	}, 400);
}

const LawyerAddForm = props => {

	const {
		onHide,
		// handleBlur,
		// errors,
		values,
		// isRepeat,
	} = props;

	return <>
		<FormikForm>
			<Row>
				<Col className="label form-label mb-2">Name</Col>
			</Row>
			<Form.Row>
				<Col sm={5}>
					<InputField
						name="firstName"
						type="text"
						placeholder="First Name"
						required={true}
						style={{
							width: "86%",
							display: "inline",
						}}
					/>
				</Col>
				<Col sm={2}>
					<InputField
						name="middleName"
						type="text"
						placeholder="Middle Name"
						style={{
							width: "84%",
							display: "inline",
						}}
					/>
				</Col>
				<Col sm={5}>
					<InputField
						name="lastName"
						type="text"
						placeholder="Last Name"
						required={true}
						style={{
							width: "86%",
							display: "inline",
						}}
					/>
				</Col>
			</Form.Row>
			<Form.Row>
				<Col>
					<InputField
						name="email"
						type="email"
						label="Email Address"
						placeholder="email@address.com"
						required={!values.phone}
						style={{
							width: "82%",
							display: "inline",
						}}
					/>
				</Col>
			</Form.Row>
			<hr />
			<Row >
				<Col className="d-flex justify-content-end">
				<Button variant="secondary" className="m-1" onClick={onHide}>
						Cancel
						</Button>
					<Button variant="primary" type="submit" className="m-1">
						Add Lawyer
						</Button>
				</Col>
			</Row>
		</FormikForm>
	</>
}

export default withFormik({
	mapPropsToValues: () => (initialValues),
	validate,
	handleSubmit,
	displayName: 'lawyersForm',
})(LawyerAddForm);
