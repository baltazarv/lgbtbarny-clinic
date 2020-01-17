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
import Select from '../../../components/forms/fields/Select';
import VisitorAddForm from '../../../components/forms/VisitorAddForm';
import { getPeopleIntoSelectOptions, getRecordsFromSelection } from '../../../data/dataTransforms';
import * as actions from '../../../store/actions/index';

const Intake = props => {
	const { clinicTitle } = props;
	const [isRepeat, setIsRepeat] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectVisitorOptions, setSelectVisitorOptions] = useState([]);

	const handleRepeatSwitch = () => {
		setIsRepeat(!isRepeat);
		// populate select pulldown
		if (props.inquirers && props.inquirers.length > 0) {
			setSelectVisitorOptions(getPeopleIntoSelectOptions(props.inquirers));
		}
	}

	const handleVisitorSelect = selection => {
		// get full airtable record
		const inqRecSelected = getRecordsFromSelection(selection, props.inquirers);
		props.setCurrentInquirers(inqRecSelected);
		// props.getCurrInqPastConsults(inqRecSelected);
		if (selection && selection.value) {
			setIsEditing(true);
		} else {
			setIsEditing(false);
		}
	}

	const repeatInstructions = () => {
		const style = "mb-3 small";
		if (isRepeat) {
			return <Col className={style}>&nbsp;<strong>Yes &mdash; </strong> Find visitor from pulldown to verify and update info:</Col>
		}
		return <Col className={style}>&nbsp;<strong>No &mdash; </strong> Enter new visitor:</Col>
	};

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

			{/* is repeat visitor switch */}
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
			{!isRepeat &&
				<VisitorAddForm />
			}
			{isRepeat &&
				<div className="mb-3">
					<Card className={cardStyle}>
						<Card.Body>
							<Select
								name="visitor"
								options={selectVisitorOptions}
								defaultValue=""
								onChange={handleVisitorSelect}
								label="Repeat Visitor"
								isDisabled={isEditing}
								required={true}
							/>
						</Card.Body>
					</Card>
				</div>
			}{isRepeat && isEditing &&
				( // pump in visitor info
					<VisitorAddForm
						editData={props.currentInquirers}
					/>
				)
			}
		</>
	);
};

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirers,
		currentInquirers: state.people.currentInquirers,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setCurrentInquirers: inqs => dispatch(actions.setCurrentInquirers(inqs)),
		getCurrInqPastConsults: inqs => dispatch(actions.getCurrInqPastConsults(inqs)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Intake);
