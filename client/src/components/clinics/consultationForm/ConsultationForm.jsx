import React, { Component } from 'react';
import { withFormik, Form as FormikForm, Field } from 'formik';
// components
import { Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import { ReloadOutlined } from '@ant-design/icons'
import Select from '../../forms/fields/Select';
import { Button as AntButton, Tooltip } from 'antd'
import RadioButtonGroup from '../../forms/fields/RadioButtonGroup';
import RadioButton from '../../forms/fields/RadioButton';
import TextArea from '../../forms/fields/TextArea';
import VisitorList from '../VisitorList';
import FormModal from '../../modals/FormModal';
import NewAndRepeatVisitor from '../shared/NewAndRepeatVisitor';
import LawyerAddForm from './LawyerAddForm';
// data
import * as consultFields from '../../../data/consultFields';
import * as peopleFields from '../../../data/peopleFields';
import { getOptionsForPeople, getPeopleByIds, formatName } from '../../../data/peopleData';
import { getOptionsForLawTypes } from '../../../data/lawTypeData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../../utils';

// determines if referral fields show and validate
// b/c validate function needs to be outside class, this flag cannot be in the local class state
let isReferralDispositionChecked = false;

const validate = (values) => {
	const errors = {}
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
	return errors
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
		this.state = {
			lawyerAddModalShown: false,
			visitorAddModalShown: false,
			submitButtonLabel: 'Submit & Send Email to Visitor',
			visitorSelectIsRefreshing: false,
			visitorSelectPlaceholder: 'Select...',
			lawyerSelectIsRefreshing: false,
			lawyerSelectPlaceholder: 'Select...',
		}
		this.refreshInquirers = this.refreshInquirers.bind(this);
		this.handleAddVisitor = this.handleAddVisitor.bind(this);
		this.refreshLawyers = this.refreshLawyers.bind(this);
		this.handleAddLawyer = this.handleAddLawyer.bind(this);
	}

	// form control event handlers

	handleInquirerSelectChange(options) {
		this.props.setFieldValue(consultFields.INQUIRERS, options);
		this.props.handleInquirerSelectChange(options);
	}

	async refreshInquirers() {
		this.setState({
			visitorSelectIsRefreshing: true,
			visitorSelectPlaceholder: 'Loading...',
		});
		const serverResponse = await this.props.refreshInquirers();
		this.setState({
			visitorSelectIsRefreshing: false,
			visitorSelectPlaceholder: 'Select...',
		});
		return serverResponse;
	}

	async handleAddVisitor(newInquirer) {
		const serverResponse = await this.refreshInquirers();
		if (serverResponse && serverResponse.payload && serverResponse.status === 'success') {
			this.hideVisitorAddModal();
			this.handleInquirerSelectChange([...this.props.values[consultFields.INQUIRERS], newInquirer.id]);
		};
	}

	async refreshLawyers() {
		this.setState({
			lawyerSelectIsRefreshing: true,
			lawyerSelectPlaceholder: 'Loading...',
		});
		const serverResponse = await this.props.refreshLawyers();
		if (serverResponse.status === 'success' && serverResponse.type === 'getLawyers') {
			this.setState({
				lawyerSelectIsRefreshing: false,
				lawyerSelectPlaceholder: 'Select...',
			});
		}
		return serverResponse;
	}

	async handleAddLawyer(value) {
		// this.props.handleAddLawyer(value, this.props.setFieldValue);
		try {
			const createServerResponse = await this.props.createLawyer(value);
			this.setState({
				serverResponse: createServerResponse,
			});
			if (createServerResponse.status === 'success' && createServerResponse.type === 'createLawyer') {
				const refreshServerResponse = await this.refreshLawyers();
				if (refreshServerResponse.status === 'success' && refreshServerResponse.type === 'getLawyers') {
					this.props.setFieldValue(consultFields.LAWYERS, [...this.props.values[consultFields.LAWYERS], createServerResponse.payload.id]);
					this.hideLawyerAddModal();

					// resetForm();
				}
			}
		} catch (error) {
			console.log(error)
		}
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

	getConsultationsModalTitle = consultation => {
		// { id: {...fields} }
		if (!objectIsEmpty(consultation)) {
			const key = Object.keys(consultation)[0];
			const fields = consultation[key];
			if (fields[consultFields.INQUIRERS]) {
				return <span>Consultation for {getPeopleByIds(fields[consultFields.INQUIRERS], this.props.inquirersObject)} on {isoToStandardDate(fields[consultFields.CREATED_ON])}</span>;
			}
		}
		return null;
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

		// passed by Consultaton parent container
		const {
			inquirersSelected,
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

		const visitorModalListItems = {
			fields: [
				{
					key: peopleFields.OTHER_NAMES,
				},
				{
					key: peopleFields.PRONOUNS,
				},
				{
					key: peopleFields.GENDER,
				},
				{
					key: peopleFields.LAW_TYPES,
					emptyDefault: 'Not determined.',
				},
				{
					key: peopleFields.INCOME,
				},
				{
					key: peopleFields.INTAKE_NOTES,
				},
				{
					key: peopleFields.ADDRESS,
				},
				{
					key: peopleFields.PHONE,
				},
				{
					key: peopleFields.EMAIL,
				},
				{
					key: peopleFields.CONSULTATIONS,
					title: 'Previous Consultations',
					listItems: {
						fields: [
							{
								key: consultFields.LAWYERS,
								emptyDefault: 'Not specified.',
							},
							{
								key: consultFields.SITUATION,
							},
							{
								key: consultFields.DISPOSITIONS,
							},
							{
								key: consultFields.LAW_TYPES,
							},
							{
								key: consultFields.REF_SUMMARY,
							},
							{
								key: consultFields.STATUS,
							},
						]
					}
				},
			],
		};

		let visitorsLists = [];
		if (!objectIsEmpty(inquirersSelected)) {
			for (var key in inquirersSelected) {
				const visitor = { [key]: { ...inquirersSelected[key] } };
				const visitorList = <VisitorList
					key={key}
					header={<strong>{formatName(inquirersSelected[key])}</strong>}
					visitor={visitor}
					listItems={visitorModalListItems}
					lawTypes={this.props.lawTypesObject}
					// constultations
					consultations={this.props.consultations}
					lawyers={this.props.lawyersObject}
					renderConsultModalTitle={this.getConsultationsModalTitle}
				/>
				visitorsLists.push(visitorList);
			}
		}

		return (
			<>
				<h1 className="h2">Consultation with Attorney(s)</h1>
				<div className="mb-3 small">
					Please insert the information you collected for each visitor that you spoke to. Give a summary of the visitor's issue and indicate whether or not they need a referral.
				</div>
				<p className="text-danger small">*<sup> &ndash; </sup>Required</p>
				<FormikForm>

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
									<Select
										name={consultFields.LAWYERS}
										options={getOptionsForPeople(this.props.lawyersObject)}
										required={true}
										mode="multiple"
										value={values[consultFields.LAWYERS]}
										onChange={values => setFieldValue(consultFields.LAWYERS, values)}
										onBlur={() => setFieldTouched(consultFields.LAWYERS, true)}
										touched={touched[consultFields.LAWYERS]}
										error={errors[consultFields.LAWYERS]}
										loading={this.state.lawyerSelectIsRefreshing}
										placeholder={this.state.lawyerSelectPlaceholder}
									/>
								</Col>
								<Col xs={2} className="justify-content-left">
									<Tooltip title="add new lawyer">
										<Button onClick={() => this.showLawyerAddModal()} size="sm">+</Button>
									</Tooltip>
								</Col>
							</Row>
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
									<Select
										name={consultFields.INQUIRERS}
										options={getOptionsForPeople(this.props.inquirersObject)}
										// label={}
										required={true}
										mode="multiple"
										value={values[consultFields.INQUIRERS]}
										onChange={values => this.handleInquirerSelectChange(values)}
										onBlur={() => setFieldTouched(consultFields.INQUIRERS, true)}
										touched={touched[consultFields.INQUIRERS]}
										error={errors[consultFields.INQUIRERS]}
									/>
								</Col>
								<Col xs={3} sm={4} md={3} className="justify-content-left">
									<Tooltip title="refresh visitor info">
										<AntButton
											shape="circle"
											onClick={this.refreshInquirers}
											className="mr-3 pb-1"
											icon={<ReloadOutlined />}
										/>
									</Tooltip>
									<Tooltip title="add new visitor">
										<Button onClick={() => this.showVisitorAddModal()} size="sm">+</Button>
									</Tooltip>
								</Col>
							</Row>
						</Col>
					</Form.Group>

					{/* selected visitor list(s) */}
					{!objectIsEmpty(inquirersSelected) &&
						<div>{visitorsLists}</div>
					}

					{/* notes (inquirer's summary) text area */}
					<div className="mb-4">
						<Field
							component={TextArea}
							name={consultFields.SITUATION}
							id={consultFields.SITUATION}
							label="Notes"
							description="Please describe the factual situation as well as the legal assessment. This section is necessary for referrals."
							// placeholder=""
							rows={5}
						/>
					</div>

					{/* customize email */}
					{this.props.editCustomEmailButton()}

					{/* disposition */}
					<RadioButtonGroup
						id={consultFields.DISPOSITIONS}
						label="Disposition"
						value={values[consultFields.DISPOSITIONS]}
						error={errors[consultFields.DISPOSITIONS]}
						touched={touched[consultFields.DISPOSITIONS]}
						required={true}
					>
						<div style={{ marginBottom: '0.7rem' }}>
							<Field
								component={RadioButton}
								name={consultFields.DISPOSITIONS}
								id={consultFields.DISPOSITIONS_NO_FURTHER}
								label={consultFields.DISPOSITIONS_NO_FURTHER}
							/>
						</div>
						<div style={{ marginBottom: '0.7rem' }}>
							<Field
								component={RadioButton}
								name={consultFields.DISPOSITIONS}
								id={consultFields.DISPOSITIONS_FEE_BASED}
								label={consultFields.DISPOSITIONS_FEE_BASED}
							/>
							<div className="text-muted" style={{ lineHeight: 1.25 }}><small>WE CANNOT GUARANTEE that a lawyer will accept the case for consultation or representation.</small></div>
						</div>
						<div style={{ marginBottom: '0.7rem' }}>
							<Field
								component={RadioButton}
								name={consultFields.DISPOSITIONS}
								id={consultFields.DISPOSITIONS_PRO_BONO}
								label={consultFields.DISPOSITIONS_PRO_BONO}
							/>
							<div className="text-muted" style={{ lineHeight: 1.25 }}><small>Because pro bono availability is EXTRAORDINARILY LIMITED, the person should consider contacting other legal services organizations.</small></div>
						</div>
						<div style={{ marginBottom: '0.7rem' }}>
							<Field
								component={RadioButton}
								name={consultFields.DISPOSITIONS}
								id={consultFields.DISPOSITIONS_COMPELLING}
								label={consultFields.DISPOSITIONS_COMPELLING}
							/>
						</div>
						<div style={{ marginBottom: '0.7rem' }}>
							<Field
								component={RadioButton}
								name={consultFields.DISPOSITIONS}
								id={consultFields.DISPOSITIONS_IMMIGRATION}
								label={consultFields.DISPOSITIONS_IMMIGRATION}
							/>
							<div className="text-muted" style={{ lineHeight: 1.25 }}><small>Only for VERY complicated immigration cases which need review, especially asylum &amp; trafficking.</small></div>
						</div>
					</RadioButtonGroup>

					<Collapse in={isReferralDispositionChecked}>
						<div id="referrals">

							{/* type of law */}
							<Form.Group as={Row} controlId="typeOfLawPulldown">
								<Form.Label column sm={4} className="text-md-right">
									Type Of Law<span className="text-danger">*</span>
								</Form.Label>
								<Col sm={7}>
									<Form.Text className="text-muted">
										Choose any relevant types of law.
									</Form.Text>
									<Select
										name={consultFields.LAW_TYPES}
										options={getOptionsForLawTypes(this.props.lawTypesObject)}
										required={true}
										mode="multiple"
										value={values[consultFields.LAW_TYPES]}
										onChange={values => setFieldValue(consultFields.LAW_TYPES, values)}
										onBlur={() => setFieldTouched(consultFields.LAW_TYPES, true)}
										touched={touched[consultFields.LAW_TYPES]}
										error={errors[consultFields.LAW_TYPES]}
									/>
								</Col>
							</Form.Group>

							<div className="mb-2 text-muted" style={{ lineHeight: 1.25 }}><small><em></em></small></div>


							{/* ref summary */}
							<div className="mb-4">
								<Field
									component={TextArea}
									name={consultFields.REF_SUMMARY}
									id={consultFields.REF_SUMMARY}
									label="Referral Summary"
									description={'Please try to write no more than two sentences to be used independently of the Notes above in order for us to make referrals. This summary will be read by prospective attorneys, so it must be clear, concise, and compelling; otherwise, the referrals are unlikely to be picked up for consultation or representation.'}
									placeholder="Clinic visitor seeks attorney for representation in landlord-tenant matter. Person is able to pay to retain a lawyer."
									required={true}
									rows={3}
								/>
							</div>
						</div>
					</Collapse>

					<p className="text-muted">Our Clinic provides BRIEF LEGAL SERVICES and, unfortunately, WE CANNOT GUARANTEE FURTHER FOLLOW-UP.  Please, do NOT tell visitors that "someone will be getting back to them."</p>

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
						submitForm={this.handleAddLawyer}
					/>}
				/>

				{/* modal to add/update visitor from [+] button */}
				<FormModal
					show={this.state.visitorAddModalShown}
					onHide={this.hideVisitorAddModal}
					header="Add/Update Visitor"
					body={<NewAndRepeatVisitor
						clinic={this.props.clinic}
						onSubmit={this.handleAddVisitor}
					/>}
					size="lg"
				/>
			</>
		);
	}
}

export default withFormik({
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
})(ConsultationForm);
