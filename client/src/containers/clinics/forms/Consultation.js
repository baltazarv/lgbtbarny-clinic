import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// components
import { Row, Col, Button } from 'react-bootstrap';
import ConsultationForm from './ConsultationForm';
import EditEmailModal from '../../../components/modals/EditEmailModal';
import TimerCounter from '../../../components/TimerCountdown/index';
// data
import * as actions from '../../../store/actions/index';
import * as consultFields from '../../../data/consultionFields';
import * as peopleFields from '../../../data/peopleFields';
import { getRecordsFromSelection, getPeopleIntoSelectOptions, formatName } from '../../../data/dataTransforms';
import { getInquirerConsultations } from '../../../data/consultationData';
import { EMAIL_OPTIONS, mergeCustomAndDefaultHtml } from '../../../emails/visitorPostConsultation';
// utils

const TYPE_CLINIC = 'Clinic';

// AirTable fields in peopleFields and consultFields
const SUBMIT_FIELDS_DEFAULT = {
	[consultFields.TYPE]: TYPE_CLINIC,
	// TO-DO: check to see if entry date is correct. Need toLocaleTimeString?
	[consultFields.DATE]: new Date().toISOString().substr(0, 10),
};

// make into a stateless component?
class Consultation extends Component {

	// lifecycle methods

	constructor(props) {
		super(props);
		this.state = {
			// populates inquirer info list for current:
			inquirersSelected: [],
			// all consultations for selected inquirers
			// fetched from this class and pushed to <ConsultationsList />
			inqSelectedConsultations: [],

			// prop sent to ConsultationForm (arg sent to a custom message?)
			serverResponse: null,

			showCustomizeEmailModal: false,
			customEmailText: '',
			customEmailDefaultIncluded: false,
			// invoked when change visitor
			resetEmailEditor: null,

			// used for success message at end of consultation
			timeSpent: 0,
		}
		this.submitConsultation = this.submitConsultation.bind(this);
		this.handleInquirerSelectChange = this.handleInquirerSelectChange.bind(this);
		this.submitAddLawyer = this.submitAddLawyer.bind(this);
		this.submitAddInquirer = this.submitAddInquirer.bind(this);
	}

	async handleInquirerSelectChange(options) {
		if (this.props.inquirers) {
			let inquirersSelected = getRecordsFromSelection(options, this.props.inquirers);
			let inqSelectedConsultations = await getInquirerConsultations(inquirersSelected);
			this.setState({
				inquirersSelected,
				inqSelectedConsultations,
			})
		} else {
			console.log('haven\'t pulled inquirers from db yet');
		}
	}

	async submitConsultation(values, setFieldValue, resetForm) {
		try {
			/** convert data:
			 *  * from React Select array to array of ids
			 *  * multiple select array to single select string
			 **/
			let payload = {};
			Object.keys(values).forEach(key => {
				const value = values[key];
				if (Array.isArray(value)) {
					// convert objects array into array id strings
					payload[key] = value.map(item => {
						return item.value;
					});
				} else if (key === consultFields.DISPOSITIONS) {
					// radio buttons on UI, but multiple select on AirTable -- may make match
					payload[key] = [value];
				} else {
					payload[key] = value;
				}
			})
			payload = { ...payload, ...SUBMIT_FIELDS_DEFAULT };
			// add custom text
			payload[consultFields.EMAIL_TEXT_SENT] = this.state.customEmailText;

			const selectedLawyers = values[consultFields.LAWYERS];

			const serverResponse = await this.props.createConsultation(payload);
			if (serverResponse.status === 'success' && serverResponse.type === 'createConsultation') {

				// ConsultationForm
				setFieldValue(consultFields.LAWYERS, selectedLawyers);
				resetForm();

				this.sendEmail(); // should return promise?
				if (this.state.resetEmailEditor) this.state.resetEmailEditor();

				this.setState({
					serverResponse,
					inquirersSelected: [], // hide <InquirerInfo />
					inqSelectedConsultations: [],
				})
			}

		} catch (err) {
			console.log(err)
		}
	}

	sendEmail = () => {
		let bodyText = '';
		if (!this.state.customEmailDefaultIncluded) {
			// `mergeCustomAndDefaultHtml` transforms \n to <br/>
			bodyText = mergeCustomAndDefaultHtml(this.state.customEmailText);
		} else {
			bodyText = this.state.customEmailText.replace(/(\r\n|\n|\r)/g, '<br />');
		}

		const payload = {
			from: EMAIL_OPTIONS.from,
			to: this.state.inquirersSelected[0][peopleFields.EMAIL],
			subject: EMAIL_OPTIONS.subject,
			bodyText,
		};
		axios.post('/api/v1/sendemail', payload);
		// .then(() => {});
	}

	async submitAddLawyer(values, setFieldValue) {
		try {
			const serverResponse = await this.props.createLawyer(values);
			if (serverResponse.status === 'success' && serverResponse.type === 'createLawyer') {
				this.setState({
					serverResponse
				});
				const selectedLawyers = getPeopleIntoSelectOptions([serverResponse.payload]);
				setFieldValue(consultFields.LAWYERS, selectedLawyers);

				// resetForm(); // `Warning: Can't perform a React state update on an unmounted component.`
			}
		} catch (error) {
			console.log(error)
		}
	}

