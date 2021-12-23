export {
	getLawyers,
	createLawyer,
	getInquirers,
	createInquirer,
	updateInquirer,
} from './people';

export {
	getLawTypes,
} from './lawtypes';

export {
	// async action creators
	getConsultations,
	createConsultation,
	updateConsultation,
	deleteConsultation,
	// sync action creators
	consultationCreated,
	consultationDeleted,
} from './consultations';
