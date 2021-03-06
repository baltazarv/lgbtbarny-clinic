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
// components
import VisitorSelect from '../../../components/forms/fields/VisitorSelect';
import VisitorAddForm from '../../../components/forms/VisitorAddForm';
// data
import { getRecordsFromSelection, formatName, getPeopleIntoSelectOptions } from '../../../data/dataTransforms';
import * as actions from '../../../store/actions/index';

const Intake = props => {
	const { clinicTitle } = props;
	// shows or hides repeatVisitorSelect
	const [isRepeat, setIsRepeat] = useState(false);
	// select pulldown format
	const [repeatVisitorSelected, setRepeatVisitorSelected] = useState(null);
	// set to true to show success message when visitor is submitted
	const [visitorWasUpdated, setVisitorWasUpdated] = useState(false);
	// prop sent to VisitorAddForm & arg sent to visitorUpdatedMessage
	const [serverResponse, setServerResponse] = useState({});

	const handleRepeatSwitch = () => {
		setVisitorWasUpdated(false);
		setIsRepeat(!isRepeat);
	}

	const handleVisitorSelect = selection => {
		setRepeatVisitorSelected(selection);
	}

	// console.log('repeatVisitorSelected', repeatVisitorSelected);

	const submitCreateInquirer = async (values, resetForm) => {
		const serverResponse = await props.createInquirer(values);
		setServerResponse(serverResponse);
		if (serverResponse.status === 'success' && serverResponse.type === 'createInquirer') {
			resetForm();
		}
	}

	const submitUpdateInquirer = async (values) => {
		const serverResponse = await props.updateInquirer(values);
		setServerResponse(serverResponse);
		if (serverResponse.status === 'success') {
			// unload VisitorAddForm and reload switch Select
			setVisitorWasUpdated(true);
			setRepeatVisitorSelected(null)
		}
	}

	// components

	const repeatInstructions = () => {
		const style = "mb-3 small";
		if (isRepeat) {
			return <Col className={style}>&nbsp;<strong>Yes &mdash; </strong> Find visitor from pulldown to verify and update info:</Col>
		}
		return <Col className={style}>&nbsp;<strong>No &mdash; </strong> Enter new visitor:</Col>
	};

	const repeatVisitorSelect = () => {
		return (
			<div className="mb-3">
				<Card className={cardStyle}>
					<Card.Body>
						<VisitorSelect
							name="visitor"
							options={getPeopleIntoSelectOptions(props.inquirers)}
							defaultValue={null}
							value={repeatVisitorSelected}
							onChange={handleVisitorSelect}
							label="Repeat Visitor"
							isDisabled={repeatVisitorSelected}
							required={true}
						/>
					</Card.Body>
				</Card>
			</div>
		)
	}

	const visitorUpdatedMessage = serverResponse => {
		const visitor = serverResponse.payload[0].fields;
		return (
			<Row>
				<Col xs={8} className="mx-auto w-50 pb-3 text-center font-italic text-success">The record for <span className="font-weight-bold">{formatName(visitor)}</span> was&nbsp;updated!</Col>
			</Row>
		)
	}

	// styles

	// TO-DO: add to global style sheet
	const cardStyle = {
		backgroundClip: "border-box",
		border: "1px solid rgba(0, 0, 0, 0.125)",
		borderRadius: "0.25rem",
		// marginBottom: "1rem", // not working
	}

	return (
		<>
			<h1 className="h2"><em>{clinicTitle}</em> Intake</h1>
			<p className="text-danger small">*Required</p>

			{/* is repeat visitor Form.Check switch */}

			<Row>
				<Col>
					<Form.Group className="mb-2">
						<Form.Label className="mb-0">Have you been to the clinic before?&nbsp;&nbsp;</Form.Label>
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
					lawTypes={props.lawTypes}
					submitForm={submitCreateInquirer}
					serverResponse={serverResponse}
				/>
			}

			{/* repeat visitor */}
			{isRepeat &&
				repeatVisitorSelect()
			}

			{/* repeat visitor selected for editing */}
			{isRepeat && repeatVisitorSelected &&
				(
					<VisitorAddForm
						// start with given select obj, return array with full airtable record
						repeatVisitor={getRecordsFromSelection(repeatVisitorSelected, props.inquirers)[0]}
						lawTypes={props.lawTypes}
						submitForm={submitUpdateInquirer}
						serverResponse={serverResponse}
					/>
				)
			}

			{/* repeat visitor edits submitted: success message */}
			{isRepeat && visitorWasUpdated &&
				visitorUpdatedMessage(serverResponse)
			}
		</>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		// call from parent Clinics?
		createInquirer: inq => dispatch(actions.createInquirer(inq)),
		updateInquirer: inqValues => dispatch(actions.updateInquirer(inqValues))
	}
}
export default connect(null, mapDispatchToProps)(Intake);
