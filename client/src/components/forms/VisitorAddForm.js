import React from 'react';
import { withFormik, Form as FormikForm } from 'formik';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

import InputField from './fields/InputField'
import CheckboxField from './fields/CheckboxField';
import { reqAsterisk } from './fields/formElements';

// import MultiSelectField from './fields/MultiSelectField';

const initialValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	location: '',
	visitor: '',
	acknowledgment: false,
}

const validate = (values, props) => {
	const errors = {};

	if (!values.firstName) {
		errors.firstName = 'First name is required.';
	}

	if (!values.lastName) {
		errors.lastName = 'Last name is required.';
	}

	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) && values.email) {
		errors.email = 'Invalid email address.';
	}

	if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i.test(values.phone) && values.phone) {
		errors.phone = "Invalid phone number."
	}

	if (!values.email && !values.phone) {
		errors.email = 'Enter an email address or...';
		errors.phone = 'If no email, enter a phone #.'; // would be good to know if email was touched
	}

	if (!values.location) {
		errors.location = 'City, State, Zip is is required.';
	}

	if (!values.acknowledgment) {
		errors.acknowledgment = 'You must accept the terms and conditions.';
	}

	if (!values.car) {
		errors.car = 'Car please!!!';
	}

	if (!values.visitor) {
		errors.visitor = 'Please select a visitor to proceed.';
	}

	return errors;
};

const handleSubmit = (values, { setSubmitting }) => {
	setTimeout(() => {
		alert(JSON.stringify(values, null, 2));
		setSubmitting(false);
	}, 400);
}

const VisitorAddForm = props => {
	const {
		values,
		// touched,
		// errors,
		// dirty,
		// isSubmitting,
		// handleChange,
		// handleBlur,
		// handleSubmit,
		// handleReset,
	} = props;

	// add to global style sheet
	const cardStyle = {
		backgroundClip: "border-box",
		border: "1px solid rgba(0, 0, 0, 0.125)",
		borderRadius: "0.25rem",
	}

	return <Card style={cardStyle}>
		<Card.Body>
			<FormikForm>
				<Row>
					<Col className="label form-label mb-2">Visitor Name</Col>
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
				<Card style={cardStyle} className="mb-3">
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
									// onBlur={handleBlur}
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
									// onBlur={handleBlur}
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
				<InputField
					name="location"
					type="text"
					label="City, State, Zip"
					placeholder="NY, NY 10001"
					required={true}
					style={{
						width: "98%",
						display: "inline",
					}}
				/>
				<div className="mb-4">
					<InputField
						name="gender"
						type="text"
						label="Gender and/or Sexuality"
						placeholder="queer, trans, non-binary, pansexual, CIS, lesbian, gay / male, female"
						style={{
							width: "98%",
						}}
					/>
				</div>
				<div className="mb-4">
					<CheckboxField
						name="acknowledgment"
						title="Acknowledgment"
						label="I understand and agree to the terms and conditions of the clinic."
						required={true}
					>
						I understand that LeGaL does not provide representation, nor will LeGaL or the volunteer attorney become my legal representative by virtue of the Clinic consultation. I understand that the assistance provided by the volunteer attorney is limited to the Clinic session. I understand that the volunteer attorney is not obligated to provide information or referrals outside the Clinic. I understand that abusive behavior towards any of the Clinic staff or others waiting for the Clinic may result in my being barred from the Clinic.
					</CheckboxField>
				</div>
				<div className="mb-4">
					<InputField
						name="signature"
						type="text"
						label="Digital Signature"
						info="Please write your name below, serving as your digital signature."
						placeholder="queer, trans, non-binary, pansexual, CIS, lesbian, gay / male, female"
						required={true}
						style={{
							width: "98%",
						}}
					/>
				</div>
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
			</FormikForm>
		</Card.Body>
	</Card>
}

export default withFormik({
	mapPropsToValues: () => (initialValues),
	validate,
	handleSubmit,
	displayName: 'visitorForm',
})(VisitorAddForm);
