// given consultation records from db,
// render a list of the consultations
import React, { useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import PrevConsultationModal from './modals/PrevConsultationModal';
// data
import * as peopleFields from '../data/peopleFields';
import * as consultFields from '../data/consultionFields';
import * as lawTypeData from '../data/lawTypeData';
import { formatName } from '../data/dataTransforms';

const ConsultationList = ({ consultations, lawyers, showConsultModal }) => {
	return (
		<>
			{consultations && consultations.length > 0 &&
				<ListGroup.Item variant="light">
					<strong>Previous Consultations:</strong>
					<ul className="mb-0">
						{consultations.map(consult => {
							let lawyerInfo = '';
							if (consult && consult[consultFields.LAWYERS] && consult[consultFields.LAWYERS].length > 0) { // some consultations did not have lawyers added
								let lawyerNames = consult[consultFields.LAWYERS].reduce((acc, curr) => {
									const lawyerName = lawyers.find(_lawyer => curr === _lawyer.id);
									// if someone was added for the lawyer who isn't really a lawyer
									// lawyerName cannot be found
									if (lawyerName) {
										acc.push(lawyerName[peopleFields.FIRST_NAME] + ' ' + lawyerName[peopleFields.LAST_NAME]); // use get full name function
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
									onClick={() => showConsultModal(consult)}
									variant="link" size="sm">
									{consult[consultFields.NAME]} <span style={{ whiteSpace: 'nowrap' }}>{lawyerInfo}</span>
								</Button>
							</li>
						})}
					</ul>
				</ListGroup.Item>
			}
		</>
	)
}

const InquirerInfo = ({
	inquirers,
	consultations,
	lawyers,
	lawTypes
}) => {

	const [consultModalShown, setConsultModalShown] = useState(false);
	const [consultSelected, setConsultSelected] = useState({});

	const showConsultModal = consultation => {
		setConsultSelected(consultation);
		setConsultModalShown(true);
	}

	const hideConsultModal = () => {
		setConsultModalShown(false);
	}

	let _inquirers = inquirers.map(inq => {
		// copy props from the selected inquirers into new object
		let inqWithConsult = { ...inq };
		if (inqWithConsult[peopleFields.CONSULTATIONS]) {
			// add a prop called `fullConsultation` with all consultation props
			inqWithConsult['fullConsultation'] = inqWithConsult[peopleFields.CONSULTATIONS].map(id => {
				return consultations.find(item => {
					return id === item.id;
				})
			})
		}
		return inqWithConsult;
	})

	let inquirerInfo = null; // add a loader?
	if (_inquirers.length > 0) {
		inquirerInfo = (
			_inquirers.map(inq => {
				console.log('ConsultationList BUG! inq has fullConsultation prop?', inq)

				let _lawTypes = '';
				if (inq[peopleFields.LAW_TYPES] && inq[peopleFields.LAW_TYPES].length > 1) {
					_lawTypes = inq[peopleFields.LAW_TYPES].map(typeSelected => {
						let foundObj = lawTypes.find(typeFromAll => typeFromAll.id === typeSelected);
						// console.log('found obj', foundObj)
						return foundObj[lawTypeData.NAME];
					}).join(', ');
				}

				return (
					<div key={inq.id}>
						{/* inquirer name */}
						<Card.Footer>Information for: <strong>{formatName(inq)}</strong></Card.Footer>

						{/* inquirer info */}
						<ListGroup className="mb-3">

							{/* gender pronouns */}
							<ListGroup.Item variant="light"><strong>{peopleFields.PRONOUNS}:</strong> {inq[peopleFields.PRONOUNS] ? inq[peopleFields.PRONOUNS].toString() : 'no answer'}</ListGroup.Item>

							{/* type of law */}
							<ListGroup.Item variant="light"><strong>{peopleFields.LAW_TYPES}:</strong> {inq[peopleFields.LAW_TYPES] ? _lawTypes : 'assessment not done'}</ListGroup.Item>

							{/* consultations */}
							{inq['fullConsultation'] &&
								<ConsultationList
									consultations={inq['fullConsultation']}
									lawyers={lawyers}
									showConsultModal={showConsultModal}
								/>}

							{/* income */}
							<ListGroup.Item variant="light"><strong>{peopleFields.INCOME}:</strong> {inq[peopleFields.INCOME] ? inq[peopleFields.INCOME] : 'no answer'}</ListGroup.Item>

							{/* intake notes */}
							<ListGroup.Item variant="light">
								<dl className="row mb-0">
									<dt className="col-sm-4">Optional/additional Notes:</dt>
									<dd className="col-sm-8 mb-0">{inq[peopleFields.INTAKE_NOTES] ? inq[peopleFields.INTAKE_NOTES] : 'none'}</dd>
								</dl>
							</ListGroup.Item>

							{/* repeat visit */}
							{/* {inq[peopleFields.REPEAT_VISIT] === 'Yes' ? (
								<ListGroup.Item variant="light">
									<strong>Repeat Visit(s):</strong> Yes
								</ListGroup.Item>
							) : null} */}

							{/* address */}
							<ListGroup.Item variant="light">
								<span className="font-weight-bold">{peopleFields.ADDRESS}: </span>{inq[peopleFields.ADDRESS] ? inq[peopleFields.ADDRESS] : 'No address provided.'}
							</ListGroup.Item>

							{/* email */}
							<ListGroup.Item variant="light">
								<span className="font-weight-bold">{peopleFields.EMAIL}: </span>{inq[peopleFields.EMAIL] ? inq[peopleFields.EMAIL] : 'No email provided.'}
							</ListGroup.Item>
						</ListGroup>
					</div>
				)
			})
		)
	}

	return (
		<>
			{inquirerInfo}

			{/* previous consultation info */}
			<PrevConsultationModal
				show={consultModalShown}
				onHide={hideConsultModal}
				consultSelected={consultSelected}
				lawyers={lawyers}
				lawTypes={lawTypes}
				onClick={hideConsultModal}
			/>
		</>
	)
}

export default InquirerInfo;
