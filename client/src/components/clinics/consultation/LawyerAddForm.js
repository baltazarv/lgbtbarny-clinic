import React, { Component } from 'react';
import { withFormik, Form as FormikForm } from 'formik';
import { Form, Row, Col, Button } from 'react-bootstrap';
import InputField from '../../forms/fields/InputField';
import * as peopleFields from '../../../data/peopleFields';

class LawyerAddForm extends Component {

	render() {

		const {
			// modal
			onHide,

			// formik props
			isSubmitting,
			// values,
			// touched,
			// errors,
			// dirty,
			// handleChange,
			// handleBlur,
			// handleSubmit,
			// handleReset,
		} = this.props;

		return <>
			<FormikForm>
				<Row>
					<Col className="label form-label mb-2">Name</Col>
				</Row>
				<Form.Row>
					<Col sm={5}>
						<InputField
							name={peopleFields.FIRST_NAME}
							type="text"
							placeholder={peopleFields.FIRST_NAME}
							required={true}
							style={{
								width: "86%",
								display: "inline",
							}}
						/>
					</Col>
					<Col sm={2}>
						<InputField
							name={peopleFields.MIDDLE_NAME}
							type="text"
							placeholder={peopleFields.MIDDLE_NAME}
							style={{
								width: "84%",
								display: "inline",
							}}
						/>
					</Col>
					<Col sm={5}>
						<InputField
							name={peopleFields.LAST_NAME}
							type="text"
							placeholder={peopleFields.LAST_NAME}
							required={true}
							style={{
								width: "86%",
								display: "inline",
							}}
						/>
					</Col>
				</Form.Row>
				<Form.Row>
					<Col>
						<InputField
							name={peopleFields.EMAIL}
							type="email"
							label="Email Address" // "Email" on DB
							placeholder="email@address.com"
							required={false}
							style={{
								width: "82%",
								display: "inline",
							}}
						/>
					</Col>
				</Form.Row>
				<hr />
				<Row >
					<Col className="d-flex justify-content-end">
						<Button variant="secondary" className="m-1" onClick={onHide}>
							Cancel
						</Button>
						<Button variant="primary" type="submit" className="m-1" disabled={isSubmitting}>
							Add Lawyer
						</Button>
					</Col>
				</Row>
			</FormikForm>
		</>
	}

}

// connect()(withFormik()(Component))
export default withFormik({
	mapPropsToValues: props => {
		return {
			[peopleFields.FIRST_NAME]: '',
			[peopleFields.MIDDLE_NAME]: '',
			[peopleFields.LAST_NAME]: '',
			[peopleFields.EMAIL]: '',
		}
	},
	validate: (values) => {
		const errors = {};

		if (!values[peopleFields.FIRST_NAME]) {
			errors[peopleFields.FIRST_NAME] = 'First name is required.';
		}

		if (!values[peopleFields.LAST_NAME]) {
			errors[peopleFields.LAST_NAME] = 'Last name is required.';
		}
		return errors;

	},
	handleSubmit: (values, actions) => {
		const {
			props,
			setSubmitting,
		} = actions;
		props.submitForm(values);

		// only if serverResponse.status === 'success'
		setSubmitting(false);
		props.onHide();
	},
	displayName: 'lawyersForm',
})(LawyerAddForm);
