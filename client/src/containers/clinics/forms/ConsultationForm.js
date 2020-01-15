import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server';

import { Row, Col, Card, Form, Button, Collapse, ListGroup } from 'react-bootstrap';
import ReactSelectWithValidation from '../../../components/forms/fields/ReactSelectWithValidation';

// forms
import LawyerAddForm from '../../../components/forms/LawyerAddForm';
import VisitorAddForm from '../../../components/forms/VisitorAddForm';

// modals
import * as actions from '../../../store/actions/index';
import FormModal from '../../../components/modals/FormModal';
import PrevConsultationModal from '../../../components/modals/PrevConsultationModal';
import EditEmailModal from '../../../components/modals/EditEmailModal';
import TimerCounter from '../../../components/TimerCountdown/index';

// import styles from './ConsultationForm.module.css';

import * as peopleFields from '../../../data/peopleFields';
import * as consultFields from '../../../data/consultionFields';
import { formatInquirerName } from '../../../utils/textUtils';
import jsxToPlainText from '../../../utils/jsxToPlainText';

const EMAIL_OPTIONS = {
	from: 'LeGaL <no-reply@le-gal.org>',
	// to: 'baltazarv@gmail.com',
	subject: 'Thank you for visiting the Tuesday Night Clinic of the LGBT Bar Association of Greater New York',
	bodyPre: 'Thank you for visiting tonight\'s Clinic. If the volunteer lawyer with whom you had a consultation indicated that specific information would be provided, please find that information below.',
	bodyPost: <span>Our Clinic provides brief, on-the-spot legal services, so <strong><em>we are unable to provide ongoing follow-up or to guarantee that any referrals that might be made to our Lawyer Referral Network will be picked up</em></strong> for consultation or representation. If a referral is picked up, however, you and the prospective lawyer(s) will receive email notification so that you can be in touch. Please also feel free to return to the Clinic for other legal questions.</span>,
	filename: 'email-visitor.html',
}

// consultation values
const DISP_NO_FURTHER = 'No further action required or available. Info/counsel provided.';
const DISP_FEE_BASED = 'Fee-based - Lawyer Referral Network (LRN) - limited availability';
const DISP_PRO_BONO = 'Pro Bono Panel (PBP) - VERY limited availability!';
const DISP_IMPACT = 'Highly compelling/impact litigation';
const TYPE_CLINIC = 'Clinic';
// AirTable fields in peopleFields and consultFields
const SUBMIT_FIELDS_DEFAULT = {
	[consultFields.TYPE]: TYPE_CLINIC,
	[consultFields.DATE]: new Date().toISOString().substr(0, 10),
	[consultFields.EMAIL_TEXT_SENT]: `${EMAIL_OPTIONS.bodyPre}<br /><br />${renderToStaticMarkup(EMAIL_OPTIONS.bodyPost)}`,
};

class InquirerForm extends Component {

	constructor(props) {
		super(props);
		this.inquirerForm = React.createRef();
		this.formDispositionNoFurther = React.createRef();
		this.formDispositionFeeBased = React.createRef();
		this.formDispositionProBono = React.createRef();
		this.formDispositionImpact = React.createRef();
		this.state = {
			lawyers: [],
			lawyerIsSelected: false,
			inquirers: [],
			inquirerIsSelected: false,
			situation: '',
			prevConsultSelected: false,
			lawyerAddModalShown: false,
			visitorAddModalShown: false,
			consultModalShown: false,
			emailEditModalShown: false,
			isReferralDispositionChecked: false,
			lawTypes: [],
			lawTypeIsSelected: false,
			refSummary: '',
			// appears on textarea:
			emailMessageTemp: '',
			// custom message saved:
			emailMessage: '',
			// switch to textarea containing default text?
			emailBodyDefaultModified: false,
			// default text added to custom text and saved?
			emailBodyModifyConfirmed: false,
			submitFields: SUBMIT_FIELDS_DEFAULT, // AirTable format
			validated: false, // for use later
			submitSuccess: false,
			submitError: false,
			submitButtonLabel: 'Submit & Send Email to Visitor',
			timeSpent: 0,
		}
	}

