import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

// import * as fieldNames from '../../data/consultionFields';
const TABLE = 'Consultations';

// async action creators

export const createConsultation = submitFields => {
	return dispatch => {
		airtableBase(TABLE).create([
			{ fields: submitFields }
		], function(err, records) {
			if (err) {
				console.log('Airtable Error: ', err);
				return;
			}
			// object with fields: Created On, Date, Disposition, Inquirer, Last Modified On, Lawyer, Name, Type, id
			const consultRecord = records[0]['fields'];
			consultRecord['id'] = records[0]['id'];
			dispatch(consultationCreated(consultRecord));
		})
	}
}

// sync action creators

export const consultationCreated = newConsultation => {
	return {
		type: actionTypes.CONSULTATION_CREATED,
		newConsultation
	}
}

export const consultationInProgress = () => {
	return {
		type: actionTypes.CONSULTATION_IN_PROGRESS,
	}
}

// maybe use for later // is there a need to get all consultations?
export const initConsultations = consultations => {
	return {
		type: actionTypes.INIT_CONSULTATIONS,
		consultations
	}
}
