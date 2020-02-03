export {
	getLawyers,
	createLawyer,
	getInquirers,
	createInquirer,
	updateInquirer,
	// REMOVE?
	setCurrentInquirers, // used when select repeat visitor // could save in Clinic state vs. redux store
} from './people';

export {
	getLawTypes,
} from './lawtypes';

export {
	createConsultation,
} from './consultations';

export {
	getClinicSettings,
	setCurrentClinic,
} from './clinic';
