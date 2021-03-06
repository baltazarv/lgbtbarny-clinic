import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik, Form as FormikForm, Field } from 'formik';
// components
import { Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { Button as AntButton } from 'antd'; // { Select }
import RadioButtonGroup from './fields/RadioButtonGroup';
import RadioButton from './fields/RadioButton';
import TextArea from './fields/TextArea';
import { InputFeedback } from './formElements';
import InquirerInfo from '../InquirerInfo';
import FormModal from '../modals/FormModal';
import VisitorAddForm from './VisitorAddForm';
import LawyerAddForm from './LawyerAddForm';
// import ReactSelectWithValidation from '../../../components/forms/fields/ReactSelectWithValidation';
// data
import * as consultFields from '../../data/consultionFields';
import { getPeopleIntoSelectOptions, getLawTypeSelectOptions } from '../../data/dataTransforms';
// import styles from './ConsultationForm.module.css';

// determines if referral fields show and validate
// b/c validate function needs to be outside class, this flag cannot be in the local class state
let isReferralDispositionChecked = false;

const validate = values => {
	const errors = {};
	if (values[consultFields.LAWYERS].length < 1) {
		errors[consultFields.LAWYERS] = 'Select yourself as lawyer.'
	}

	if (values[consultFields.INQUIRERS].length < 1) {
		errors[consultFields.INQUIRERS] = 'Select a visitor.'
	}

	if (!values[consultFields.DISPOSITIONS]) {
		errors[consultFields.DISPOSITIONS] = 'Select a disposition.'
	}

	if (isReferralDispositionChecked && !values[consultFields.REF_SUMMARY]) {
		errors[consultFields.REF_SUMMARY] = 'Include a summary to make a referral.'
	}

	if (isReferralDispositionChecked && values[consultFields.LAW_TYPES].length < 1) {
		errors[consultFields.LAW_TYPES] = 'Required to make a referral.'
	}

	// console.log('values', values, 'errors', errors)
	return errors;
}

const handleSubmit = (values, actions) => {
	const { props, setSubmitting, resetForm, setFieldValue } = actions;

	/** Consultation's submitConsultation method will:
	 *  * reset the form,
	 *  * massage data to save to db,
	 *  * save the lawyers back into pulldown.
	 **/
	props.submitForm(values, setFieldValue, resetForm);
	setSubmitting(false);
}

class ConsultationForm extends Component {

	// lifecycle methods

	constructor(props) {
		super(props);
		// this.inquirerForm = React.createRef();
		this.state = {
			lawyerAddModalShown: false,
			visitorAddModalShown: false,
			submitButtonLabel: 'Submit & Send Email to Visitor',
		}
	}

	// form control event handlers

	handleInquirerSelectChange(options) {
		this.props.setFieldValue(consultFields.INQUIRERS, options);
		this.props.handleInquirerSelectChange(options);
	}

	/** Forward to parent container Consultation:
	 *  * new lawyer value from LawyerAddForm modal to create new lawyer
	 *  * & setFieldValue from this class to add selection to Lawyer pulldown when adding lawyer is successful
	 **/
	submitAddLawyer = (value) => {
		this.props.submitAddLawyer(value, this.props.setFieldValue);
	}

	// const handleSubmit outside componet

	submitAddInquirer = (values) => {
		this.props.submitAddInquirer(values, this.props.setFieldValue);
	}

	// modals

	showLawyerAddModal = () => {
		this.setState({
			lawyerAddModalShown: true,
		})
	}

	hideLawyerAddModal = () => {
		this.setState({
			lawyerAddModalShown: false,
		})
	}

	showVisitorAddModal = () => {
		this.setState({
			visitorAddModalShown: true,
		})
	}

	hideVisitorAddModal = () => {
		this.setState({
			visitorAddModalShown: false,
		})
	}

	render() {

		// formik props
		const {
			values,
			errors,
			touched,
			setFieldValue,
			setFieldTouched,
			// isSubmitting,
		} = this.props;

		// console.log('ConsultationForm render values:', values, 'errors:', errors)

		// passed by Consultaton parent container
		const {
			inquirersSelected,
			inqSelectedConsultations,
			clinicTitle,
		} = this.props;

		// also redux props: inquirers, lawyers, lawTypes

		// check if referral-eligible disposition is selected to show additonal referral field
		const disp = consultFields.DISPOSITIONS;
		if (values[disp] === consultFields.DISPOSITIONS_FEE_BASED || values[disp] === consultFields.DISPOSITIONS_PRO_BONO) {
			isReferralDispositionChecked = true;
		} else {
			isReferralDispositionChecked = false;
		}

		// error message
		let errorMessage = null;
		// if (this.state.submitError) {
		// 	errorMessage = <Row>
		// 		<Col className="mx-auto w-50 p-3 text-center font-italic text-danger">More info needed.<br />
		// 			Please fill out <span className="font-weight-bold">empty fields in red</span> above!</Col>
		// 	</Row>;
		// }

		return (
			<>
				<h1 className="h2"><em>{clinicTitle}</em> Consultation</h1>
				<div className="mb-3 small">
					Please insert the information you collected for each visitor that you spoke to. Give a summary of the visitor's issue and indicate whether or not they need a referral.
				</div>
				<p className="text-danger small">*<sup> &ndash; </sup>Required</p>
				<FormikForm
				// onSubmit={this.props.handleSubmit}
				// ref={this.inquirerForm}
				>
					{/* lawyers select */}
					<Form.Group as={Row} controlId="lawyerPulldown">
						<Form.Label column sm={3} className="text-md-right">
							Lawyer(s)<span className="text-danger">*</span>
						</Form.Label>
						<Col sm={9}>
							<Form.Text className="text-muted">
								Select your name.
							</Form.Text>
							<Row>
								<Col xs={10}>
									<ReactSelect
										name={consultFields.LAWYERS}
										id={[consultFields.LAWYERS]}
										options={getPeopleIntoSelectOptions(this.props.lawyers)}
										isClearable
										isMulti={true}
										onChange={values => setFieldValue(consultFields.LAWYERS, values)}
										onBlur={() => setFieldTouched(consultFields.LAWYERS, true)}
										value={values[consultFields.LAWYERS]}
										defaultValue=""
									// styles={customStyles} // styles on VisitorSelect
									/>
								</Col>
								<Col xs={2} className="justify-content-left">
									<Button onClick={() => this.showLawyerAddModal()} size="sm">+</Button>
								</Col>
							</Row>
							{touched[consultFields.LAWYERS] && <InputFeedback error={errors[consultFields.LAWYERS]} />}
							<div className="text-right text-muted">
								<small>If lawyer not on pulldown, click</small> <strong>+</strong> <small>above to add.</small>
							</div>
						</Col>
					</Form.Group>

					{/* inquirers select */}
					<Form.Group as={Row} controlId="visitorPulldown">
						<Form.Label column sm={3} className="text-md-right">
							Visitor(s)<span className="text-danger">*</span>
						</Form.Label>
						<Col sm={9}>
							<Form.Text className="text-muted">
								Choose visitor or multiple visitors if relevant. If the visitor does not appear, refresh the page.
							</Form.Text>
							<Row>
								<Col xs={9} sm={8} md={9}>
									<ReactSelect
										name={consultFields.INQUIRERS}
										options={getPeopleIntoSelectOptions(this.props.inquirers)}
										isClearable
										isMulti={true}
										onChange={values => this.handleInquirerSelectChange(values)}
										onBlur={() => setFieldTouched(consultFields.INQUIRERS, true)}
										value={values[consultFields.INQUIRERS]}
										defaultValue=""
									// styles={customStyles} // styles on VisitorSelect
									/>
								</Col>
								<Col xs={3} sm={4} md={3} className="justify-content-left">
									<AntButton
										type="primary"
										shape="circle"
										onClick={() => this.props.refreshInquirers()}
										className="mr-3 pb-1"
										icon="reload" />
									<Button onClick={() => this.showVisitorAddModal()} size="sm">+</Button>
								</Col>
							</Row>
							{touched[consultFields.INQUIRERS] && <InputFeedback error={errors[consultFields.INQUIRERS]} />}
							<div className="text-right text-muted">
								<small>If visitor not in the system, click</small> <strong>+</strong> <small>above to add.</small>
							</div>
						</Col>
					</Form.Group>

					{/* selected inquirer info list */}
					<Collapse in={this.props.inquirers && this.props.inquirers.length > 0} className="mb-4">
						<div id="visitor-info" className="small">
							<InquirerInfo
								// inquirers determines if list shows up:
								inquirers={inquirersSelected}
								consultations={inqSelectedConsultations}
								// needed for lawyer names:
								lawyers={this.props.lawyers}
								lawTypes={this.props.lawTypes}
							/>
						</div>
					</Collapse>

					{/* notes (inquirer's summary) text area */}
					<div className="mb-4">
						<Field
							component={TextArea}
							name={consultFields.SITUATION}
							id={consultFields.SITUATION}
							label="Notes"
							description="Please describe the factual situation as well as the legal assessment."
							// placeholder=""
							rows={5}
						/>
					</div>

					{/* disposition */}
					<RadioButtonGroup
						id={consultFields.DISPOSITIONS}
						label="Disposition"
						description="Please describe the factual situation as well as the legal assessment."
						value={values[consultFields.DISPOSITIONS]}
						error={errors[consultFields.DISPOSITIONS]}
						touched={touched[consultFields.DISPOSITIONS]}
						required={true}
					>
						<Field
							component={RadioButton}
							name={consultFields.DISPOSITIONS}
							id={consultFields.DISPOSITIONS_NO_FURTHER}
							label={consultFields.DISPOSITIONS_NO_FURTHER}
						/>
						<Field
							component={RadioButton}
							name={consultFields.DISPOSITIONS}
							id={consultFields.DISPOSITIONS_FEE_BASED}
							label={consultFields.DISPOSITIONS_FEE_BASED}
						/>
						<Field
							component={RadioButton}
							name={consultFields.DISPOSITIONS}
							id={consultFields.DISPOSITIONS_PRO_BONO}
							label={consultFields.DISPOSITIONS_PRO_BONO}
						/>
						<Field
							component={RadioButton}
							name={consultFields.DISPOSITIONS}
							id={consultFields.DISPOSITIONS_COMPELLING}
							label={consultFields.DISPOSITIONS_COMPELLING}
						/>
					</RadioButtonGroup>

					<Collapse in={isReferralDispositionChecked}>
						<div id="referrals">

							<div className="mb-2 text-muted"><small><em>If LRN or PBP is chosen above, please fill out the following to help refer this case.</em></small></div>

							{/* type of law */}
							<Form.Group as={Row} controlId="typeOfLawPulldown">
								<Form.Label column sm={4} className="text-md-right">
									Type Of Law<span className="text-danger">*</span>
								</Form.Label>
								<Col sm={7}>
									<Form.Text className="text-muted">
										Choose any relevant types of law.
									</Form.Text>
									<ReactSelect
										name={[consultFields.LAW_TYPES]}
										options={getLawTypeSelectOptions(this.props.lawTypes)}
										isClearable
										isMulti={true}
										onChange={value => setFieldValue(consultFields.LAW_TYPES, value)}
										onBlur={() => setFieldTouched(consultFields.LAW_TYPES, true)}
										value={values[consultFields.LAW_TYPES]}
										defaultValue=""
									/>
									{touched[consultFields.LAW_TYPES] && <InputFeedback error={errors[consultFields.LAW_TYPES]} />}
								</Col>
							</Form.Group>

							{/* ref summary */}
							<div className="mb-4">
								<Field
									component={TextArea}
									name={consultFields.REF_SUMMARY}
									id={consultFields.REF_SUMMARY}
									label="Referral Summary"
									description="If LRN or PBP is chosen above, add a one- or two-sentence referral summary that can be used independently of the Notes above in order to make a referral to our network."
									placeholder="Clinic visitor seeks attorney for representation in landlord-tenant matter. Person is able to pay to retain a lawyer."
									required={true}
									rows={3}
								/>
							</div>
						</div>
					</Collapse>

					{/* {linkToEmailEditModal} */}
					{this.props.linkToEditCustomEmail()}

					{/* submit */}
					<Row className="justify-content-start">
						<Col>
							<Button
								variant="primary"
								type="submit"
							>
								{this.state.submitButtonLabel}
							</Button>
						</Col>
					</Row>

				</FormikForm>

				{/* confirmation & error messages */}
				{errorMessage}

				{/* modal to add lawyer from [+] button */}
				<FormModal
					show={this.state.lawyerAddModalShown}
					onHide={this.hideLawyerAddModal}
					header="Add Lawyer"
					body={<LawyerAddForm
						onHide={this.hideLawyerAddModal}
						submitForm={this.submitAddLawyer}
					/>}
				/>

				{/* modal to add visitor from [+] button */}
				<FormModal
					show={this.state.visitorAddModalShown}
					onHide={this.hideVisitorAddModal}
					header="Add a New Visitor"
					body={<VisitorAddForm
						onHide={this.hideVisitorAddModal}
						lawTypes={this.props.lawTypes}
						submitForm={this.submitAddInquirer}
					/>}
					size="lg"
				/>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		// pass these from parent?
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
		lawyers: state.people.lawyers,
		lawTypes: state.lawTypes.lawTypes,
	}
}

export default connect(mapStateToProps)(withFormik({
	mapPropsToValues: props => {
		return {
			[consultFields.LAWYERS]: [],
			[consultFields.INQUIRERS]: [],
			[consultFields.SITUATION]: '',
			[consultFields.DISPOSITIONS]: '',
			[consultFields.LAW_TYPES]: [],
			[consultFields.REF_SUMMARY]: '',
		}
	},
	validate,
	handleSubmit,
	displayName: 'consultationForm',
})(ConsultationForm));