	async submitAddInquirer(values, setFieldValue) {
		try {
			const serverResponse = await this.props.createInquirer(values);
			// console.log('submitAddInquirer', serverResponse);
			if (serverResponse.status === 'success' && serverResponse.type === 'createInquirer') {
				this.setState({
					serverResponse
				});
				let inquirer = serverResponse.payload.fields;
				inquirer.id = serverResponse.payload.id;
				const selectedInquirer = getPeopleIntoSelectOptions([inquirer]);
				setFieldValue(consultFields.INQUIRERS, selectedInquirer);

				// resetForm(); // `Warning: Can't perform a React state update on an unmounted component.`
			}
		} catch (error) {
			console.log(error)
		}
	}

	// email

	// link to open modal window to edit email
	linkToEditCustomEmail = () => {
		let linkToEmailEditModal = null;
		if (this.state.inquirersSelected.length > 0) {
			const firstCurrInquirer = this.state.inquirersSelected[0];
			const firstCurrInqName = formatName(firstCurrInquirer);
			if (firstCurrInquirer[peopleFields.EMAIL]) {
				let customEmailBtnLabel = <>Add custom message to email for <strong>{firstCurrInqName}</strong>.</>
				if (this.state.emailMessage) {
					customEmailBtnLabel = `Custom Message to Email ${firstCurrInqName} Added`;
				}
				linkToEmailEditModal = <Row>
					<Col>
						<Button
							onClick={() => this.showEmailEditModal()}
							variant="link" size="md" className="mb-3">
							{customEmailBtnLabel}
						</Button>
					</Col>
				</Row>;
			} else {
				linkToEmailEditModal = <div className="text-danger mb-3">Email address not entered for {firstCurrInqName} - will not receive email.</div>
			}
		}
		return <>{linkToEmailEditModal}</>;
	}

	showEmailEditModal = () => {
		this.setState(state => {
			return {
				showCustomizeEmailModal: true,
			}
		});
	}

	hideEmailEditModal = () => {
		this.setState({
			showCustomizeEmailModal: false,
		});
	}

	saveCustomEmail = (customEmailText, customEmailDefaultIncluded, resetEmailEditor) => {
		this.setState({
			// text: `customEmailText` may not have boilerplate text
			customEmailText,
			// boolean: should not merge with default copy?
			customEmailDefaultIncluded,
			// function: invoked when change visitor
			resetEmailEditor,
		})
	}

	getTimeSpent = (totalTime) => {
		const minutes = (totalTime.totalSeconds / 60).toFixed(1)
		this.setState({
			timeSpent: minutes,
		})
	}

	render() {

		// `createConsultation` success message
		let successMessage = null;
		if (this.state.serverResponse && this.state.serverResponse.status === 'success' && this.state.serverResponse.type === 'createConsultation') {
			// let lastConsult = '';
			successMessage = <Row>
				<Col xs={8} className="mx-auto w-50 p-3 text-center font-italic text-success"><span className="font-weight-bold">{this.state.serverResponse.payload[consultFields.NAME]}</span> consultation was successfully submitted!<br />
					Time spent: {this.state.timeSpent} minutes.</Col>
			</Row>;
		}

		let timerCounter = null;
		if (this.state.inquirersSelected.length > 0) {
			timerCounter = <TimerCounter getTimeSpent={this.getTimeSpent} />
		}

		return (
			<>
				<ConsultationForm
					clinicTitle={this.props.clinicTitle}
					inquirers={this.props.inquirers}
					lawyers={this.props.lawyers}
					lawTypes={this.props.lawTypes}
					// container will handle state
					handleInquirerSelectChange={this.handleInquirerSelectChange}
					submitForm={this.submitConsultation}
					// modal > ConsultationForm > Consultation
					submitAddLawyer={this.submitAddLawyer}
					submitAddInquirer={this.submitAddInquirer}
					// hide visitor info list when `success`
					serverResponse={this.state.serverResponse}
					// when add new inquirers reload from db
					refreshInquirers={this.props.refreshInquirers}
					// needed for (1) visitor info table & (2) for link to custom email editing modal
					inquirersSelected={this.state.inquirersSelected}
					inqSelectedConsultations={this.state.inqSelectedConsultations}

					linkToEditCustomEmail={this.linkToEditCustomEmail}
				/>

				{/* edit custom email modal */}
				<EditEmailModal
					// for data
					inquirers={this.state.inquirersSelected}
					handleSavedEdit={this.saveCustomEmail}
					// for modal
					showModal={this.state.showCustomizeEmailModal}
					handleCloseModal={this.hideEmailEditModal}
				/>

				{/* confirmation & error messages */}
				{successMessage}

				{timerCounter}

			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		currentLawyers: state.people.currentLawyers, // REMOVE?
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createConsultation: consult => dispatch(actions.createConsultation(consult)),
		createLawyer: lawyer => dispatch(actions.createLawyer(lawyer)),
		createInquirer: inquirer => dispatch(actions.createInquirer(inquirer)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Consultation);
