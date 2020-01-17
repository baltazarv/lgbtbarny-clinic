import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { formatName } from '../../data/dataTransforms'

const PrevConsultationModal = props => {
	const { prevConsultSelected,lawyers, lawTypes, show, onHide, onClick } = props;

	let currentConsultationName = '';
	let modalPrevConsultBody = null;
	const prevConsultation = prevConsultSelected;
	if (prevConsultation) {
		currentConsultationName = <h3>{prevConsultation.name}</h3>;
		let _lawyers = [];
		if (prevConsultation.lawyers) {
			_lawyers = prevConsultation.lawyers.map(consultLawyer => {
				// props.lawyers.find...
				const lawyer = lawyers.find(lawyer => {
					return lawyer.id === consultLawyer;
				})
				return formatName(lawyer);
			})
		}
		let _lawTypes = [];
		if (prevConsultation.lawTypes) {
			_lawTypes = prevConsultation.lawTypes.map(consultType => {
				// props.lawTypes.find...
				const lawType = lawTypes.find(type => {
					return type.id === consultType;
				})
				return lawType.type;
			})
		}
		modalPrevConsultBody = (
			<ul>
				<li><strong>Consulting Lawyer:</strong> {_lawyers && _lawyers.length > 0 ? (_lawyers.join(', ')) : ''}</li>

				<li><strong>Notes: </strong>{prevConsultation.situation}</li>

				<li><strong>Disposition: </strong>{prevConsultation.dispositions && prevConsultation.dispositions.length > 0 ? (prevConsultation.dispositions.join(', ')) : ''}</li>

				<li><strong>Type of Law: </strong>{_lawTypes.join(', ')}</li>

				<li><strong>Referral Summary: </strong>{prevConsultation.summary}</li>
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
