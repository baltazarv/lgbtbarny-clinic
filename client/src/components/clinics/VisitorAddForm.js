/**
 * Form serving 3 purposes:
 * (1) Create inquirer from Intake.
 * (2) Update inquirer from Intake.
 * (3) Create inquirer from ConsultationForm's modal.
 */
import React from 'react';
import { withFormik, Form as FormikForm, Field } from 'formik';
// components
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import Select from '../forms/fields/Select';
import RadioButtonGroup from '../forms/fields/RadioButtonGroup'
import CheckboxGroup from '../forms/fields/CheckboxGroup';
import Checkbox from '../forms/fields/Checkbox';
import RadioButton from '../forms/fields/RadioButton';
import TextArea from '../forms/fields/TextArea';
import InputField from '../forms/fields/InputField'
// data
import * as peopleFields from '../../data/peopleFields';
import { formatName } from '../../data/peopleData';
import { getLawTypeOptions } from '../../data/lawTypeData';
// styles
import classNames from "classnames";
import { reqAsterisk } from '../forms/formElements';

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

	// if (values[peopleFields.LAW_TYPES].length < 1) {
	// 	errors[peopleFields.LAW_TYPES] = 'Please enter the type of law.';
	// }

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
	const { props, setSubmitting, resetForm } = actions;
	props.submitForm(values, resetForm);

	// only if serverResponse.status === 'success'
	setSubmitting(false);
	if (props.onHide) props.onHide();
}

const VisitorAddForm = props => {
	const {
		// formik
		handleSubmit,
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		isSubmitting,
		dirty,

		// parent
		lawTypes,
		clinic,
	} = props;

	const termsAcceptClasses = {
		label: classNames({
			'font-weight-bold': !errors[peopleFields.TERMS] || !touched[peopleFields.TERMS],
			'text-danger': errors[peopleFields.TERMS] && touched[peopleFields.TERMS],
		})
	}

	let buttons = null;
	let btnLabel = 'Enter Visitor';
	let serverRespMessage = null;
	if (props.serverResponse && props.serverResponse.payload && props.serverResponse.status === 'success' && props.serverResponse.type === 'createInquirer') {
		const visitor = props.serverResponse.payload.fields;
		let message = '';
		let name = <span className="font-weight-bold">{formatName(visitor)}</span>;
		if (props.serverResponse.type === 'createInquirer') {
			message = <>{name} was added!</>
		}
		btnLabel = 'Enter Another Visitor';
		serverRespMessage = <Row>
			<Col xs={8} className="mx-auto w-50 pb-3 text-center font-italic text-success">{message}</Col>
		</Row>
	}
	if (props.repeatVisitor) btnLabel = 'Process Visitor';
	// if update form vs create form
	buttons = <>
		<Button
			variant="primary"
			type="submit"
			disabled={!dirty || isSubmitting}
			className="mr-2"
		>
			{btnLabel}
		</Button>
		{/* <Button
			variant="secondary"
			disabled={!dirty || isSubmitting}
		>
			Consultation with {formatName(props.serverResponse.payload)}
		</Button> */}
		{/* HANDLE RESET! */}
		{/* <button
					type="button"
					className="outline"
					onClick={handleReset}
					disabled={!dirty || isSubmitting}
				>
					Reset
				</button> */}
	</>

	// acknowldegment
	const acknowAndSign = <Card className="mb-3">
		<Card.Body className="pb-0">
			<CheckboxGroup
				id={peopleFields.TERMS}
				label={peopleFields.TERMS}
				description="I understand that LeGaL does not provide representation, nor will LeGaL or the volunteer attorney become my legal representative by virtue of the Clinic consultation. I understand that the assistance provided by the volunteer attorney is limited to the Clinic session. I understand that the volunteer attorney is not obligated to provide information or referrals outside the Clinic. I understand that abusive behavior towards any of the Clinic staff or others waiting for the Clinic may result in my being barred from the Clinic."
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
					info="Please write your name below, serving as your digital signature."
					placeholder="Full Name"
					required={true}
					style={{
						width: "98%",
					}}
				/>
			</div>
		</Card.Body>
	</Card>

	// nj clinic disposition
	let dispositions = null;
	if (clinic === 'nj') {
		dispositions = <CheckboxGroup
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
				label="Review by LeGaL for possible referral to network lawyers for representation or for high-impact litigation"
			/>
		</CheckboxGroup>
	}

	return <Card>
		<Card.Body>
			<FormikForm onSubmit={handleSubmit}>
				{acknowAndSign}
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
				<Card className="mb-3">
					<Card.Body style={{ backgroundColor: '#39c1fa1a' }}>
						<Select
							name={peopleFields.LAW_TYPES}
							options={lawTypes}
							optFunc={getLawTypeOptions}
							label={peopleFields.LAW_TYPES}
							required={false}
							value={values[peopleFields.LAW_TYPES]}
							onChange={values => setFieldValue(peopleFields.LAW_TYPES, values)}
							onBlur={() => setFieldTouched(peopleFields.LAW_TYPES, true)}
							touched={touched[peopleFields.LAW_TYPES]}
							error={errors[peopleFields.LAW_TYPES]}
						/>
					</Card.Body>
				</Card>
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

				{/* previous acknowledgement & signature location */}

				{dispositions}

				{/* TO-DO: list error messages here? */}

				{serverRespMessage}
				<Row className="justify-content-start">
					<Col>
						{buttons}
					</Col>
				</Row>
			</FormikForm>
		</Card.Body>
	</Card>
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
	// enableReinitialize: true,
})(VisitorAddForm);
