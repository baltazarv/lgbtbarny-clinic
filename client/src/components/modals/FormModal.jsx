import React from 'react';
import { Modal } from 'react-bootstrap';

const FormModal = props => {
	const { show, onHide, header, body, size="md" } = props;
	return (
		<Modal
			show={show}
			onHide={onHide}
			size={size}
			dialogClassName="modal-90w"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			{header &&
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						{header}
					</Modal.Title>
				</Modal.Header>
			}
			<Modal.Body>
				{body}
			</Modal.Body>
			{/* <Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="primary" onClick={onHide}>
					{savebutton}
				</Button>
			</Modal.Footer> */}
		</Modal>
	)
}

export default FormModal;
