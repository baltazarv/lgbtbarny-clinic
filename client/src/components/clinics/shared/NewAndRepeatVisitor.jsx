/** 
 * Intake component that switches between new contact form or a select field to choose repeat visitor/contact
 * 
 * NewAndRepeatVisitor
 *  |_ VisitorSelect
 *  |_ PreviousConsultations
 *  |_ ClinicAddVisitor (clinic) or HelplineAddInquirer (hotline)
 * */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Row, Col, Card } from 'react-bootstrap'
import VisitorSelect from '../intake/VisitorSelect';
import PreviousConsultations from './PreviousConsultations'
import PreviousInquiries from '../intake/PreviousInquiries'
import ClinicAddVisitor from '../intake/ClinicAddVisitor'
import HelplineAddInquirer from '../intake/HelplineAddInquirer'
// data
import * as peopleFields from '../../../data/peopleFields'
import * as consultFields from '../../../data/consultFields'
import { getOptionsForPeople, formatName } from '../../../data/peopleData';
import {
	getInquirers,
	createInquirer,
	updateInquirer,
} from '../../../store/actions';

const NewAndRepeatVisitor = ({
	// from parent
	clinic,
	isHotline,
	onSubmit,
}) => {
	const dispatch = useDispatch()
	// redux reducers
	const lawTypesObject = useSelector((state) => state.lawTypes.lawTypesObject)
	const inquirersObject = useSelector((state) => state.people.inquirersObject)
	const consultations = useSelector((state) => state.consultations.consultations)

	// shows or hides repeatVisitorSelect
	const [isRepeat, setIsRepeat] = useState(false);
	const [repeatVisitorId, setRepeatVisitorId] = useState('');
	const [serverResponse, setServerResponse] = useState({ status: 'pending' });
	const [repeatSelectIsRefreshing, setRepeatSelectIsRefreshing] = useState(false);
	const [repeatSelectPlaceholder, setRepeatSelectPlaceholder] = useState('Select...');

	useEffect(() => {
		if (isRepeat) setRepeatVisitorId('')
	}, [isRepeat])

	const submitCreateInquirer = async (values, resetForm) => {
		let payload = { ...values };
		const _serverResponse = await dispatch(createInquirer(payload));
		setServerResponse(_serverResponse);
		if (_serverResponse.status === 'success' && (_serverResponse.type === 'createInquirer')) {
			resetForm();
			if (onSubmit) onSubmit(_serverResponse.payload);
		}
	}

	const submitUpdateInquirer = async (values) => {
		let payload = { ...values };
		const _serverResponse = await dispatch(updateInquirer(payload))
		setServerResponse(_serverResponse);
		if (_serverResponse.status === 'success' && _serverResponse.type === 'updateInquirer') {
			setRepeatVisitorId('');
		}
	}

	const handleRefresh = async () => {
		setRepeatVisitorId('');
		setRepeatSelectIsRefreshing(true);
		setRepeatSelectPlaceholder('Loading...');
		await dispatch(getInquirers()) // refresh
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

	// if create or delete table rows, cannot rely on getRepeatVisitor(), which accesses inquirers reducer, b/c inquirers not updated when create or delete previous consultations
	const renderPreviousConsultations = () => {
		const consultIds = getRepeatVisitor()?.[peopleFields.CONSULTATIONS]
		if (consultIds?.length > 0) {
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
			if (visitorConsultations?.length > 0) {
				return <PreviousConsultations
					visitorConsultations={visitorConsultations}
				/>
			}
		}
		return <Card className="mb-3 text-center">
			<Card.Body>
				<span className="text-muted">There are no <strong>consultations</strong> for {formatName(getRepeatVisitor())}.</span>
			</Card.Body>
		</Card>
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
									<PreviousInquiries
										inquirer={getRepeatVisitor()}
									/>
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

export default NewAndRepeatVisitor
