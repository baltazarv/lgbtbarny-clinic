import React from 'react';
import { withFormik, Form as FormikForm, Field } from 'formik';
// components
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import Select from '../../forms/fields/Select';
import RadioButtonGroup from '../../forms/fields/RadioButtonGroup'
import CheckboxGroup from '../../forms/fields/CheckboxGroup';
import Checkbox from '../../forms/fields/Checkbox';
import RadioButton from '../../forms/fields/RadioButton';
import TextArea from '../../forms/fields/TextArea';
import InputField from '../../forms/fields/InputField'
// data
import * as peopleFields from '../../../data/peopleFields';
import { getOptionsForLawTypes } from '../../../data/lawTypeData';
// styles
import classNames from "classnames";
import styled from 'styled-components'
import { reqAsterisk } from '../../forms/formElements';

const INITIAL_VALUES = {
	[peopleFields.LAST_NAME]: '',
	[peopleFields.PHONE]: '',
	[peopleFields.EMAIL]: '',
	[peopleFields.GENDER]: '',
	[peopleFields.ADDRESS]: '',
	[peopleFields.INTAKE_NOTES]: '',
	[peopleFields.FIRST_NAME]: '',
	[peopleFields.LAW_TYPES]: [],
	// consultation
	[peopleFields.PRONOUNS]: [], // multi-checkbox array
	[peopleFields.INCOME]: '', // radio buttons
	[peopleFields.TERMS]: '', // single-checkbox string
	[peopleFields.SIGNATURE]: '',
	[peopleFields.OTHER_NAMES]: '',
	[peopleFields.MIDDLE_NAME]: '',
	[peopleFields.DISPOSITION]: [], // multi-checkbox array
	// id
}

let initialValues = { ...INITIAL_VALUES };

const validate = (values, props) => {
	const errors = {};

	if (!values[peopleFields.FIRST_NAME]) {
		errors[peopleFields.FIRST_NAME] = 'First name is required.';
	}

	if (!values[peopleFields.LAST_NAME]) {
		errors[peopleFields.LAST_NAME] = 'Last name is required.';
	}

	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[peopleFields.EMAIL]) && values[peopleFields.EMAIL]) {
		errors[peopleFields.EMAIL] = 'Invalid email address.';
	}

	if (!/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i.test(values[peopleFields.PHONE]) && values[peopleFields.PHONE]) {
		errors[peopleFields.PHONE] = "Invalid phone number."
	}

	if (!values[peopleFields.EMAIL] && !values[peopleFields.PHONE]) {
		errors[peopleFields.EMAIL] = 'Enter an email address or...';
		errors[peopleFields.PHONE] = 'If no email, enter a phone #.';
	}

	if (!values[peopleFields.ADDRESS]) {
		errors[peopleFields.ADDRESS] = 'City, State, Zip is is required.';
	}

	if (!values[peopleFields.INCOME]) {
		errors[peopleFields.INCOME] = 'Annual household needs to be indicated.';
	}

	if (!values[peopleFields.TERMS]) {
		errors[peopleFields.TERMS] = 'You must accept the terms and conditions.';
	}

	if (!values[peopleFields.SIGNATURE]) {
		errors[peopleFields.SIGNATURE] = 'You must enter a digital signature.';
	}

	return errors;
};

const handleSubmit = (values, actions) => {
	const { props: { clinic, submitForm, onHide }, setSubmitting, resetForm
	} = actions;
	let payload = { ...values };
	//set clinic
	let clinicValue = peopleFields.CLINIC_TNC;
	if (clinic === 'nj') clinicValue = peopleFields.CLINIC_NJ;
	if (clinic === 'youth') clinicValue = peopleFields.CLINIC_YOUTH;
	payload[peopleFields.CLINIC_NAME] = clinicValue;
	// set datetime stamp
	payload[peopleFields.DATETIME] = new Date();

	submitForm(payload, resetForm);

	// only if serverResponse.status === 'success'
	setSubmitting(false);
	if (onHide) onHide();
}

