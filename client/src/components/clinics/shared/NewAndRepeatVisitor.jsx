// TODO: move to /intake/
// TODO: move to Intake?

/** 
 * Intake component that switches between new contact form or a select field to choose repeat visitor/contact
 * 
 * NewAndRepeatVisitor
 *  |_ VisitorSelect
 *  |_ PreviousConsultations
 *  |_ ClinicAddVisitor (clinic) or HelplineAddInquirer (hotline)
 * */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Card } from 'react-bootstrap';
import VisitorSelect from '../intake/VisitorSelect';
import PreviousConsultations from './PreviousConsultations'
import PreviousInquiries from '../intake/PreviousInquiries'
import ClinicAddVisitor from '../intake/ClinicAddVisitor'
import HelplineAddInquirer from '../intake/HelplineAddInquirer'
// data
import * as peopleFields from '../../../data/peopleFields'
import * as consultFields from '../../../data/consultFields'
import { getOptionsForPeople, formatName } from '../../../data/peopleData';
import * as actions from '../../../store/actions';

const NewAndRepeatVisitor = ({
	// from parent
	clinic,
	isHotline,

	// passed from redux:
	createInquirer,
	updateInquirer,
	updateConsultation,
	refreshInquirers,
	lawyersObject,
	lawTypesObject,

	// passed from context?
	inquirersObject,
	consultations,
	onSubmit,
}) => {

	// shows or hides repeatVisitorSelect
	const [isRepeat, setIsRepeat] = useState(false);
	const [repeatVisitorId, setRepeatVisitorId] = useState('');
	const [serverResponse, setServerResponse] = useState({ status: 'pending' });
	const [repeatSelectIsRefreshing, setRepeatSelectIsRefreshing] = useState(false);
	const [repeatSelectPlaceholder, setRepeatSelectPlaceholder] = useState('Select...');

	// default checked at init
	// TODO: check if works
	// useEffect(() => {
	// 	setIsRepeat(isHotline)
	// }, [])


	useEffect(() => {
		if (isRepeat) setRepeatVisitorId('')
	}, [isRepeat])

	const submitCreateInquirer = async (values, resetForm) => {
		let payload = { ...values };
		const _serverResponse = await createInquirer(payload);
		setServerResponse(_serverResponse);
		if (_serverResponse.status === 'success' && (_serverResponse.type === 'createInquirer')) {
			resetForm();
			if (onSubmit) onSubmit(_serverResponse.payload);
		}
	}

	const submitUpdateInquirer = async (values) => {
		let payload = { ...values };
		const _serverResponse = await updateInquirer(payload);
		setServerResponse(_serverResponse);
		if (_serverResponse.status === 'success' && _serverResponse.type === 'updateInquirer') {
			setRepeatVisitorId('');
		}
	}

	const handleRefresh = async () => {
		setRepeatVisitorId('');
		setRepeatSelectIsRefreshing(true);
		setRepeatSelectPlaceholder('Loading...');
		await refreshInquirers();
		setRepeatSelectIsRefreshing(false);
		setRepeatSelectPlaceholder('Select...');
	}

	const getRepeatVisitor = () => {
		return inquirersObject[repeatVisitorId]
	}

	/** RENDER FUNCTIONS */

	const renderSuccessMessage = () => {
		let renderMessage = null;
		if (serverResponse && serverResponse.status === 'success' && (serverResponse.type === 'createInquirer' || serverResponse.type === 'updateInquirer')) {
			const name = formatName(serverResponse.payload);
			renderMessage = <Row>
				<Col xs={8} className="mx-auto w-50 pt-3 pb-0 text-center font-italic text-success"><span className="font-weight-bold">{name}</span> was {serverResponse.type === 'createInquirer' ? 'added' : 'updated'}!</Col>
			</Row>;
		}
		return renderMessage;
	}

	const renderRepeatVisitorSelect = () => {
		return (
			<>
				<div className="mb-3">
					<Card>
						<Card.Body>
							<VisitorSelect
								name="visitor"
								label="Repeat Visitor"
								options={getOptionsForPeople(inquirersObject)}
								value={repeatVisitorId}
								onChange={(val) => setRepeatVisitorId(val)}
								required={true}
								isDisabled={!repeatVisitorId}
								onRefresh={handleRefresh}
								placeholder={repeatSelectPlaceholder}
								loading={repeatSelectIsRefreshing}
							/>
						</Card.Body>
					</Card>
				</div>
			</>
		)
	}

	const renderPrevInquiries = () => {
		const consultIds = getRepeatVisitor()[peopleFields.CONSULTATIONS]
		const inquiries = consultIds.reduce((acc, id) => {
			const consultation = consultations[id]
			if (consultation?.[consultFields.TYPE] !== consultFields.TYPE_CLINIC) {
				acc.push({
					key: id,
					...consultation,
				})
			}
			return acc
		}, [])
		if (inquiries?.length > 0) {
			return <PreviousInquiries
				inquiries={inquiries}
				inquirers={inquirersObject}
				consultations={consultations}
				updateConsultation={updateConsultation}
				lawyers={lawyersObject}
				lawTypes={lawTypesObject}
			/>
		} else {
			return <Card className="mb-3 text-center">
				<Card.Body>
					<span className="text-muted">No contacts from the inquirer have been saved.</span>
				</Card.Body>
			</Card>
		}
	}

	const renderPreviousConsultations = () => {
		const consultIds = getRepeatVisitor()[peopleFields.CONSULTATIONS]
		const visitorConsultations = consultIds.reduce((acc, id) => {
			const consultation = consultations[id]
			if (consultation?.[consultFields.TYPE] === consultFields.TYPE_CLINIC) {
				acc.push({
					key: id,
					...consultation,
				})
			}
			return acc
		}, [])
		if (visitorConsultations) {
			return <PreviousConsultations
				visitorConsultations={visitorConsultations}
				consultations={consultations}
				updateConsultation={updateConsultation}
				lawyers={lawyersObject}
				lawTypes={lawTypesObject}
			/>
		} else {
			return <Card className="mb-3 text-center">
				<Card.Body>
					<span className="text-muted">No consultations have been saved for the visitor.</span>
				</Card.Body>
			</Card>
		}
	}

	return (
		<>
			{/* is repeat visitor Form.Check switch */}
			<Row>
				<Col>
					<Form.Group className="mb-1">
						<Form.Label className="mb-0">{isHotline ? 'Look for already-processed contact?' : 'Has visitor been to the clinic before?'}&nbsp;&nbsp;</Form.Label>
						<span className="ml-2">
							No&nbsp;&nbsp;
							<Form.Check
								type="switch"
								id="custom-switch"
								aria-label="repeat"
								label="Yes"
								inline={true}
								onChange={(evt) => setIsRepeat(evt.target.checked)}
								checked={isRepeat}
							// defaultChecked={true}
							/>
						</span>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				{isRepeat ?
					<Col className="mb-3 small">&nbsp;<strong>Yes &mdash; </strong> {isHotline ? 'Look for person by name, email, or phone number:' : 'Find visitor from pulldown to verify and update info:'}</Col> :
					<Col className="mb-3 small">&nbsp;<strong>No &mdash; </strong> {isHotline ? 'Enter new potential clinic visitor:' : 'Enter new visitor:'}</Col>}
			</Row>

			<Card>
				<Card.Body>
					{isRepeat && // switch to contact exists
						<>
							{renderRepeatVisitorSelect()}
							{repeatVisitorId &&
								<>
									{renderPrevInquiries()}
									{renderPreviousConsultations()}
								</>
							}
						</>
					}

					{(
						(isRepeat && repeatVisitorId) || // person selected
						!isRepeat // new form
					) &&
						(
							isHotline ?
								<HelplineAddInquirer
									lawTypesObject={lawTypesObject}
									submitForm={!isRepeat ? submitCreateInquirer : submitUpdateInquirer}
									serverResponse={serverResponse}
									repeatVisitor={isRepeat && repeatVisitorId ? getRepeatVisitor(serverResponse) : null}
								/> :
								<ClinicAddVisitor
									// clinic is added when clinic visit
									clinic={isRepeat && repeatVisitorId ? clinic : null}
									lawTypesObject={lawTypesObject}
									submitForm={!isRepeat ? submitCreateInquirer : submitUpdateInquirer}
									serverResponse={serverResponse}
									repeatVisitor={isRepeat && repeatVisitorId ? getRepeatVisitor(serverResponse) : null}
								/>
						)
					}

					{/* success message */}
					{renderSuccessMessage()}

				</Card.Body>
			</Card>
		</>
	)
}

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirers,
		inquirersObject: state.people.inquirersObject,
		consultations: state.consultations.consultations,
		lawyersObject: state.people.lawyersObject,
		lawTypes: state.lawTypes.lawTypes,
		lawTypesObject: state.lawTypes.lawTypesObject,
	}
}
const mapDispatchToProps = dispatch => {
	return {
		// call from parent Clinics?
		createInquirer: inq => dispatch(actions.createInquirer(inq)),
		updateInquirer: inqValues => dispatch(actions.updateInquirer(inqValues)),
		updateConsultation: updateObject => dispatch(actions.updateConsultation(updateObject)),
		refreshInquirers: () => dispatch(actions.getInquirers()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAndRepeatVisitor);
