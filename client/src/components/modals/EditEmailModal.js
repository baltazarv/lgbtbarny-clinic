import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './EditEmailModal.module.css';

const EditEmailModal = ({
	inquirerIsSelected,
	inquirers,
	emailOptions,
	emailMessageTemp,
	emailBodyDefaultModified,
	emailBodyModifyConfirmed,
	editEmailBodyDefault,
	cancelCustomEmailDefault,
	show,
	onChange,
	onHide,
	cancelEditModal,
	saveEditModal,
}) => {
	let emailEditModalTitle = null;
	let emailEditModalHead = null;
	let emailEditModalBody = null;
	if (inquirerIsSelected) {
		const firstCurrInquirer = inquirers[0];
		const firstCurrInqName = `${firstCurrInquirer.firstName} ${firstCurrInquirer.lastName}`;
		if (firstCurrInquirer.email) {
			emailEditModalTitle = `Edit Email for ${firstCurrInqName}`;

			emailEditModalHead = <div className="text-muted small">
				<span className="font-weight-bold">from:</span> {emailOptions.from}<br />
				<span className="font-weight-bold">to:</span> {firstCurrInquirer.email}<br />
				<span className="font-weight-bold">subject:</span> {emailOptions.subject}<br /><br />
				<span className="font-weight-bold">body:</span> {emailOptions.message}
			</div>

			// custom email message
			const customEmailTxtArea = (rows = 4) => <Form.Group controlId="emailMessageTemp">
				<Form.Control
					style={{ fontSize: '0.8em' }}
					as="textarea"
					rows={rows}
					value={emailMessageTemp}
					name="emailMessageTemp"
					onChange={onChange}
				/>
			</Form.Group>
			if (!emailBodyDefaultModified) {
				emailEditModalBody = <div>
					<div className={styles.emailBody}>
						<div className="text-muted small mb-3">{emailOptions.bodyPre}</div>
						{customEmailTxtArea(4)}
						<div className="text-muted small mt-3">{emailOptions.bodyPost}</div>
					</div>
					<Button
						onClick={() => editEmailBodyDefault()} size="sm" className="btn btn-sm btn-warning mt-3">
						Edit Entire Email Body
					</Button>
				</div>
			} else {
				let editMsgBtn = null;
				if (!emailBodyModifyConfirmed) {
					editMsgBtn = <Button
						onClick={cancelCustomEmailDefault} size="sm" className="btn btn-sm  mt-3">
						Edit Custom Message Only
					</Button>
				}
				emailEditModalBody = <div>
					<div className={styles.emailBody}>
						{customEmailTxtArea(11)}
					</div>
					{editMsgBtn}
				</div>
			}
		}
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
					{emailEditModalTitle}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{emailEditModalHead}
				{emailEditModalBody}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={cancelEditModal}>Cancel</Button>
				<Button onClick={saveEditModal}>Save</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditEmailModal;
