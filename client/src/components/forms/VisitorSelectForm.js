import React from 'react';
import { withFormik } from 'formik';
import SelectField from './fields/SelectField';

const visitorOptions = [
	{ value: 'xxx', label: 'Baltazar Villegas' },
	{ value: 'yyy', label: 'Brett Figlewski' },
	{ value: 'xyxy', label: 'Leah Harper' },
];

const formikEnhancer = withFormik({
	mapPropsToValues: props => ({
		visitor: [],
	}),
	validate: values => {
		const errors = {};

		if (!values.visitor || values.visitor.length < 1) {
			errors.visitor = 'Select a repeat visitor to proceed. If not on pulldown, enter a new person.';
		}

		return errors;
	},
	// handleSubmit: (values, { setSubmitting }) => {
	// 	const payload = {
	// 		...values,
	// 		visitor: values.visitor.map(t => t.value),
	// 	};
	// 	setTimeout(() => {
	// 		alert(JSON.stringify(payload, null, 2));
	// 		setSubmitting(false);
	// 	}, 1000);
	// },
	displayName: 'FormikForm',
});

const VisitorSelectForm = props => {
	const {
		// custom props
		onChange,
		isDisabled,

		// formik props used
		values,
		touched,
		errors,
		setFieldValue,
		setFieldTouched,

		// formik props not used
		// dirty,
		// handleChange,
		// handleBlur,
		// handleSubmit,
		// handleReset,
		// isSubmitting,
	} = props;

	onChange(values.visitor)

	return (
		<>
		{/* DISABLED FORM AND SUBMIT */}
		{/* <form onSubmit={handleSubmit}> */}
			<SelectField
				options={visitorOptions}
				value={values.visitor}
				onChange={setFieldValue}
				onBlur={setFieldTouched}
				error={errors.visitor}
				touched={touched.visitor}
				name="visitor"
				label="Visitor"
				required={true}
				isDisabled={isDisabled}
			/>

			{/* HANDLE RESET! */}
			{/* <button
				type="button"
				className="outline"
				onClick={handleReset}
				disabled={!dirty || isSubmitting}
			>
				Reset
			</button>

			<button type="submit" disabled={isSubmitting}>
				Submit
      </button> */}
		{/* </form> */}
		</>
	);
};

export default formikEnhancer(VisitorSelectForm);
