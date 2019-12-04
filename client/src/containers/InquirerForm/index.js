import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import ReactSelectWithValidation from '../../components/ReactSelectWithValidation';
import TimerCounter from '../../components/TimerCountdown/index';

import axios from 'axios';

import styles from './InquirerForm.module.css';

import * as peopleFields from '../../data/peopleFields';
import * as consultFields from '../../data/consultionFields';

const EMAIL_OPTIONS = {
	from: 'LeGaL <no-reply@le-gal.org>',
	// to: 'baltazarv@gmail.com',
	subject: 'Thank you for visiting the Tuesday Night Clinic of the LGBT Bar Association of Greater New York',
	defaultBody: 'Thank you for visiting the Tuesday Night Clinic of the LGBT Bar Association of Greater New York.  Please find below specific information, if any, provided to you by our volunteer lawyers.',
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
	[consultFields.EMAIL_TEXT_SENT]: EMAIL_OPTIONS.defaultBody,
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
			showConsultModal: false,
			emailEditModalShown: false,
			isReferralDispositionChecked: false,
			lawTypes: [],
			lawTypeIsSelected: false,
			refSummary: '',
			emailMessage: '',
			emailMessageTemp: '',
			submitFields: SUBMIT_FIELDS_DEFAULT, // AirTable format
			validated: false, // for use later
			submitSuccess: false,
			submitError: false,
			submitButtonLabel: 'Submit & Send Email to Visitor',
			timeSpent: 0,
		}
	}

	componentDidMount() {
		this.props.getLawyers();
		this.props.getInquirers();
		this.props.getLawTypes();
		this.setState({
			emailMessage: EMAIL_OPTIONS.defaultBody,
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

	getPrevConsultation(inqId, consultId) {
		const inquirer = this.props.currentInquirers.find(inq => {
			return inq.id === inqId;
		});
		return inquirer.consultationsExp.find(consult => {
			return consult.id === consultId;
		});
	}

	showConsultModal = (inqId, consultId) => {
		this.setState({
			prevConsultation: this.getPrevConsultation(inqId, consultId),
			showConsultModal: true,
		});
	}

	hideConsultModal = () => {
		this.setState({ showConsultModal: false });
	}

	showEmailEditModal = () => {
		this.setState(state => {
			return {
				emailMessageTemp: state.emailMessage,
				emailEditModalShown: true,
			}
		});
	}

	cancelEditModal = () => {
		this.setState({ emailEditModalShown: false });
	}

	saveEditModal = async () => {
		this.setState(state => {
			const submitFields = {...state.submitFields};
			submitFields[consultFields.EMAIL_TEXT_SENT] = state.emailMessageTemp;
			return {
				submitFields,
				emailMessage: state.emailMessageTemp,
				emailEditModalShown: false,
			}
		});
	}

	replaceWithPrevious = () => {
		const prevConsultation = this.state.prevConsultation;
		let consultLawyerSelectOptions = [];
		if (prevConsultation.lawyers && prevConsultation.lawyers.length > 0) {
			const prevConsultLawyers = prevConsultation.lawyers.map(id => {
				return this.props.lawyers.find(lawyer => {
					return lawyer.id === id;
				})
			})
			consultLawyerSelectOptions = this.getLawyerSelectOptions(prevConsultLawyers);
		}

		let consultInquirerSelectOptions = [];
		if (prevConsultation.inquirers && prevConsultation.inquirers.length > 0) {
			const prevConsultInquirer = prevConsultation.inquirers.map(id => {
				return this.props.inquirers.find(inquirer => {
					return inquirer.id === id;
				})
			})
			consultInquirerSelectOptions = this.getInquirerSelectOptions(prevConsultInquirer);
		}

		let consultLawTypeSelectOptions = [];
		if (prevConsultation.lawTypes && prevConsultation.lawTypes.length > 0) {
			const prevConsultLawTypes = prevConsultation.lawTypes.map(id => {
				return this.props.lawTypes.find(lawType => {
					return lawType.id === id;
				})
			})
			consultLawTypeSelectOptions = this.getLawTypeSelectOptions(prevConsultLawTypes);
		}

		this.setState({
			lawyers: consultLawyerSelectOptions,
			inquirers: consultInquirerSelectOptions,
			situation: prevConsultation.situation,
			lawTypes: consultLawTypeSelectOptions,
			refSummary: prevConsultation.summary,
		})
		this.clearDispoRadios();
		if (prevConsultation.dispositions && prevConsultation.dispositions.length > 0) {
			prevConsultation.dispositions.forEach(disp => {
				const formDispositionNoFurther = this.formDispositionNoFurther.current;
				if (disp === formDispositionNoFurther.value) {
					formDispositionNoFurther.checked = true;
				}
				const formDispositionFeeBased = this.formDispositionFeeBased.current;
				if (disp === formDispositionFeeBased.value) {
					formDispositionFeeBased.checked = true;
				}
				const formDispositionProBono = this.formDispositionProBono.current;
				if (disp === formDispositionProBono.value) {
					formDispositionProBono.checked = true;
				}
				const formDispositionImpact = this.formDispositionImpact.current;
				if (disp === formDispositionImpact.value) {
					formDispositionImpact.checked = true;
				}
			});
		}
	}

	formatName = inquirer => {
		const firstName = inquirer.firstName;
		const middleName = inquirer.middleName;
		const otherNames = inquirer.otherNames;
		const lastName = inquirer.lastName;
		return (firstName ? firstName : '') + (middleName ? ' ' + middleName : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' (' + otherNames + ')' : '')
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
		this.props.initCurrentInquirers(currentInquirers);
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
			this.props.createConsultation(this.state.submitFields);
			this.sendEmail(); // add error handling if email cannot be sent
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
		const options = {...EMAIL_OPTIONS};
		options['customText'] = this.state.emailMessage;
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
			emailMessage: EMAIL_OPTIONS.defaultBody,
		});
		this.props.setCurrentInquirers([]);
	}

	// format lawyers into select options: { label: "Alligators", value: 1 },
	getLawyerSelectOptions = (arr) => {
		return arr.reduce((acc, curr) => {
			if (curr.firstName || curr.lastName) {
				const inqObj = {
					value: curr.id,
					label: this.formatName(curr),
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
					label: this.formatName(curr),
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

		// selected inquirer(s)
		let currentInquirerInfo = 'Loading...';
		if (this.props.currentInquirers.length > 0) {
			currentInquirerInfo = (
				this.props.currentInquirers.map(inq => {
					return (
						<div key={inq.id}>
							{/* inquirer name */}
							<Card.Footer><strong>Information for:</strong> {this.formatName(inq)}</Card.Footer>
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
								{inq && inq.consultationsExp ? (
									<ListGroup.Item>
										<strong>Previous Consultations:</strong>
										<ul className="mb-0">
											{inq.consultationsExp.map(consult => {
												return <li
													key={consult.id}
												>
													<Button
														onClick={() => this.showConsultModal(inq.id, consult.id)}
														variant="link" size="sm">{consult.name}
													</Button>
												</li>
											})}
										</ul>
									</ListGroup.Item>
								) : null}
							</ListGroup>
						</div>
					)
				})
			)
		}

		// format modal window with previous consultation
		let currentConsultationName = '';
		let modalPrevConsultBody = null;
		const prevConsultation = this.state.prevConsultation;
		if (prevConsultation) {
			currentConsultationName = <h3>{prevConsultation.name}</h3>;
			let lawyers = [];
			if (prevConsultation.lawyers) {
				lawyers = prevConsultation.lawyers.map(consultLawyer => {
					const lawyer = this.props.lawyers.find(lawyer => {
						return lawyer.id === consultLawyer;
					})
					return this.formatName(lawyer);
				})
			}
			let lawTypes = [];
			if (prevConsultation.lawTypes) {
				lawTypes = prevConsultation.lawTypes.map(consultType => {
					const lawType = this.props.lawTypes.find(type => {
						return type.id === consultType;
					})
					return lawType.type;
				})
			}
			modalPrevConsultBody = (
				<ul>
					<li><strong>Consulting Lawyer:</strong> {lawyers && lawyers.length > 0 ? (lawyers.join(', ')) : ''}</li>

					<li><strong>Notes: </strong>{prevConsultation.situation}</li>

					<li><strong>Disposition: </strong>{prevConsultation.dispositions && prevConsultation.dispositions.length > 0 ? (prevConsultation.dispositions.join(', ')) : ''}</li>

					<li><strong>Type of Law: </strong>{lawTypes.join(', ')}</li>

					<li><strong>Referral Summary: </strong>{prevConsultation.summary}</li>
				</ul>
			)
		}

		// edit visitor email modal
		let linkToEmailEditModal = null;
		let emailEditModalTitle = null;
		let emailEditModalHead = null;
		let emailEditModalBody = null;
		if (this.state.inquirerIsSelected) {
			const firstCurrInquirer = this.props.currentInquirers[0];
			const firstCurrInqName = `${firstCurrInquirer.firstName} ${firstCurrInquirer.lastName}`;
			if (firstCurrInquirer.email) {

				linkToEmailEditModal = <Row>
					<Col>
					<Button
						onClick={() => this.showEmailEditModal()}
						variant="link" size="md" className="mb-3">
							Add Custom Message to Email for {firstCurrInqName}
					</Button>
					</Col>
				</Row>;

				emailEditModalTitle = `Edit Email for ${firstCurrInqName}`;

				emailEditModalHead = <div className="text-muted small">
					<span className="font-weight-bold">from:</span> {EMAIL_OPTIONS.from}<br />
					<span className="font-weight-bold">to:</span> {firstCurrInquirer.email}<br />
					<span className="font-weight-bold">subject:</span> {EMAIL_OPTIONS.subject}<br/><br />
					<span className="font-weight-bold">body:</span> {EMAIL_OPTIONS.message}
				</div>

				emailEditModalBody = <div>
					{/* custom email message */}
					<Form.Group controlId="emailMessageTemp">
						<Form.Control
							style={{fontSize: '0.8em'}}
							as="textarea"
							rows="7"
							value={this.state.emailMessageTemp}
							name="emailMessageTemp"
							onChange={this.handleInputChange}
							/>
					</Form.Group>
				</div>
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
				<Container>
					<Card className={styles.cardContainer}>
						<Card.Header></Card.Header>
						<Card.Body>
							<Form
								noValidate
								validated={this.state.validated}
								onSubmit={this.handleSubmit}
								ref={this.inquirerForm}
							>
								<h1 className="h1">Clinic Consultation</h1>
								<div className="mb-3 small">
									Please insert the information you collected for each client that you spoke to. Give a summary of the client's issue and indicate whether or not they need a referral.
								</div>
								<p className="text-danger small">*Required</p>

								{/* lawyers */}
								<Form.Group as={Row} controlId="inquirerPulldown">
									<Form.Label column sm={3} className="text-md-right">
										Lawyer(s)<span className="text-danger">*</span>
									</Form.Label>
									<Col sm={9}>
										<Form.Text className="text-muted">
											Add your name.
										</Form.Text>
										<ReactSelectWithValidation
											options={lawyerSelectOptions}
											isMulti
											required
											value={this.state.lawyers}
											onChange={opt => this.handleLawyerSelectChange(opt)}
										/>
										<Form.Control.Feedback type="invalid">
											Please choose a visitor.
										</Form.Control.Feedback>
									</Col>
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
										<ReactSelectWithValidation
											options={inqSelectOptions}
											isMulti
											required
											value={this.state.inquirers}
											onChange={opt => this.handleInquirerSelectChange(opt)}
										/>
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
								<Form.Group controlId="notes">
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
										<Form.Group controlId="notes">
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
						</Card.Body>
					</Card>
				</Container>

				{/* previous consultation info */}
				<Modal
					show={this.state.showConsultModal}
					onHide={this.hideConsultModal}
					size="md"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Previous Consultation
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{currentConsultationName}
						{modalPrevConsultBody}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.hideConsultModal}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/* edit email modal */}
				<Modal
					show={this.state.emailEditModalShown}
					onHide={this.cancelEditModal}
					size="md"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{emailEditModalTitle}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{emailEditModalHead}
						{emailEditModalBody}
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.cancelEditModal}>Cancel</Button>
						<Button onClick={this.saveEditModal}>Save</Button>
					</Modal.Footer>
				</Modal>

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
		lawTypes: state.lawTypes.lawTypes,
		consultSubmitStatus: state.consultations.consultSubmitStatus,
		consultsCreated: state.consultations.consultsCreated
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getLawyers: () => dispatch(actions.getLawyers()),
		getInquirers: () => dispatch(actions.getInquirers()),
		initCurrentInquirers: inqs => dispatch(actions.initCurrentInquirers(inqs)),
		setCurrentInquirers: inqs => dispatch(actions.setCurrentInquirers(inqs)), // called when clearing form
		getLawTypes: () => dispatch(actions.getLawTypes()),
		createConsultation: consult => dispatch(actions.createConsultation(consult)),
		consultationInProgress: () => dispatch(actions.consultationInProgress()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InquirerForm);