const ClinicAddVisitor = ({
	// formik
	handleSubmit,
	values,
	errors,
	touched,
	setFieldValue,
	setFieldTouched,
	isSubmitting,
	dirty,

	// from redux:
	repeatVisitor,

	// from context?
	serverResponse,

	// parent
	clinic,
	lawTypesObject,
}) => {

	const acknowAndSign = () => {
		// acknowldegment -- it may move depending on the clinic
		const termsAcceptClasses = {
			label: classNames({
				'font-weight-bold': !errors[peopleFields.TERMS] || !touched[peopleFields.TERMS],
				'text-danger': errors[peopleFields.TERMS] && touched[peopleFields.TERMS],
			})
		};
		return <Card className="mb-3">
			<Card.Body className="pb-0">
				<CheckboxGroup
					id={peopleFields.TERMS}
					label={peopleFields.TERMS}
					description="You understand that LeGaL's Clinic does not provide representation, nor will LeGaL or the volunteer attorney become your legal representative by virtue of the Clinic consultation, as the assistance provided is limited to the Clinic session only. Though the volunteer attorney may provide information for other services or make subsequent referrals, there is no obligation to do so. Any information you provide to the Clinic staff, including documentation, is confidential and can only be accessed by LeGaL staff or Clinic volunteers. If you choose to submit any documentation through the online platform, you understand that LeGaL is not responsible for any way in which the hosting platform may access this information unbeknownst to LeGaL. You also understand that, with respect to our virtual and online Clinic, technical difficulties may occasionally arise; furthermore, recording of the session is not permitted and is subject to any applicable legal liability. Abusive or otherwise inappropriate behavior towards any of the Clinic staff or other Clinic visitors may, at the discretion LeGaL and its authorized agents, result in being barred from this and future Clinics."
					value={values[peopleFields.TERMS]}
					error={errors[peopleFields.TERMS]}
					touched={touched[peopleFields.TERMS]}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
					required={true}
					className="mb-2"
				>
					<Field
						component={Checkbox}
						name={peopleFields.TERMS}
						id={peopleFields.TERMS_AGREE}
						label={peopleFields.TERMS_AGREE}
						className={termsAcceptClasses}
					/>
				</CheckboxGroup>
				<div className="mb-4">
					<InputField
						name={peopleFields.SIGNATURE}
						type="text"
						label={peopleFields.SIGNATURE}
						info="Please write the name of the visitor below, serving as their digital signature."
						placeholder="Full Name"
						required={true}
						style={{
							width: "98%",
						}}
					/>
				</div>
			</Card.Body>
		</Card>
	}

	const submitButton = () => {
		// submit button & success message
		let btnLabel = 'Enter Visitor';
		if (serverResponse && serverResponse.payload && serverResponse.status === 'success') { // && serverResponse.type === 'createInquirer'
			btnLabel = 'Enter Another Visitor';
		}
		if (repeatVisitor) btnLabel = 'Process Visitor';
		// if update form vs create form
		return <>
			<Button
				variant="primary"
				type="submit"
				disabled={!dirty || isSubmitting}
				className="mr-2"
			>
				{btnLabel}
			</Button>
		</>
	}

	return <>
		<FormikForm onSubmit={handleSubmit}>

			{/* acknowldegment */}
			{acknowAndSign()}

			{/* name */}
			<Row>
				<Col className="label form-label mb-2">Visitor Name</Col>
			</Row>
			<Form.Row>
				<Col sm={5}>
					<InputField
						name={peopleFields.FIRST_NAME}
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
						name={peopleFields.MIDDLE_NAME}
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
						name={peopleFields.LAST_NAME}
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

			{/* preferred name */}
			<InputField
				name={peopleFields.OTHER_NAMES}
				type="text"
				label="Preferred Name(s)"
				placeholder="Preferred Name(s)"
				style={{
					width: "98%",
					display: "inline",
				}}
			/>

			{/* law types */}
			<Card className="mb-3">
				<Card.Body style={{ backgroundColor: '#39c1fa1a' }}>
					<Select
						name={peopleFields.LAW_TYPES}
						options={getOptionsForLawTypes(lawTypesObject)}
						label={peopleFields.LAW_TYPES}
						required={false}
						mode="multiple"
						value={values[peopleFields.LAW_TYPES]}
						onChange={values => setFieldValue(peopleFields.LAW_TYPES, values)}
						onBlur={() => setFieldTouched(peopleFields.LAW_TYPES, true)}
						touched={touched[peopleFields.LAW_TYPES]}
						error={errors[peopleFields.LAW_TYPES]}
					/>
				</Card.Body>
			</Card>

			{/* email */}
			<Card className="mb-3">
				<Card.Body className="pb-0">
					<Card.Title className="small text-muted">
						{reqAsterisk} If no email is provided, a phone number is necessary.
					</Card.Title>
					<Form.Row>
						<Col md={7}>
							<InputField
								name={peopleFields.EMAIL}
								type="email"
								label="Email Address"
								placeholder="email@address.com"
								// onBlur={handleBlur}
								required={!values[peopleFields.PHONE]}
								style={{
									width: "100%",
									display: "inline",
								}}
							/>
						</Col>
						<Col md={5}>
							<InputField
								name={peopleFields.PHONE}
								type="text"
								label="Phone #"
								placeholder="123-456-7890"
								// onBlur={handleBlur}
								required={!values[peopleFields.EMAIL]}
								style={{
									width: "100%",
									display: "inline",
								}}
							/>
						</Col>
					</Form.Row>
				</Card.Body>
			</Card>

			{/* address */}
			<InputField
				name={peopleFields.ADDRESS}
				type="text"
				label={peopleFields.ADDRESS}
				placeholder="NY, NY 10001"
				required={true}
				style={{
					width: "98%",
					display: "inline",
				}}
			/>

			{/* gender */}
			<div className="mb-4">
				<InputField
					name={peopleFields.GENDER}
					type="text"
					label={peopleFields.GENDER}
					placeholder="queer, trans, non-binary, pansexual, CIS, lesbian, gay / male, female"
					style={{
						width: "98%",
					}}
				/>
			</div>

			{/* pronouns */}
			<CheckboxGroup
				id={peopleFields.PRONOUNS}
				label="Gender Pronouns"
				value={values[peopleFields.PRONOUNS]}
				error={errors[peopleFields.PRONOUNS]}
				touched={touched[peopleFields.PRONOUNS]}
				onChange={setFieldValue}
				onBlur={setFieldTouched}
			>
				<Field
					component={Checkbox}
					name={peopleFields.PRONOUNS}
					id={peopleFields.PRONOUNS_SHE} // id=child
					label={peopleFields.PRONOUNS_SHE}
				/>
				<Field
					component={Checkbox}
					name={peopleFields.PRONOUNS}
					id={peopleFields.PRONOUNS_THEY}
					label={peopleFields.PRONOUNS_THEY}
				/>
				<Field
					component={Checkbox}
					name={peopleFields.PRONOUNS}
					id={peopleFields.PRONOUNS_HE}
					label={peopleFields.PRONOUNS_HE}
				/>
				<Field
					component={Checkbox}
					name={peopleFields.PRONOUNS}
					id={peopleFields.PRONOUNS_OTHER}
					label={peopleFields.PRONOUNS_OTHER}
				/>
			</CheckboxGroup>

			{/* income */}
			<RadioButtonGroup
				id={peopleFields.INCOME}
				label="Annual Household Income"
				value={values[peopleFields.INCOME]}
				error={errors[peopleFields.INCOME]}
				touched={touched[peopleFields.INCOME]}
				required={true}
			>
				<small className="mb-2 text-muted d-block">
					This information is necessary to assist us in making appropriate referrals to members of our Lawyer Referral Network and Pro Bono Panel.
				</small>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_UNDER_20K}
					label="Under $20,000"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_20K}
					label="$20,000 - $40,000"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_40K}
					label="$40,000 - $60,000"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_60K}
					label="$60,000 - $80,000"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_80K}
					label="$80,000 - $100,000"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_100K}
					label="$100,000+"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_UNEMPLOYED}
					label="Unemployed"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_UNABLE}
					label="Unable To Work"
				/>
				<Field
					component={RadioButton}
					name={peopleFields.INCOME}
					id={peopleFields.INCOME_NO_ANSWER}
					label="Decline To Answer"
				/>
			</RadioButtonGroup>

			{/* intake notes */}
			<div className="mb-4">
				<Field
					component={TextArea}
					name={peopleFields.INTAKE_NOTES}
					id={peopleFields.INTAKE_NOTES}
					label={clinic === 'nj' ? 'Factual Description of the Situation' : 'Optional/Additional Notes'}
					placeholder="Anything else the attorney should know."
					rows={2}
				/>
			</div>

			{/* NJ disposition */}
			{clinic === 'nj' &&
				<CheckboxGroup
					id={peopleFields.DISPOSITION}
					label="Action(s) Taken and Description of Disposition (Check all that apply)"
					value={values[peopleFields.DISPOSITION]}
					error={errors[peopleFields.DISPOSITION]}
					touched={touched[peopleFields.DISPOSITION]}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
				>
					<Field
						component={Checkbox}
						name={peopleFields.DISPOSITION}
						id={peopleFields.DISPOSITION_INFO}
						label="General Info., including information regarding legal and social services"
					/>
					<Field
						component={Checkbox}
						name={peopleFields.DISPOSITION}
						id={peopleFields.DISPOSITION_REVIEW}
						label="Review by LeGaL for possible referral to network lawyers for representation or for high-impact litigation. But note that referrals in NJ are EXTREMELY limited."
					/>
				</CheckboxGroup>
			}

			<Row className="justify-content-start">
				<Col>
					{submitButton()}
				</Col>
			</Row>
		</FormikForm>
	</>
}

export default withFormik({
	mapPropsToValues: ({
		repeatVisitor,
	}) => {
		initialValues = {
			...INITIAL_VALUES,
			[peopleFields.LAW_TYPES]: [...INITIAL_VALUES[peopleFields.LAW_TYPES]],
			[peopleFields.PRONOUNS]: [...INITIAL_VALUES[peopleFields.PRONOUNS]],
		};
		if (repeatVisitor) {
			Object.keys(initialValues).forEach(field => {
				if (repeatVisitor.hasOwnProperty(field)) {
					if (Array.isArray(repeatVisitor[field])) {
						initialValues[field].splice(0, initialValues[field].length, ...repeatVisitor[field]);
					} else {
						initialValues[field] = repeatVisitor[field];
					}
				}
				else {
					if (Array.isArray(initialValues[field])) {
						initialValues[field] = [];
					} else {
						initialValues[field] = '';
					}
				}
			});
			// if update, add id
			initialValues.id = repeatVisitor.id;
		} else {
			// initialValues = {...INITIAL_VALUES};
		}
		return initialValues;
	},
	validate,
	handleSubmit,
	enableReinitialize: true,
	displayName: 'visitorForm',
})(ClinicAddVisitor);
