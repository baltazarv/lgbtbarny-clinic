import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import * as consultFields from '../../data/consultionFields';
import * as lawTypeData from '../../data/lawTypeData';
import { formatName } from '../../data/dataTransforms'

const PrevConsultationModal = props => {
	const { consultSelected, lawyers, lawTypes, show, onHide, onClick } = props;

	let currentConsultationName = '';
	let modalPrevConsultBody = null;
	if (consultSelected) {
		currentConsultationName = <h3>{consultSelected[consultFields.NAME]}</h3>;
		let _lawyers = [];
		if (consultSelected[consultFields.LAWYERS]) {
			_lawyers = consultSelected[consultFields.LAWYERS].map(consultLawyer => {
				// props[consultFields.LAWYERS].find...
				const lawyer = lawyers.find(lawyer => {
					return lawyer.id === consultLawyer;
				})
				return formatName(lawyer);
			})
		}
		let _lawTypes = [];
		// console.log('law types', consultSelected[consultFields.LAW_TYPES], 'full', lawTypes)
		if (consultSelected[consultFields.LAW_TYPES]) {
			_lawTypes = consultSelected[consultFields.LAW_TYPES].map(consultType => {
				const lawType = lawTypes.find(type => {
					// console.log('type', type.id, 'vs consultType', consultType)
					return type.id === consultType;
				})
				return lawType[lawTypeData.NAME];
			})
		}
		// console.log('_lawTypes', _lawTypes)
		modalPrevConsultBody = (
			<ul>
				<li><strong>Consulting Lawyer:</strong> {_lawyers && _lawyers.length > 0 ? (_lawyers.join(', ')) : ''}</li>

				<li><strong>Notes: </strong>{consultSelected[consultFields.SITUATION]}</li>

				<li><strong>Disposition: </strong>{consultSelected[consultFields.DISPOSITIONS] && consultSelected[consultFields.DISPOSITIONS].length > 0 ? (consultSelected[consultFields.DISPOSITIONS].join(', ')) : ''}</li>

				<li><strong>Type of Law: </strong>{_lawTypes.join(', ')}</li>

				<li><strong>Referral Summary: </strong>{consultSelected[consultFields.REF_SUMMARY]}</li>
			</ul>
		)
	}
	return (
		<Modal
			show={show}
			onHide={onHide}
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
				<Button onClick={onClick}>Close</Button>
			</Modal.Footer>
		</Modal>

	)
}

export default PrevConsultationModal;
