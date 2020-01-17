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
import * as peopleFields from '../../data/peopleFields';
import InputField from './fields/InputField'

let initialValues = {
	[peopleFields.local.FIRST_NAME]: '',
	[peopleFields.local.MIDDLE_NAME]: '',
	[peopleFields.local.LAST_NAME]: '',
	[peopleFields.local.OTHER_NAMES]: '',
	[peopleFields.local.EMAIL]: '',
	[peopleFields.local.PHONE]: '',
	[peopleFields.local.ADDRESS]: '',
	[peopleFields.local.GENDER]: '',
	[peopleFields.local.PRONOUNS]: [], // multi-checkbox array
	[peopleFields.local.INCOME]: '',
	[peopleFields.local.INTAKE_NOTES]: '',
	[peopleFields.local.TERMS]: '', // single-checkbox string
	[peopleFields.local.SIGNATURE]: '',
}

const validate = (values, props) => {
	const errors = {};

	// console.log('values', values, 'errors', errors)

	if (!values[peopleFields.local.FIRST_NAME]) {
		errors[peopleFields.local.FIRST_NAME] = 'First name is required.';
	}

	if (!values[peopleFields.local.LAST_NAME]) {
		errors[peopleFields.local.LAST_NAME] = 'Last name is required.';
	}

	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[peopleFields.local.EMAIL]) && values[peopleFields.local.EMAIL]) {
		errors[peopleFields.local.EMAIL] = 'Invalid email address.';
	}

	if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i.test(values[peopleFields.local.PHONE]) && values[peopleFields.local.PHONE]) {
		errors[peopleFields.local.PHONE] = "Invalid phone number."
	}

	if (!values[peopleFields.local.EMAIL] && !values[peopleFields.local.PHONE]) {
		errors[peopleFields.local.EMAIL] = 'Enter an email address or...';
		errors[peopleFields.local.PHONE] = 'If no email, enter a phone #.';
	}

	if (!values[peopleFields.local.ADDRESS]) {
		errors[peopleFields.local.ADDRESS] = 'City, State, Zip is is required.';
	}

	if (!values[peopleFields.local.INCOME]) {
		errors[peopleFields.local.INCOME] = 'Annual household needs to be indicated.';
	}

	if (!values[peopleFields.local.TERMS]) {
		errors[peopleFields.local.TERMS] = 'You must accept the terms and conditions.';
	}

	if (!values[peopleFields.local.SIGNATURE]) {
		errors[peopleFields.local.SIGNATURE] = 'You must enter a digital signature.';
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
		isSubmitting,
		// dirty,
		// handleChange,
		// handleBlur,
		// handleReset,
		editData, //currentInquirers
	} = props;

	// add to global style sheet
	const cardStyle = {
		backgroundClip: "border-box",
		border: "1px solid rgba(0, 0, 0, 0.125)",
		borderRadius: "0.25rem",
	}

	const termsAcceptClasses = {
		label: classNames({
			'font-weight-bold': !errors[peopleFields.local.TERMS] || !touched[peopleFields.local.TERMS],
			'text-danger': errors[peopleFields.local.TERMS] && touched[peopleFields.local.TERMS],
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
							name={peopleFields.local.FIRST_NAME}
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
							name={peopleFields.local.MIDDLE_NAME}
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
							name={peopleFields.local.LAST_NAME}
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
					name={peopleFields.local.OTHER_NAMES}
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
									name={peopleFields.local.EMAIL}
									type="email"
									label="Email Address"
									placeholder="email@address.com"
									// onBlur={handleBlur}
									required={!values[peopleFields.local.PHONE]}
									style={{
										width: "100%",
										display: "inline",
									}}
								/>
							</Col>
							<Col md={5}>
								<InputField
									name={peopleFields.local.PHONE}
									type="text"
									label="Phone #"
									placeholder="123-456-7890"
									// onBlur={handleBlur}
									required={!values[peopleFields.local.EMAIL]}
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
					name={peopleFields.local.ADDRESS}
					type="text"
					label={peopleFields.ADDRESS}
					placeholder="NY, NY 10001"
					required={true}
					style={{
						width: "98%",
						display: "inline",
					}}
				/>
				<div className="mb-4">
					<InputField
						name={peopleFields.local.GENDER}
						type="text"
						label={peopleFields.GENDER}
						placeholder="queer, trans, non-binary, pansexual, CIS, lesbian, gay / male, female"
						style={{
							width: "98%",
						}}
					/>
				</div>
				<CheckboxGroup
					id={peopleFields.local.PRONOUNS} // id=local parent
					label="Gender Pronouns"
					value={values[peopleFields.local.PRONOUNS]}
					error={errors[peopleFields.local.PRONOUNS]}
					touched={touched[peopleFields.local.PRONOUNS]}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
				>
					<Field
						component={Checkbox}
						name={peopleFields.local.PRONOUNS} // name=local parent
						id={peopleFields.PRONOUNS_SHE} // id=child
						label={peopleFields.PRONOUNS_SHE}
					/>
					<Field
						component={Checkbox}
						name={peopleFields.local.PRONOUNS}
						id={peopleFields.PRONOUNS_THEY}
						label={peopleFields.PRONOUNS_THEY}
					/>
					<Field
						component={Checkbox}
						name={peopleFields.local.PRONOUNS}
						id={peopleFields.PRONOUNS_HE}
						label={peopleFields.PRONOUNS_HE}
					/>
					<Field
						component={Checkbox}
						name={peopleFields.local.PRONOUNS}
						id={peopleFields.PRONOUNS_OTHER}
						label={peopleFields.PRONOUNS_OTHER}
					/>
				</CheckboxGroup>
				<RadioButtonGroup
					id={peopleFields.local.INCOME}
					label="Annual Household Income"
					value={values[peopleFields.local.INCOME]}
					error={errors[peopleFields.local.INCOME]}
					touched={touched[peopleFields.local.INCOME]}
					required={true}
				>
					<small className="mb-2 text-muted d-block">
						This information is necessary to assist us in making appropriate referrals to members of our Lawyer Referral Network and Pro Bono Panel.
					</small>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_UNDER_20K}
						label="Under $20,000"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_20K}
						label="$20,000 - $40,000"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_40K}
						label="$40,000 - $60,000"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_60K}
						label="$60,000 - $80,000"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_80K}
						label="$80,000 - $100,000"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_100K}
						label="$100,000+"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_UNEMPLOYED}
						label="Unemployed"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_UNABLE}
						label="Unable To Work"
					/>
					<Field
						component={RadioButton}
						name={peopleFields.local.INCOME}
						id={peopleFields.INCOME_NO_ANSWER}
						label="Decline To Answer"
					/>
				</RadioButtonGroup>
				<div className="mb-4">
					<Field
						component={TextArea}
						name={peopleFields.local.INTAKE_NOTES}
						id={peopleFields.local.INTAKE_NOTES}
						label={peopleFields.INTAKE_NOTES}
						placeholder="Type of law related to visit? Anything the attorneys should know?"
						rows={2}
					/>
				</div>
				<CheckboxGroup
					id={peopleFields.local.TERMS} // id=local parent
					label={peopleFields.TERMS}
					description="I understand that LeGaL does not provide representation, nor will LeGaL or the volunteer attorney become my legal representative by virtue of the Clinic consultation. I understand that the assistance provided by the volunteer attorney is limited to the Clinic session. I understand that the volunteer attorney is not obligated to provide information or referrals outside the Clinic. I understand that abusive behavior towards any of the Clinic staff or others waiting for the Clinic may result in my being barred from the Clinic."
					value={values[peopleFields.local.TERMS]}
					error={errors[peopleFields.local.TERMS]}
					touched={touched[peopleFields.local.TERMS]}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
					required={true}
					className="mb-4"
				>
					<Field
						component={Checkbox}
						name={peopleFields.local.TERMS} // name=local parent
						id={peopleFields.TERMS_AGREE} // id=child
						label={peopleFields.TERMS_AGREE}
						className={termsAcceptClasses}
					/>
				</CheckboxGroup>
				<div className="mb-4">
					<InputField
						name={peopleFields.local.SIGNATURE}
						type="text"
						label={peopleFields.SIGNATURE}
						info="Please write your name below, serving as your digital signature."
						placeholder="Full Name"
						required={true}
						style={{
							width: "98%",
						}}
					/>
				</div>
				{/* HANDLE RESET! */}
				{/* <button
					type="button"
					className="outline"
					onClick={handleReset}
					disabled={!dirty || isSubmitting}
				>
					Reset
				</button> */}
				<Row className="justify-content-start">
					<Col>
						<Button
							variant="primary"
							type="submit"
							disabled={isSubmitting}
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
	mapPropsToValues: ({
		editData
	}) => {
		if (editData) {
			const firstVisitor = editData[0];
			Object.keys(firstVisitor).forEach(field => {
				// for object properties that match...
				if (initialValues.hasOwnProperty(field)) {
					// if array replace all items
					if (Array.isArray(firstVisitor[field])) {
						initialValues[field].splice(0, initialValues[field].length, ...firstVisitor[field]);
					} else {
						initialValues[field] = firstVisitor[field];
					}
				}
			});
		}
		return initialValues;
	},
	validate,
	handleSubmit,
	displayName: 'visitorForm',
	// enableReinitialize: true,
})(VisitorAddForm);
