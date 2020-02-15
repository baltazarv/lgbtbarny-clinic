/** Separate into EditCustomEmailModal & EditCustomEmail */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
// data
import { formatName } from '../../data/peopleData';
import * as peopleFields from '../../data/peopleFields';
import { EMAIL_OPTIONS, mergeCustomAndDefaulText } from '../../emails/visitorPostConsultation';
// styles
import styles from './EditEmailModal.module.css';
// utils
import { objectIsEmpty } from '../../utils';

const EditEmailModal = ({
	// modal props
	showModal,
	handleCloseModal,

	inquirers,
	handleSavedEdit,
}) => {
	// appears on textarea:
	const [textBuffer, setTextBuffer] = useState('');
	// custom message saved:
	const [savedText, setSavedText] = useState('');
	// switch to textarea containing default text?
	const [editingDefaultText, setEditingDefaultText] = useState(false);
	// don't show boilerplate text, has been copied to saved text
	const [defaultTextSaved, setDefaultTextSaved] = useState(false);

	// controls textBuffer
	const handleChangeCustomEmail = evt => {
		setTextBuffer(evt.target.value);
	}

	/** "Edit Entire Email Body" */
	const editDefaultText = () => {
		setEditingDefaultText(true); // hide boilerplate text
		setTextBuffer(mergeCustomAndDefaulText(textBuffer))
	}

	/** "Edit Custom Message Only" */
	const cancelEditDefaultText = () => {
		setEditingDefaultText(false); // show boilerplate text
		setDefaultTextSaved(false);
	}

	const cancelEdit = () => {
		if (editingDefaultText && !defaultTextSaved) {
			setEditingDefaultText(false);
		}
		setTextBuffer(savedText);
		handleCloseModal();
	}

	/** save buffer to savedText,
	 * clear buffer,
	 * save to Consultation
	 */
	const saveEdit = () => {

		// console.log('editingDefaultText', editingDefaultText)
		let _defaultTextSaved = false;
		if (editingDefaultText) {
			_defaultTextSaved = true;
		}
		/** if editing boilerplate & save,
		 * boilerplate now in saved text,
		 * no longer showing boilerplate as boilerpate
		 * */
		setDefaultTextSaved(_defaultTextSaved);

		/** Consultation saves text for submission
		 * and resets when loading a new inquirer selected
		 */
		handleSavedEdit(textBuffer, _defaultTextSaved, onReset);

		setSavedText(textBuffer);
		handleCloseModal();
	}

	const onReset = () => {
		// on a new inquierer selected clear fields
		setTextBuffer('');
		setSavedText('');
		setEditingDefaultText(false);
		setDefaultTextSaved(false);
	}

	let emailEditModalTitle = null;
	let emailEditModalHead = null;
	let emailEditModalBody = null;
	if (!objectIsEmpty(inquirers)) {
		const firstCurrInquirer = inquirers[[Object.keys(inquirers)[0]]];
		const firstCurrInqName = formatName(firstCurrInquirer);
		if (firstCurrInquirer[peopleFields.EMAIL]) {
			emailEditModalTitle = `Edit Email for ${firstCurrInqName}`;

			emailEditModalHead = <div className="text-muted small">
				<span className="font-weight-bold">from:</span> {EMAIL_OPTIONS.from}<br />
				<span className="font-weight-bold">to:</span> {firstCurrInquirer[peopleFields.EMAIL]}<br />
				<span className="font-weight-bold">subject:</span> {EMAIL_OPTIONS.subject}<br /><br />
				<span className="font-weight-bold">body:</span> {EMAIL_OPTIONS.message}
			</div>

			// TEXTAREA
			const customEmailTxtArea = (rows = 4) => <Form.Group controlId="textBuffer">
				<Form.Control
					style={{ fontSize: '0.8em' }}
					as="textarea"
					rows={rows}
					value={textBuffer}
					name="textBuffer"
					onChange={handleChangeCustomEmail}
				/>
			</Form.Group>

			if (!editingDefaultText) {
				emailEditModalBody = <div>
					<div className={styles.emailBody}>
						<div className="text-muted small mb-3">{EMAIL_OPTIONS.bodyPre}</div>
						{customEmailTxtArea(6)}
						<div className="text-muted small mt-3">{EMAIL_OPTIONS.bodyPost}</div>
					</div>
					<Button
						onClick={() => editDefaultText()} size="sm" className="btn btn-sm btn-warning mt-3">
						Edit Entire Email Body
					</Button>
				</div>
			} else {
				let editMsgBtn = null;
				if (!defaultTextSaved) {
					editMsgBtn = <Button
						onClick={cancelEditDefaultText} size="sm" className="btn btn-sm  mt-3">
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
			show={showModal}
			onHide={cancelEdit}
			// onShow={showEditor}
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
				<Button onClick={cancelEdit}>Cancel</Button>
				<Button onClick={saveEdit}>Save</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditEmailModal;
