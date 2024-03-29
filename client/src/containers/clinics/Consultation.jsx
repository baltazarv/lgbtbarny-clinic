import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// components
import { Row, Col } from 'react-bootstrap';
import { Button } from 'antd';
import ConsultationForm from '../../components/clinics/consultationForm/ConsultationForm';
import EditEmailModal from '../../components/clinics/consultationForm/EditEmailModal';
import TimerCounter from '../../components/TimerCountdown/index';
// data
import * as actions from '../../store/actions/index';
import * as consultFields from '../../data/consultFields';
import * as peopleFields from '../../data/peopleFields';
import { formatName } from '../../data/peopleData';
// import { getInquirerConsultations } from '../../../data/consultationData';
import { EMAIL_OPTIONS, mergeCustomAndDefaultHtml } from '../../emails/visitorPostConsultation';
import { objectIsEmpty } from '../../utils';

// make into a stateless component?
class Consultation extends Component {

	// lifecycle methods

	constructor(props) {
		super(props);
		this.state = {
			// populates inquirer info list for current:
			inquirersSelected: {},

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
	}

	handleInquirerSelectChange = (options) => {
		// array to object
		const inquirersSelected = {};
		options.forEach(option => {
			inquirersSelected[option] = this.props.inquirersObject[option];
		});
		this.setState({
			inquirersSelected,
		})
	}

	async submitConsultation(values, setFieldValue, resetForm) {
		try {
			/** convert data:
			 *  * from React Select array to array of ids
			 *  * multiple select array to single select string
			 **/
			let payload = {};
			Object.keys(values).forEach(key => {
				const value = values[key]
				if (Array.isArray(value)) {
					// convert objects array into array id strings
					payload[key] = value.map(item => {
						return item
					})
				} else if (key === consultFields.DISPOSITIONS) {
					// radio buttons on UI, but multiple select on AirTable -- may make match
					payload[key] = [value]
				} else {
					payload[key] = value
				}
			})

			// set as type 'Clinic'
			payload[consultFields.TYPE] = consultFields.TYPE_CLINIC

			// set new datetime stamp
			payload[consultFields.DATETIME] = new Date()

			// set clinic
			let clinicValue = consultFields.CLINIC_TNC
			if (this.props.clinic === 'nj') clinicValue = consultFields.CLINIC_NJ
			if (this.props.clinic === 'youth') clinicValue = consultFields.CLINIC_YOUTH
			payload[consultFields.CLINIC_NAME] = clinicValue

			// add custom email text
			payload[consultFields.EMAIL_TEXT_SENT] = this.state.customEmailText

			// reset same lawyer after submission
			const selectedLawyers = values[consultFields.LAWYERS]

			const serverResponse = await this.props.createConsultation(payload)
			if (serverResponse.status === 'success' && serverResponse.type === 'createConsultation') {

				// ConsultationForm
				resetForm()
				setFieldValue(consultFields.LAWYERS, selectedLawyers)

				this.sendEmail() // should return promise?
				if (this.state.resetEmailEditor) this.state.resetEmailEditor()

				this.setState({
					serverResponse,
					inquirersSelected: {}, // hide <InquirerInfo />
				})
			}

		} catch (err) {
      console.log('submitConsultation error', err)
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

		const firstCurrInquirer = this.state.inquirersSelected[[Object.keys(this.state.inquirersSelected)[0]]];
		const payload = {
			from: EMAIL_OPTIONS.from,
			to: firstCurrInquirer[peopleFields.EMAIL],
			subject: EMAIL_OPTIONS.subject,
			bodyText,
		};
		axios.post('/api/v1/sendemail', payload);
		// .then(() => {});
	}

	// email

	// link to open modal window to edit email
	editCustomEmailButton = () => {
		let linkToEmailEditModal = null;
		if (!objectIsEmpty(this.state.inquirersSelected)) {
			const firstCurrInquirer = this.state.inquirersSelected[[Object.keys(this.state.inquirersSelected)[0]]];
			const firstCurrInqName = formatName(firstCurrInquirer);
			if (firstCurrInquirer[peopleFields.EMAIL]) {
				let customEmailBtnLabel = <>Customize email to <strong>{firstCurrInqName}</strong></>
				if (this.state.emailMessage) {
					customEmailBtnLabel = `Custom Message to Email ${firstCurrInqName} Added`;
				}
				linkToEmailEditModal = <Row>
					<Col>
						<Button
							icon="mail"
							onClick={() => this.showEmailEditModal()}
							type="primary"
						>
							&nbsp;{customEmailBtnLabel}
						</Button>
						<div className="mb-3"><small>Emails sent on submission.</small></div>
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
		if (!objectIsEmpty(this.state.inquirersSelected)) {
			timerCounter = <TimerCounter getTimeSpent={this.getTimeSpent} />
		}

		return (
			<>
				<ConsultationForm
					clinic={this.props.clinic}
					consultations={this.props.consultations}
					inquirers={this.props.inquirers}
					inquirersObject={this.props.inquirersObject}
					lawyers={this.props.lawyers}
					lawyersObject={this.props.lawyersObject}
					lawTypes={this.props.lawTypes}
					lawTypesObject={this.props.lawTypesObject}
					handleInquirerSelectChange={this.handleInquirerSelectChange}
					submitForm={this.submitConsultation}
					createLawyer={this.props.createLawyer}
					// hide visitor info list when `success`
					serverResponse={this.state.serverResponse}
					refreshLawyers={this.props.refreshLawyers}
					refreshInquirers={this.props.refreshInquirers}
					// needed for (1) visitor info table & (2) for link to custom email editing modal
					inquirersSelected={this.state.inquirersSelected}

					editCustomEmailButton={this.editCustomEmailButton}
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
		consultations: state.consultations.consultations,
		inquirersObject: state.people.inquirersObject,
		lawyers: state.people.lawyers,
		lawyersObject: state.people.lawyersObject,
		lawTypes: state.lawTypes.lawTypes,
		lawTypesObject: state.lawTypes.lawTypesObject,
		currentLawyers: state.people.currentLawyers, // REMOVE?
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createConsultation: consult => dispatch(actions.createConsultation(consult)),
		createLawyer: lawyer => dispatch(actions.createLawyer(lawyer)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Consultation);