	// lifecycle methods

	componentDidMount() {
		this.setState({
			emailMessage: '',
		})
	}

	componentDidUpdate(prevProps) {
		if (this.props.consultSubmitStatus.status === 'success') {
			this.clearForm();
			this.props.getInquirers();
			this.props.consultationInProgress();
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.currentInquirers.length > 0) {
			return {
				inquirerIsSelected: true
			}
		} else {
			return {
				inquirerIsSelected: false
			}
		}
	}

	// modal handlers

	showConsultModal = (consultId) => {
		const prevConsultSelected = this.props.currInqsPastConsults.find(consult => {
			return consult.id === consultId;
		});
		this.setState({
			prevConsultSelected,
			consultModalShown: true,
		});
	}

	hideConsultModal = () => {
		this.setState({ consultModalShown: false });
	}

	showEmailEditModal = () => {
		this.setState(state => {
			return {
				emailMessageTemp: state.emailMessage,
				emailEditModalShown: true,
			}
		});
	}

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

	// email methods

	editEmailBodyDefault = () => {
		const bodyPostString = jsxToPlainText(EMAIL_OPTIONS.bodyPost);
		this.setState(state => {
			return {
				emailBodyDefaultModified: true,
				emailMessageTemp: EMAIL_OPTIONS.bodyPre + '\n\n' + (state.emailMessageTemp ? state.emailMessageTemp + '\n\n' : '') + bodyPostString
			}
		})
		this.setState({
		})
	}

	cancelCustomEmailDefault = () => {
		this.setState({
			emailBodyDefaultModified: false,
			emailBodyModifyConfirmed: false,
		})
	}

	cancelEditModal = () => {
		this.setState(state => {
			let emailBodyDefaultModified = state.emailBodyDefaultModified;
			if (state.emailBodyDefaultModified && !state.emailBodyModifyConfirmed) emailBodyDefaultModified = false;
			return {
				emailEditModalShown: false,
				emailBodyDefaultModified,
				emailMessageTemp: '',
			}
		})
	}

	saveEditModal = async () => {
		let emailBodyModifyConfirmed = false;
		if (this.state.emailBodyDefaultModified) emailBodyModifyConfirmed = true;
		this.setState(state => {
			const submitFields = { ...state.submitFields };
			submitFields[consultFields.EMAIL_TEXT_SENT] = state.emailMessageTemp;
			return {
				submitFields,
				emailBodyModifyConfirmed,
				emailMessage: state.emailMessageTemp,
				emailEditModalShown: false,
			}
		});
	}

	// form control event handlers

