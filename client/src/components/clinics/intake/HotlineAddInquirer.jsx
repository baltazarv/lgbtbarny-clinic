import React from 'react';
import { withFormik, Form as FormikForm, Field } from 'formik';
// components
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { Select as AntSelect } from 'antd';
import Select from '../../forms/fields/Select';
import TextArea from '../../forms/fields/TextArea';
import InputField from '../../forms/fields/InputField'
// data
import * as peopleFields from '../../../data/peopleFields';
import { getOptionsForLawTypes } from '../../../data/lawTypeData';
// styles
import styled from 'styled-components'

const { Option } = AntSelect

const INITIAL_VALUES = {
	[peopleFields.FIRST_NAME]: '',
	[peopleFields.MIDDLE_NAME]: '',
	[peopleFields.LAST_NAME]: '',
	[peopleFields.OTHER_NAMES]: '',
	[peopleFields.LAW_TYPES]: [],
	[peopleFields.EMAIL]: '',
	[peopleFields.PHONE]: '',
	[peopleFields.ADDRESS]: '',
	[peopleFields.INTAKE_NOTES]: '',
	[peopleFields.DISPOSITION]: [], // multi-checkbox array
	// temp address fields
	other_address: '',
	boro: '',
}

let initialValues = { ...INITIAL_VALUES };

const boroughs = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island', 'Other']

const boroOptions = () => {
	return boroughs.map((boro) => <Option key={boro} value={boro}>{boro}</Option>)
}

const handleSubmit = (values, actions) => {
	const { props: { submitForm, onHide }, setSubmitting, resetForm
	} = actions
	let payload = { ...values }
	// TODO: populate a (new?) type of contact field
	// payload[peopleFields.CLINIC_NAME] = peopleFields.CLINIC_TNC;

	// set datetime stamp
	payload[peopleFields.DATETIME] = new Date()

	// get values from address temp fields
	if (payload.boro) {
		if (payload.boro === 'Other') {
			if (payload.other_address) {
				payload[peopleFields.ADDRESS] = payload.other_address
			} else {
				payload[peopleFields.ADDRESS] = ''
			}
		} else {
			payload[peopleFields.ADDRESS] = payload.boro
		}
	}
	// delete temp field values
	delete payload.boro
	delete payload.other_address

	submitForm(payload, resetForm);

	// only if serverResponse.status === 'success'
	setSubmitting(false)
	if (onHide) onHide()
}

const ContactAddForm = ({
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
	lawTypesObject,
}) => {

	const script = () => {
		return <Card className="mb-3">
			<Card.Body className="pb-0">
				<ScriptStyled>
					<div className="heading">Script</div>
					<div className="small">
						<p>This is the LGBT Bar Association of Greater New York. Thank you for reaching out to us!</p>

						<p>We are a not-for-profit organization which endeavors to assist members of the LGBT community in New York with legal inquiries through our weekly Clinic and, when possible, with referrals through our lawyer referral network. Please know that there is no guarantee of assistance or referral for any particular legal inquiry. Please also understand that we only serve those who are 18 years of age or over.</p>

						<p>We suggest that you attend our free, walk-in legal Clinic held on Tuesday nights at 6 pm at the LGBT Community Center, located on 13th Street between 7th and 8th Avenues. If you cannot attend in-person, you may also join via Zoom. The link can be found on our website: lgbtbarny.org.</p>

						<p>
							You may also submit an online inquiry on our website, at the “Get Legal Help” tab in the top right-hand corner.

							Again, thank you for contacting us regarding our legal services. We hope we can be of assistance.
						</p>
					</div>
				</ScriptStyled>
			</Card.Body>
		</Card>
	}

	const submitButton = () => {
		// submit button & success message
		let btnLabel = 'Enter Inquirer';
		if (serverResponse && serverResponse.payload && serverResponse.status === 'success') { // && serverResponse.type === 'createInquirer'
			btnLabel = 'Enter Another Inquirer';
		}
		if (repeatVisitor) btnLabel = 'Process Inquirer';
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
			{script()}

			{/* name */}
			<Row>
				<Col className="label form-label mb-2">Inquirer Name</Col>
			</Row>
			<Form.Row>
				<Col sm={5}>
					<InputField
						name={peopleFields.FIRST_NAME}
						type="text"
						placeholder="First Name"
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
						label="Legal Issue"
						required={false}
						mode="multiple"
						value={values[peopleFields.LAW_TYPES]}
						onChange={(val) => setFieldValue(peopleFields.LAW_TYPES, val)}
						onBlur={() => setFieldTouched(peopleFields.LAW_TYPES, true)}
						touched={touched[peopleFields.LAW_TYPES]}
						error={errors[peopleFields.LAW_TYPES]}
					/>
				</Card.Body>
			</Card>

			{/* email */}
			<Card className="mb-3">
				<Card.Body className="pb-0">
					<Form.Row>
						<Col md={7}>
							<InputField
								name={peopleFields.EMAIL}
								type="email"
								label="Email Address"
								placeholder="email@address.com"
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
								style={{
									width: "100%",
									display: "inline",
								}}
							/>
						</Col>
					</Form.Row>
				</Card.Body>
			</Card>

			{/* borough/address */}
			<Card className="mb-3">
				<Card.Body className="pb-0">
					<Form.Row>
						<Col md={5}>
							<BoroGroupStyled className="form-group">
								<label className="form-label">Home Borough</label>
								<AntSelect
									showSearch={false}
									style={{ width: '100%' }}
									// placeholder={placeholder}
									defaultValue={values[peopleFields.ADDRESS]}
									value={values['boro']}
									onChange={(val) => setFieldValue('boro', val)}
									allowClear={true}
								>
									{boroOptions()}
								</AntSelect>
							</BoroGroupStyled>
						</Col>
						<Col md={7}>
							<InputField
								name="other_address"
								type="text"
								label={<span>Home Address (if <em>Other</em>)</span>}
								style={{
									width: "100%",
									display: "inline",
								}}
								disabled={!(values['boro'] === 'Other')}
							/>
						</Col>
					</Form.Row>
				</Card.Body>
			</Card>

			{/* intake notes */}
			<div className="mb-4">
				<Field
					component={TextArea}
					name={peopleFields.INTAKE_NOTES}
					id={peopleFields.INTAKE_NOTES}
					label="Optional/Additional Notes"
					placeholder="Anything else the attorney should know."
					rows={2}
				/>
			</div>
			<Row className="justify-content-start">
				<Col>
					{submitButton()}
				</Col>
			</Row>
		</FormikForm>
	</>
}

const ScriptStyled = styled.div`
	.heading {
		font-weight: 900;
		margin-bottom: 0.25rem;
	}
	p {
		// line-height: 1;
		margin-bottom: 0.5rem;
	}
`

const BoroGroupStyled = styled.div`
	.ant-select-selection {
		height: 38px;

		.ant-select-selection__rendered {
			line-height: 36px;
		}
	}
`

export default withFormik({
	mapPropsToValues: ({
		repeatVisitor,
	}) => {
		initialValues = {
			...INITIAL_VALUES,
			[peopleFields.LAW_TYPES]: [...INITIAL_VALUES[peopleFields.LAW_TYPES]],
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

		// pre-populate temp field
		if (initialValues?.[peopleFields.ADDRESS]) {
			const address = initialValues[peopleFields.ADDRESS]
			if (boroughs.some((boro) => boro === address)) {
				initialValues.boro = address
			} else {
				initialValues.other_address = address
			}
		}

		return initialValues;
	},
	// validate,
	handleSubmit,
	enableReinitialize: true,
	displayName: 'visitorForm',
})(ContactAddForm);
