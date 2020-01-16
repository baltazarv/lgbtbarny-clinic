import React from 'react';
import { withFormik, Form as FormikForm, Field } from 'formik';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import classNames from "classnames";
import RadioButtonGroup from './fields/RadioButtonGroup'
import CheckboxGroup from './fields/CheckboxGroup';
import Checkbox from './fields/Checkbox';
import RadioButton from './fields/RadioButton';
import TextArea from './fields/TextArea';
import { reqAsterisk } from './formElements';


import InputField from './fields/InputField'

const initialValues = {
	firstName: '',
	middleName: '',
	lastName: '',
	preferName: '',
	email: '',
	phone: '',
	location: '',
	gender: '',
	pronouns: [],
	income: '',
	terms: [],
	notes: '',
	signature: '',
}

const validate = (values, props) => {
	const errors = {};

	console.log('values', values, 'errors', errors)

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

	// if (!values.pronouns || values.pronouns.length < 1) {
	// 	errors.pronouns = 'Indicating a gender pronoun is not required.';
	// }

	if (!values.income) {
		errors.income = 'Annual household needs to be indicated.';
	}

	// if (!values.notes) {
	// 	errors.notes = 'Notes are encouraged but not required.';
	// }

	if (!values.terms.includes('termsAgree')) {
		errors.terms = 'You must accept the terms and conditions.';
	}

	if (!values.signature) {
		errors.signature = 'You must enter a digital signature.';
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
		handleSubmit,
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		// dirty,
		// isSubmitting,
		// handleChange,
		// handleBlur,
		// handleReset,
	} = props;

	// add to global style sheet
	const cardStyle = {
		backgroundClip: "border-box",
		border: "1px solid rgba(0, 0, 0, 0.125)",
		borderRadius: "0.25rem",
	}

	const termsAcceptClasses = {
		label: classNames({
			'font-weight-bold': !errors.terms || !touched.terms,
			'text-danger': errors.terms && touched.terms,
		})
	}

	return <Card style={cardStyle}>
		<Card.Body>
			<FormikForm onSubmit={handleSubmit}>
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
						<Card.Title className="small text-muted">
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
				<CheckboxGroup
					id="pronouns"
					label="Gender Pronouns"
					value={values.pronouns}
					error={errors.pronouns}
					touched={touched.pronouns}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
				>
					<Field
						component={Checkbox}
						name="pronouns"
						id="she"
						label="She/Her/Hers"
					/>
					<Field
						component={Checkbox}
						name="pronouns"
						id="they"
						label="They/Them/Theirs"
					/>
					<Field
						component={Checkbox}
						name="pronouns"
						id="he"
						label="He/Him/His"
					/>
					<Field
						component={Checkbox}
						name="pronouns"
						id="other"
						label="Other"
					/>
				</CheckboxGroup>
				<RadioButtonGroup
					id="income"
					label="Annual Household Income"
					value={values.income}
					error={errors.income}
					touched={touched.income}
					required={true}
				>
					<small className="mb-2 text-muted d-block">
						This information is necessary to assist us in making appropriate referrals to members of our Lawyer Referral Network and Pro Bono Panel.
					</small>
					<Field
						component={RadioButton}
						name="income"
						id="under20k"
						label="Under $20,000"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="20to40k"
						label="$20,000 - $40,000"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="40to60k"
						label="$40,000 - $60,000"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="60to80k"
						label="$60,000 - $80,000"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="80to100k"
						label="$80,000 - $100,000"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="over100k"
						label="$100,000+"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="unemployed"
						label="Unemployed"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="unableToWork"
						label="Unable To Work"
					/>
					<Field
						component={RadioButton}
						name="income"
						id="declineAnswer"
						label="Decline To Answer"
					/>
				</RadioButtonGroup>
				<div className="mb-4">
					<Field
						component={TextArea}
						name="notes"
						id="notes"
						label="Intake Notes"
						placeholder="Type of law related to visit? Anything the attorneys should know?"
						rows={2}
					/>
				</div>
				<CheckboxGroup
					id="terms"
					label="Acknowledgment"
					value={values.terms}
					error={errors.terms}
					touched={touched.terms}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
					required={true}
					className="mb-4"
				>
					<div className="mb-2 small">
						I understand that LeGaL does not provide representation, nor will LeGaL or the volunteer attorney become my legal representative by virtue of the Clinic consultation. I understand that the assistance provided by the volunteer attorney is limited to the Clinic session. I understand that the volunteer attorney is not obligated to provide information or referrals outside the Clinic. I understand that abusive behavior towards any of the Clinic staff or others waiting for the Clinic may result in my being barred from the Clinic.
					</div>
					<Field
						component={Checkbox}
						name="terms"
						id="termsAgree"
						label="I understand and agree to the terms and conditions of the clinic."
						className={termsAcceptClasses}
					/>
				</CheckboxGroup>
				<div className="mb-4">
					<InputField
						name="signature"
						type="text"
						label="Digital Signature"
						info="Please write your name below, serving as your digital signature."
						placeholder="Full Name"
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
