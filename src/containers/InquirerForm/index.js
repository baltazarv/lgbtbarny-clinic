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
// https://alligator.io/react/react-select/
import Select from 'react-select';
// import InputGroup from 'react-bootstrap/InputGroup'
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import styles from './InquirerForm.module.css';

import * as peopleFields from '../../data/peopleFields';
import * as consultFields from '../../data/consultionFields';

const DISP_NO_FURTHER = 'No further action required or available. Info/counsel provided.';
const DISP_FEE_BASED = 'Fee-based - Lawyer Referral Network (LRN) - limited availability';
const DISP_PRO_BONO = 'Pro Bono Panel (PBP) - VERY limited availability!';
const DISP_IMPACT = 'Highly compelling/impact litigation';
const TYPE_CLINIC = 'Clinic';
const SUBMIT_FIELDS_DEFAULT = {
	[consultFields.TYPE]: TYPE_CLINIC,
	[consultFields.DATE]: new Date().toISOString().substr(0, 10)
};

const ConsultationsPreviousModal = props => {
	return (
		<Modal
			{...props}
			size={props.size}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{props.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>{props.heading}</h4>
				<p>
					{props.body}
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>{props.buttonsecondlabel}</Button>
				<Button onClick={props.onHide}>{props.buttoncloselabel}</Button>
			</Modal.Footer>
		</Modal>
	);
}

class InquirerForm extends Component {

	constructor(props) {
		super(props);
		this.inquirerForm = React.createRef();
		this.formDispositionNoFurther = React.createRef();
		this.formDispositionFeeBased = React.createRef();
		this.formDispositionProBono = React.createRef();
		this.formDispositionImpact = React.createRef();
		this.state = {
			isInquirerInfoOpen: false,
			formDispositionNoFurther: false,
			isReferralDispositionChecked: false,
			formDispositionProBono: false,
			formDispositionImpact: false,
			showConsultModal: false,

			lawyers: [],
			inquirers: [],
			situation: '',
			// dispositions: [],
			refSummary: '',
			lawTypes: [],
			submitFields: SUBMIT_FIELDS_DEFAULT,
			validated: false, // for use later

			submitButtonLabel: 'Submit',
		}
	}

	componentDidMount() {
		this.props.getLawyers();
		this.props.getInquirers();
		this.props.getLawTypes();
	}

	componentDidUpdate(prevProps) {
		if (this.props.consultSubmitStatus.status === 'success') {
			this.clearForm();
			this.props.consultationInProgress();
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.currentInquirers.length > 0) {
			return {
				isInquirerInfoOpen: true
			}
		} else {
			return {
				isInquirerInfoOpen: false
			}
		}
	}

	showConsultModal = () => {
		this.setState({ showConsultModal: true });
	}

	hideConsultModal = () => {
		this.setState({ showConsultModal: false });
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
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.LAWYERS] = lawyers;
			return {
				submitFields,
				lawyers: opt,
			};
		});
	}

	handleInquirerSelectChange = options => {
		// add inquirers to submitFields state object
		const inquirers = options.reduce((acc, curr) => {
			acc.push(curr.value);
			return acc;
		}, []);
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.INQUIRERS] = inquirers;
			return {
				submitFields,
				inquirers: options
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
			default:
		}

		this.setState((prevState, props) => {
			return {
				submitFields,
				[name]: value
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
			// const id = evt.target.id;
			this.setState((prevState, props) => {
				let submitFields = { ...prevState.submitFields };
				submitFields[consultFields.DISPOSITIONS] = [value];
				return {
					submitFields,
				};
			});
		};
	}

	handleTypeOfLawSelectChange = opt => {
		const lawTypes = opt.reduce((acc, curr) => {
			acc.push(curr.value);
			return acc;
		}, []);
		this.setState((prevState, props) => {
			let submitFields = { ...prevState.submitFields };
			submitFields[consultFields.LAW_TYPES] = lawTypes;
			return {
				submitFields,
				lawTypes: opt,
			};
		});
	}

	handleSubmit = evt => {
		evt.preventDefault();
		evt.stopPropagation();
		const form = evt.currentTarget;
		if (form.checkValidity() === true) {
			this.props.createConsultation(this.state.submitFields);
			// form.reset();
		}
		this.setState({ validated: true });
	}

	clearForm = () => {
		this.inquirerForm.current.reset(); // doesn't reset radio checked values
		this.formDispositionNoFurther.current.checked = false;
		this.formDispositionFeeBased.current.checked = false;
		this.formDispositionProBono.current.checked = false;
		this.formDispositionImpact.current.checked = false;
		this.setState({
			lawyers: [],
			inquirers: [],
			situation: '',
			dispositions: [],
			refSummary: '',
			lawTypes: [],
			submitFields: SUBMIT_FIELDS_DEFAULT,
			submitButtonLabel: 'Submit Another',
			validated: false,
			isReferralDispositionChecked: false,
		});
		this.props.setCurrentInquirers([]);
	}

	render() {
		console.log('state', this.state, 'consultSubmitStatus');

		// format inquirers into select options
		let inqSelectOptions = this.props.inquirers.reduce((acc, curr) => {
			// { label: "Alligators", value: 1 },
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

		// format lawyers into select options: { label: "Alligators", value: 1 },
		let lawyerSelectOptions = this.props.lawyers.reduce((acc, curr) => {
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

		// format type of law state into select options
		let lawTypeOptions = this.props.lawTypes.reduce((acc, curr) => {
			return [...acc, { value: curr.id, label: curr.type }]
		}, []);

		// selected inquirer(s)
		let currentInquirerInfo = 'Loading...';
		if (this.props.currentInquirers) {
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
								{inq.consultationsExp ? (
									<ListGroup.Item>
										<strong>Previous Consultations:</strong>
										<ul className="mb-0">
											{inq.consultationsExp.map(consult => {
												return <li key={consult.id}><Button onClick={this.showConsultModal} variant="link" size="sm">{consult.name}</Button></li>
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
										<Select
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
											Choose visitor or multiple visitors if relevant.
										</Form.Text>
										<Select
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
								<Collapse in={this.state.isInquirerInfoOpen} className="mb-4">
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
								<fieldset className="mb-4">
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
												<Select
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
												name="refSummary"
												onChange={this.handleInputChange}
											/>
										</Form.Group>
									</div>
								</Collapse>

								{/* submit */}
								<Button
									variant="primary"
									type="submit"
								>
									{this.state.submitButtonLabel}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Container>
				<ConsultationsPreviousModal
					size="md"
					show={this.state.showConsultModal}
					onHide={() => this.hideConsultModal()}
					title="Previous Consultation"
					heading="Inquirer – Date"
					body="Coming soon."
					buttonsecondlabel="Edit &amp; Replace Current"
					buttoncloselabel="Close"
				/>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		lawyers: state.people.lawyers,
		inquirers: state.people.inquirers,
		currentInquirers: state.people.currentInquirers,
		// consultation: state.consultations.consultations,
		lawTypes: state.lawTypes.lawTypes,
		consultSubmitStatus: state.consultations.consultSubmitStatus
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