	handleLawyerSelectChange = opt => {
		const lawyers = opt.reduce((acc, curr) => {
			acc.push(curr.value);
			return acc;
		}, []);
		let lawyerIsSelected = false;
		if (lawyers.length > 0) {
			lawyerIsSelected = true;
		}
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.LAWYERS] = lawyers;
			return {
				submitFields,
				lawyers: opt,
				lawyerIsSelected,
				submitError: false,
			};
		});
	}

	handleInquirerSelectChange = options => {
		// add inquirers to submitFields state object
		const inquirers = options.reduce((acc, curr) => {
			acc.push(curr.value);
			return acc;
		}, []);
		let inquirerIsSelected = false;
		if (inquirers.length > 0) {
			inquirerIsSelected = true;
		} else {
			this.setState({
				emailMessageTemp: '',
				emailMessage: '',
				emailBodyDefaultModified: false,
				emailBodyModifyConfirmed: false,
			})
		}
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.INQUIRERS] = inquirers;
			return {
				submitFields,
				inquirers: options,
				inquirerIsSelected,
				submitError: false,
			};
		});
		// get expanded consultations, add info to inquirers, and set currentInquirers state
		let currentInquirers = [];
		if (options.length > 0) {
			options.forEach(opt => {
				const inquirerChoice = this.props.inquirers.find(inq => {
					return inq.id === opt.value;
				})
				currentInquirers = [...currentInquirers, inquirerChoice];
			});
		}
		this.props.setCurrentInquirers(currentInquirers);
		this.props.getCurrInqPastConsults(currentInquirers);
	}

	// inquirer situation (notes) & ref summary" text area
	handleInputChange = evt => {
		const target = evt.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		let submitFields = { ...this.state.submitFields };
		switch (name) {
			case 'situation':
				submitFields[consultFields.SITUATION] = value;
				break;
			case 'refSummary':
				submitFields[consultFields.REF_SUMMARY] = value;
				break;
			// 'emailMessage': updated on saveEditModal
			default:
		}

		this.setState((prevState, props) => {
			return {
				submitFields,
				[name]: value,
				submitError: false,
			};
		});
	}

	dispoRadioOnChange = evt => {
		if (evt.currentTarget.id === 'formDispositionFeeBased' || evt.currentTarget.id === 'formDispositionProBono') {
			this.setState({ isReferralDispositionChecked: true });
		} else {
			this.setState({ isReferralDispositionChecked: false });
		};
		if (evt.target.checked) {
			const value = evt.target.value;
			this.setState((prevState, props) => {
				let submitFields = { ...prevState.submitFields };
				submitFields[consultFields.DISPOSITIONS] = [value];
				return {
					submitFields,
					submitError: false,
				};
			});
		};
	}

	handleTypeOfLawSelectChange = opt => {
		const lawTypes = opt.reduce((acc, curr) => {
			acc.push(curr.value);
			return acc;
		}, []);
		let lawTypeIsSelected = false;
		if (lawTypes.length > 0) {
			lawTypeIsSelected = true;
		}
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.LAW_TYPES] = lawTypes;
			return {
				submitFields,
				lawTypes: opt,
				lawTypeIsSelected,
				submitError: false,
			};
		});
	}

	handleSubmit = evt => {
		evt.preventDefault();
		evt.stopPropagation();
		const form = evt.currentTarget;
		let lawTypeReqAndEmpty = false;
		if (this.state.isReferralDispositionChecked && !this.state.lawTypeIsSelected) {
			lawTypeReqAndEmpty = true;
		}
		if (form.checkValidity() === true && this.state.lawyerIsSelected && this.state.inquirerIsSelected && !lawTypeReqAndEmpty) {
			// newlines html to plain text
			const cleanSubmitFields = { ...this.state.submitFields };
			cleanSubmitFields[consultFields.EMAIL_TEXT_SENT] = this.state.emailMessage.replace(/<br>|<br \/>/g, '\n').replace(/<[^>]*>/g, ""); // plain text to html replacement on server
			this.props.createConsultation(cleanSubmitFields);
			this.sendEmail(); // add error handling
			this.setState({
				submitSuccess: true,
				submitError: false,
			})
		} else {
			this.setState({
				submitSuccess: false,
				submitError: true,
			})
		}
		this.setState({ validated: true });
	}

	sendEmail = () => {
		const options = { ...EMAIL_OPTIONS };
		// save newlines as html <br /> tags
		const customTextHtml = this.state.emailMessage.replace(/(\r\n|\n|\r)/g, '<br />');
		if (this.state.emailBodyModifyConfirmed) {
			options['customText'] = customTextHtml;
		} else {
			options['customText'] = EMAIL_OPTIONS.bodyPre + '<br /><br />' + customTextHtml + (this.state.emailMessage ? '<br /><br />' : '') + renderToStaticMarkup(EMAIL_OPTIONS.bodyPost);
		}
		options['to'] = this.props.currentInquirers[0].email;
		axios.post('/api/v1/sendemail', options)
		// .then(() => {});
	}

	clearDispoRadios = () => {
		this.formDispositionNoFurther.current.checked = false;
		this.formDispositionFeeBased.current.checked = false;
		this.formDispositionProBono.current.checked = false;
		this.formDispositionImpact.current.checked = false;
	}

	clearForm = () => {
		this.inquirerForm.current.reset(); // doesn't reset radio checked values
		this.clearDispoRadios();
		const submitFields = SUBMIT_FIELDS_DEFAULT;
		// keeping same lawyer selected
		submitFields[consultFields.LAWYERS] = this.state.submitFields[consultFields.LAWYERS];
		this.setState({
			// lawyers: [], // keep same lawyer selected
			inquirers: [],
			situation: '',
			dispositions: [],
			refSummary: '',
			lawTypes: [],
			submitFields,
			submitButtonLabel: 'Submit & Send Email to Another Visitor',
			validated: false,
			isReferralDispositionChecked: false,
			emailMessageTemp: '',
			emailMessage: '',
			emailBodyDefaultModified: false,
			emailBodyModifyConfirmed: false,
		});
		this.props.setCurrentInquirers([]);
		// no need to call this.props.setCurrInqPastConsults([]);
	}

	// format lawyers into select options: { label: "Alligators", value: 1 },
	getLawyerSelectOptions = (arr) => {
		return arr.reduce((acc, curr) => {
			if (curr.firstName || curr.lastName) {
				const inqObj = {
					value: curr.id,
					label: formatInquirerName(curr),
				}
				return [...acc, inqObj]
			} else {
				return acc;
			}
		}, []);
	}

	// format inquirers into select options: { label: "Alligators", value: 1 },
	getInquirerSelectOptions = (arr) => {
		return arr.reduce((acc, curr) => {
			if (curr.firstName || curr.lastName) {
				const inqObj = {
					value: curr.id,
					label: formatInquirerName(curr),
				}
				return [...acc, inqObj]
			} else {
				return acc;
			}
		}, []);
	}

	// format type of law state into select options
	getLawTypeSelectOptions = (arr) => {
		return arr.reduce((acc, curr) => {
			return [...acc, { value: curr.id, label: curr.type }]
		}, []);
	}

	getTimeSpent = (totalTime) => {
		const minutes = (totalTime.totalSeconds / 60).toFixed(1)
		this.setState({
			timeSpent: minutes,
		})
	}

	render() {
		let lawyerSelectOptions = this.getLawyerSelectOptions(this.props.lawyers);

		let inqSelectOptions = this.getInquirerSelectOptions(this.props.inquirers);

		let lawTypeOptions = this.getLawTypeSelectOptions(this.props.lawTypes);

		// selected inquirer's past consultations
		const renderPastConsults = inqId => {
			// wait till prop is populated
			if (!this.props.currInqsPastConsults || this.props.currInqsPastConsults.length < 1) {
				return null;
			} else {
				// get consultation for inquirer id passed
				const consultsForInq = this.props.currInqsPastConsults.reduce((acc, curr) => {
					if (curr.inquirers.some(inq => inq === inqId)) {
						acc.push(curr);
					}
					return acc;
				}, []);
				if (consultsForInq.length > 0) {
					return <ListGroup.Item>
						<strong>Previous Consultations:</strong>
						<ul className="mb-0">
							{consultsForInq.map(consult => {
								let lawyerInfo = '';
								let lawyers = consult.lawyers;
								if (lawyers) { // some consultations did not have lawyers added
									let lawyerNames = consult.lawyers.reduce((acc, curr) => {
										const lawyerName = this.props.lawyers.find(_lawyer => curr === _lawyer.id);
										// if someone was added for the lawyer who isn't really a lawyer
										// lawyerName cannot be found
										if (lawyerName) {
											acc.push(lawyerName.firstName + ' ' + lawyerName.lastName);
										}
										return acc;
									}, []);
									if (lawyerNames.length > 0) {
										lawyerInfo = `with ${lawyerNames.join(', ')}`

									}
								}
								return <li
									key={consult.id}
								>
									<Button
										onClick={() => this.showConsultModal(consult.id)}
										variant="link" size="sm">
										{consult.name} {lawyerInfo}
									</Button>
								</li>
							})}
						</ul>
					</ListGroup.Item>
				} else {
					return null;
				}
			}
		}

		// selected inquirer(s)
		let currentInquirerInfo = 'Loading...';
		if (this.props.currentInquirers.length > 0) {
			currentInquirerInfo = (
				this.props.currentInquirers.map(inq => {
					return (
						<div key={inq.id}>
							{/* inquirer name */}
							<Card.Footer><strong>Information for:</strong> {formatInquirerName(inq)}</Card.Footer>
							{/* inquirer info */}
							<ListGroup className="mb-3">
								{/* gender pronouns */}
								<ListGroup.Item variant="light"><strong>{peopleFields.PRONOUNS}:</strong> {inq.pronouns ? inq.pronouns[0] : 'no answer'}</ListGroup.Item>
								{/* income */}
								<ListGroup.Item variant="light"><strong>{peopleFields.INCOME}:</strong> {inq.income ? inq.income : 'no answer'}</ListGroup.Item>
								{/* intake notes */}
								<ListGroup.Item variant="light">
									<dl className="row mb-0">
										<dt className="col-sm-3">{peopleFields.INTAKE_NOTES}:</dt>
										<dd className="col-sm-9 mb-0">{inq.intakeNotes ? inq.intakeNotes : 'none'}</dd>
									</dl>
								</ListGroup.Item>
								{/* repeat visit */}
								{inq.repeatVisit === 'Yes' ? (
									<ListGroup.Item variant="light">
										<strong>Repeat Visit(s):</strong> Yes
									</ListGroup.Item>
								) : null}

								{/* consultations */}
								{renderPastConsults(inq.id)}

							</ListGroup>
						</div>
					)
				})
			)
		}

		// link to open modal to edit email
		let linkToEmailEditModal = null;
		if (this.state.inquirerIsSelected) {
			const firstCurrInquirer = this.props.currentInquirers[0];
			const firstCurrInqName = `${firstCurrInquirer.firstName} ${firstCurrInquirer.lastName}`;
			if (firstCurrInquirer.email) {
				let customEmailBtnLabel = `Add Custom Message to Email for ${firstCurrInqName}`;
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

		// success message
		let successMessage = null;
		let lastConsult = '';
		if (this.props.consultsCreated.length > 0) {
			lastConsult = this.props.consultsCreated[this.props.consultsCreated.length - 1][consultFields.NAME];
			if (this.state.submitSuccess) {
				successMessage = <Row>
					<Col xs={8} className="mx-auto w-50 p-3 text-center font-italic text-success"><span className="font-weight-bold">{lastConsult}</span> was successfully created!<br />
						Time spent: {this.state.timeSpent} minutes.</Col>
				</Row>;
			}
		}

		// error message
		let errorMessage = null;
		if (this.state.submitError) {
			errorMessage = <Row>
				<Col className="mx-auto w-50 p-3 text-center font-italic text-danger">More info needed.<br />
					Please fill out <span className="font-weight-bold">empty fields in red</span> above!</Col>
			</Row>;
		}

		let timerCounter = null;
		if (this.state.inquirers.length > 0) {
			timerCounter = <TimerCounter getTimeSpent={this.getTimeSpent} />
		}

		return (
			<>
				<h1 className="h2"><em>{this.props.clinicTitle}</em> Consultation</h1>
				<div className="mb-3 small">
					Please insert the information you collected for each visitor that you spoke to. Give a summary of the visitor's issue and indicate whether or not they need a referral.
				</div>
				<p className="text-danger small">*Required</p>
				<Form
					noValidate
					validated={this.state.validated}
					onSubmit={this.handleSubmit}
					ref={this.inquirerForm}
				>

					{/* lawyers */}
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
									<ReactSelectWithValidation
										options={lawyerSelectOptions}
										isMulti
										required
										value={this.state.lawyers}
										onChange={opt => this.handleLawyerSelectChange(opt)}
									/>
								</Col>
								<Col xs={2} className="justify-content-left">
									<Button onClick={() => this.showLawyerAddModal()} size="sm">+</Button>
								</Col>
							</Row>
							<div className="text-right text-muted">
								<small>If lawyer not on pulldown, click</small> <strong>+</strong> <small>above to add.</small>
							</div>
							<Form.Control.Feedback type="invalid">
								Please choose a visitor.
							</Form.Control.Feedback>
						</Col>
						{/* <Col sm={1}>

						</Col> */}
					</Form.Group>

					{/* inquirers */}
					<Form.Group as={Row} controlId="inquirerPulldown">
						<Form.Label column sm={3} className="text-md-right">
							Visitor(s)<span className="text-danger">*</span>
						</Form.Label>
						<Col sm={9}>
							<Form.Text className="text-muted">
								Choose visitor or multiple visitors if relevant. If the visitor does not appear, refresh the page.
							</Form.Text>
							<Row>
								<Col xs={10}>
									<ReactSelectWithValidation
										options={inqSelectOptions}
										isMulti
										required
										value={this.state.inquirers}
										onChange={opt => this.handleInquirerSelectChange(opt)}
									/>
								</Col>
								<Col xs={2} className="justify-content-left">
									<Button onClick={() => this.showVisitorAddModal()} size="sm">+</Button>
								</Col>
							</Row>
							<div className="text-right text-muted">
								<small>If visitor not in the system, click</small> <strong>+</strong> <small>above to add.</small>
							</div>
							<Form.Control.Feedback type="invalid">
								Please choose a visitor.
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Collapse in={this.state.inquirerIsSelected} className="mb-4">
						<div id="visitor-info" className="small">
							{currentInquirerInfo}
						</div>
					</Collapse>

					{/* inquirer's summary (notes) */}
					<Form.Group controlId="situation">
						<Form.Label className="bold mb-0">Notes</Form.Label>
						<Form.Text className="text-muted mt-0 mb-1">
							Please describe the factual situation as well as the legal assessment.
						</Form.Text>
						<Form.Control
							as="textarea"
							rows="5"
							value={this.state.situation}
							name="situation"
							onChange={this.handleInputChange}
						/>
					</Form.Group>

					{/* disposition */}
					<fieldset className="mb-2">
						<Form.Group as={Row}>
							<Form.Label as="legend" column sm={3} className="bold text-md-right">
								Disposition<span className="text-danger">*</span>
							</Form.Label>
							<Col sm={9}>
								<Form.Check
									type="radio"
									label={DISP_NO_FURTHER}
									value={DISP_NO_FURTHER}
									name="formDispositionRadios"
									required
									id="formDispositionNoFurther"
									ref={this.formDispositionNoFurther}
									onChange={evt => this.dispoRadioOnChange(evt)}
								/>
								<Form.Check
									type="radio"
									label={DISP_FEE_BASED}
									value={DISP_FEE_BASED}
									name="formDispositionRadios"
									id="formDispositionFeeBased"
									ref={this.formDispositionFeeBased}
									onChange={evt => this.dispoRadioOnChange(evt)}
								/>
								<Form.Check
									type="radio"
									label={DISP_PRO_BONO}
									value={DISP_PRO_BONO}
									name="formDispositionRadios"
									id="formDispositionProBono"
									ref={this.formDispositionProBono}
									onChange={evt => this.dispoRadioOnChange(evt)}
								/>
								<Form.Check
									type="radio"
									label={DISP_IMPACT}
									value={DISP_IMPACT}
									name="formDispositionRadios"
									id="formDispositionImpact"
									ref={this.formDispositionImpact}
									onChange={evt => this.dispoRadioOnChange(evt)}
								/>
							</Col>
						</Form.Group>
					</fieldset>
					<Collapse in={this.state.isReferralDispositionChecked}>
						<div id="referrals">
							<div className="mb-2"><em>If LRN or PBP is chosen above, please fill out the following for to allow for this case to be referred.</em></div>

							{/* type of law */}
							<Form.Group as={Row} controlId="typeOfLawPulldown">
								<Form.Label column sm={4} className="bold text-md-right">
									Type Of Law<span className="text-danger">*</span>
								</Form.Label>
								<Col sm={8}>
									<Form.Text className="text-muted">
										Choose any relevant types of law.
									</Form.Text>
									<ReactSelectWithValidation
										options={lawTypeOptions}
										isMulti
										required
										value={this.state.lawTypes}
										onChange={opt => this.handleTypeOfLawSelectChange(opt)}
									/>
									<Form.Control.Feedback type="invalid">
										Please the type of law.
									</Form.Control.Feedback>
								</Col>
							</Form.Group>

							{/* ref summary */}
							<Form.Group controlId="summary">
								<Form.Label className="bold mb-0">
									Referral Summary<span className="text-danger">*</span>
								</Form.Label>
								<Form.Text className="text-muted mt-0 mb-1">
									If LRN or PBP is chosen above, add a one- or two-sentence referral summary that can be used independently of the Notes above in order to make a referral to our network.<br /><br />
									Model: "Clinic visitor seeks attorney for representation in landlord-tenant matter.  Person is able to pay to retain a lawyer."
								</Form.Text>
								<Form.Control
									as="textarea"
									rows="3"
									value={this.state.refSummary}
									required={this.state.isReferralDispositionChecked}
									name="refSummary"
									onChange={this.handleInputChange}
								/>
							</Form.Group>
						</div>
					</Collapse>
					{linkToEmailEditModal}
					<Row className="justify-content-start">
						<Col>
							{/* submit */}
							<Button
								variant="primary"
								type="submit"
							>
								{this.state.submitButtonLabel}
							</Button>
						</Col>
					</Row>

				</Form>

				{/* confirmation & error messages */}
				{successMessage}
				{errorMessage}

				{/* modal to add lawyer */}
				<FormModal
					show={this.state.lawyerAddModalShown}
					onHide={this.hideLawyerAddModal}
					header="Add Lawyer"
					body={<LawyerAddForm
						onHide={this.hideLawyerAddModal}
					/>}
				/>

				{/* modal to add visitor */}
				<FormModal
					show={this.state.visitorAddModalShown}
					onHide={this.hideVisitorAddModal}
					header="Add a New Visitor"
					body={<VisitorAddForm
						onHide={this.hideVisitorAddModal}
					/>}
					size="lg"
				/>

				{/* previous consultation info */}
				<PrevConsultationModal
					show={this.state.consultModalShown}
					onHide={this.hideConsultModal}
					prevConsultSelected={this.state.prevConsultSelected}
					lawyers={this.props.lawyers}
					lawTypes={this.props.lawTypes}
					onClick={this.hideConsultModal}
				/>

				{/* edit email modal */}
				<EditEmailModal
					inquirerIsSelected={this.state.inquirerIsSelected}
					inquirers={this.props.currentInquirers}
					emailOptions={EMAIL_OPTIONS}
					emailMessageTemp={this.state.emailMessageTemp}
					emailBodyDefaultModified={this.state.emailBodyDefaultModified}
					editEmailBodyDefault={this.editEmailBodyDefault}
					emailBodyModifyConfirmed={this.state.emailBodyModifyConfirmed}
					cancelCustomEmailDefault={this.cancelCustomEmailDefault}
					show={this.state.emailEditModalShown}
					onChange={this.handleInputChange}
					onHide={this.cancelEditModal}
					cancelEditModal={this.cancelEditModal}
					saveEditModal={this.saveEditModal}
				/>

				{timerCounter}
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		lawyers: state.people.lawyers,
		inquirers: state.people.inquirers,
		currentInquirers: state.people.currentInquirers,
		currInqsPastConsults: state.consultations.currInqsPastConsults,
		lawTypes: state.lawTypes.lawTypes,
		consultSubmitStatus: state.consultations.consultSubmitStatus,
		consultsCreated: state.consultations.consultsCreated,
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setCurrentInquirers: inqs => dispatch(actions.setCurrentInquirers(inqs)),
		getCurrInqPastConsults: inqs => dispatch(actions.getCurrInqPastConsults(inqs)),
		createConsultation: consult => dispatch(actions.createConsultation(consult)),
		consultationInProgress: () => dispatch(actions.consultationInProgress()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InquirerForm);
