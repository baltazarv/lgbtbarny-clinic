import React from 'react';
import NewAndRepeatVisitor from '../../components/clinics/NewAndRepeatVisitor';

const Intake = props => {

	const {
		clinic,
	} = props;

	return (
		<>
			<h1 className="h2">Visitor Intake Form</h1>
			<p className="text-danger small">*Required</p>
			<NewAndRepeatVisitor
				clinic={clinic}
			/>
		</>
	);
};

export default Intake;
