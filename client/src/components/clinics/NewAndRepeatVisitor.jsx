/** Contains:
 *  * is repeat visitor switch field
 *  * dynamic repeat instructions
 *  * For new visitors...
 *    * new visitor form – imported VisitorAddForm
 *  * For repeat visitors...
 *    * repeat visitor select – const SelectVisitor
 *    * new visitor form – imported VisitorAddForm
 * */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Card } from 'react-bootstrap';
import VisitorSelect from './intakeForm/VisitorSelect';
import VisitorAddForm from './VisitorAddForm';
import PreviousConsultations from './intakeForm/PreviousConsultations';
// data
import * as peopleFields from '../../data/peopleFields';
import { getOptionsForPeople, formatName } from '../../data/peopleData';
import * as actions from '../../store/actions';

const NewAndRepeatVisitor = (props) => {
	// from parent
	const {
		clinic,
	} = props;

	// shows or hides repeatVisitorSelect
	const [isRepeat, setIsRepeat] = useState(false);
	// select pulldown format
	const [repeatVisitorId, setRepeatVisitorId] = useState('');
	// set to true to show success message when visitor is submitted
	const [visitorWasUpdated, setVisitorWasUpdated] = useState(false);
	// prop sent to VisitorAddForm & arg sent to visitorUpdatedMessage
	const [serverResponse, setServerResponse] = useState({});


	const handleRepeatSwitch = () => {
		setVisitorWasUpdated(false);
		setIsRepeat(!isRepeat);
	}

	const handleVisitorSelect = selection => {
		setRepeatVisitorId(selection);
	}

	const submitCreateInquirer = async (values, resetForm) => {
		let payload = { ...values };
		const serverResponse = await props.createInquirer(payload);
		setServerResponse(serverResponse);
		if (serverResponse.status === 'success' && serverResponse.type === 'createInquirer') {
			resetForm();
		}
	}

	const submitUpdateInquirer = async (values) => {
		let payload = { ...values };
		const serverResponse = await props.updateInquirer(payload);
		setServerResponse(serverResponse);
		if (serverResponse.status === 'success') {
			// unload VisitorAddForm and reload switch Select
			setVisitorWasUpdated(true);
			repeatVisitorId('')
		}
	}

	const getRepeatVisitor = () => {
		return props.inquirersObject[repeatVisitorId];
	}

	const repeatInstructions = () => {
		const style = "mb-3 small";
		if (isRepeat) {
			return <Col className={style}>&nbsp;<strong>Yes &mdash; </strong> Find visitor from pulldown to verify and update info:</Col>
		}
		return <Col className={style}>&nbsp;<strong>No &mdash; </strong> Enter new visitor:</Col>
	};

	const renderRepeatVisitorSelect = () => {
		return (
			<>
				<div className="mb-3">
					<Card>
						<Card.Body>
							<VisitorSelect
								name="visitor"
								label="Repeat Visitor"
								options={getOptionsForPeople(props.inquirersObject)}
								// defaultValue={null}
								value={repeatVisitorId}
								onChange={handleVisitorSelect}
								required={true}
								isDisabled={!repeatVisitorId}
							/>
						</Card.Body>
					</Card>
				</div>
			</>
		)
	}

	const renderPreviousConsultations = () => {
		const consultIds = props.inquirersObject[repeatVisitorId][peopleFields.CONSULTATIONS];
		if (consultIds) {
			const visitorConsultations = consultIds.map(id => {
				return {
					key: id,
					...props.consultations[id],
				}
			});
			return <PreviousConsultations
				selectedConsultations={visitorConsultations}
				inquirers={props.inquirersObject}
				consultations={props.consultations}
				updateConsultation={props.updateConsultation}
				lawyers={props.lawyersObject}
				lawTypes={props.lawTypesObject}
			/>
		} else {
			return <Card className="mb-3 text-center">
				<Card.Body>
					<span className="text-muted">No consultations have been saved for the visitor.</span>
				</Card.Body>
			</Card>
				;
		}
	}

	const visitorUpdatedMessage = serverResponse => {
		const visitor = serverResponse.payload[0].fields;
		return (
			<Row>
				<Col xs={8} className="mx-auto w-50 pb-3 text-center font-italic text-success">The record for <span className="font-weight-bold">{formatName(visitor)}</span> was&nbsp;updated!</Col>
			</Row>
		)
	}

	return (
		<>
			{/* is repeat visitor Form.Check switch */}
			<Row>
				<Col>
					<Form.Group className="mb-2">
						<Form.Label className="mb-0">Has visitor been to the clinic before?&nbsp;&nbsp;</Form.Label>
						<span className="ml-2">
							No&nbsp;&nbsp;<Form.Check
								type="switch"
								id="custom-switch"
								aria-label="repeat"
								label="Yes"
								inline={true}
								onChange={handleRepeatSwitch}
							/>
						</span>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				{repeatInstructions()}
			</Row>

			{/* new visitor */}
			{!isRepeat &&
				<VisitorAddForm
					clinic={clinic}
					lawTypes={props.lawTypes}
					submitForm={submitCreateInquirer}
					serverResponse={serverResponse}
				/>
			}

			{/* repeat visitor */}
			{isRepeat &&
				renderRepeatVisitorSelect()
			}

			{/* repeat visitor selected for editing */}
			{isRepeat && repeatVisitorId &&
				(
					<>
						{renderPreviousConsultations()}
						<VisitorAddForm
							clinic={clinic}
							lawTypes={props.lawTypes}
							submitForm={submitUpdateInquirer}
							serverResponse={serverResponse}
							repeatVisitor={getRepeatVisitor()}
						/>
					</>
				)
			}

			{/* repeat visitor edits submitted: success message */}
			{isRepeat && visitorWasUpdated &&
				visitorUpdatedMessage(serverResponse)
			}
		</>
	)
}

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirers,
		inquirersObject: state.people.inquirersObject,
		consultations: state.consultations.consultations,
		lawyersObject: state.people.lawyersObject,
		lawTypes: state.lawTypes.lawTypes, // for <VisitorAddForm />
		lawTypesObject: state.lawTypes.lawTypesObject,
	}
}
const mapDispatchToProps = dispatch => {
	return {
		// call from parent Clinics?
		createInquirer: inq => dispatch(actions.createInquirer(inq)),
		updateInquirer: inqValues => dispatch(actions.updateInquirer(inqValues)),
		updateConsultation: updateObject => dispatch(actions.updateConsultation(updateObject)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAndRepeatVisitor);
