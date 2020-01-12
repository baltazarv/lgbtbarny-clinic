import React, { useState } from 'react';
import { withFormik, Form as FormikForm, useField } from 'formik';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

import InputField from '../../../components/form/InputField';

const CheckboxField = ({ children, ...props }) => {
	// We need to tell useField what type of input this is
	// since React treats radios and checkboxes differently
	// than inputs/select/textarea.
	const [field, meta] = useField({ ...props, type: 'checkbox' });
	return (
		<>
			<label className="checkbox">
				<input type="checkbox" {...field} {...props} />
				{children}
			</label>
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</>
	);
};

const MySelect = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<select {...field} {...props} />
			{meta.touched && meta.error ? (
				<div>{meta.error}</div>
			) : null}
		</>
	);
};

const reqAsterisk = <span className="text-danger">*</span>;

const IntakeForm = props => {

	const {
		handleBlur,
		errors,
		values,
	} = props;

	// console.log('intake form', props)

	const cardStyle = {
		backgroundClip: "border-box",
		border: "1px solid rgba(0, 0, 0, 0.125)",
		borderRadius: "0.25rem",
	}

	return <Card style={cardStyle}>
		<Card.Body>
			<FormikForm>
				<Row>
					<Col className="label form-label mb-2">New Visitor Name</Col>
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
				{/* <Form.Row>
						<Col> */}
				<InputField
					name="preferName"
					type="text"
					label="Preferred Name(s)"
					placeholder="Preferred Name(s)"
					style={{
						width: "98%",
						display: "inline",
					}}
				/>
				{/* </Col>
					</Form.Row> */}
				<Card style={cardStyle}>
					<Card.Body className="pb-0">
						<Card.Title className="small">
							{reqAsterisk} If no email is provided, a phone number is necessary.
							</Card.Title>
						<Form.Row>
							<Col md={7}>
								<InputField
									name="email"
									type="email"
									label="Email Address"
									placeholder="email@address.com"
									onBlur={handleBlur}
									required={!values.phone}
									style={{
										width: "100%",
										display: "inline",
									}}
								/>
							</Col>
							<Col md={5}>
								<InputField
									name="phone"
									type="text"
									label="Phone #"
									placeholder="123-456-7890"
									onBlur={handleBlur}
									required={!values.email}
									style={{
										width: "100%",
										display: "inline",
									}}
								/>
							</Col>
						</Form.Row>
					</Card.Body>
				</Card>
				<MySelect label="Job Type" name="jobType">
					<option value="">Select a job type</option>
					<option value="designer">Designer</option>
					<option value="development">Developer</option>
					<option value="product">Product Manager</option>
					<option value="other">Other</option>
				</MySelect>
				<CheckboxField name="acceptedTerms">
					I accept the terms and conditions
							</CheckboxField>
				<Row className="justify-content-start">
					<Col>
						<Button
							variant="primary"
							type="submit"
						>
							Submit
							</Button>
					</Col>
				</Row>
				{/* <button type="submit">Submit</button> */}
			</FormikForm>
		</Card.Body>
	</Card>
}

const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	acceptedTerms: false, // added for our checkbox
	jobType: '', // added for our select
}

const validate = (values, props) => {
	// console.log('values', values, 'props', props)
	const errors = {};

	if (!values.firstName) {
		errors.firstName = 'First name is required.';
	}

	if (!values.lastName) {
		errors.lastName = 'Last name is required.';
	}

	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address.';
	}

	if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i.test(values.phone)) {
		errors.phone = "Invalid phone number."
	}

	if (!values.email && !values.phone) {
		errors.email = 'Enter an email...';
		errors.phone = 'Or enter a phone #.';
	}

	return errors;
};

const handleSubmit = (values, { setSubmitting }) => {
	setTimeout(() => {
		alert(JSON.stringify(values, null, 2));
		setSubmitting(false);
	}, 400);
}

const IntakeFormikForm = withFormik({
	mapPropsToValues: () => (initialValues),
	validate,
	handleSubmit,
	displayName: 'intakeForm',
})(IntakeForm);

const Intake = props => {

	const [isRepeat, setIsRepeat] = useState(false);

	const handleRepeatSwitch = props => {
		setIsRepeat(!isRepeat);
	}

	const repeatInstructions = () => {
		const style = "mb-3 small";
		if (isRepeat) {
			return <Col className={style}>&nbsp;<strong>Yes &mdash; </strong> Find visitor from pulldown and update info:</Col>
		}
		return <Col className={style}>&nbsp;<strong>No &mdash; </strong> Enter new visitor:</Col>
	};

	const { clinicTitle } = props;

	return (
		<>
			<h1 className="h2"><em>{clinicTitle}</em> Intake</h1>
			<p className="text-danger small">*Required</p>
			<Row>
				<Col>
					<Form.Group className="mb-2">
						{reqAsterisk}
						<Form.Label className="mb-0">Have you been to the clinic before?&nbsp;&nbsp;</Form.Label>
						<span className="ml-2">
							No&nbsp;&nbsp;<Form.Check
								type="switch"
								id="custom-switch"
								aria-label="repeat"
								label="Yes"
								inline={true}
								onChange={handleRepeatSwitch}
							/>
						</span>
						{/* <div className="valid-feedback" style={{display: "block"}}>Yes</div> */}
					</Form.Group>
				</Col>
			</Row>
			<Row>
				{repeatInstructions()}
			</Row>
			{isRepeat ? null : <IntakeFormikForm />}
		</>
	);
};

export default Intake;
