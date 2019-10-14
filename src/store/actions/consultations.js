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
			dispatch(consultationCreated(records[0]));
		})
	}
}

// sync action creators

export const consultationCreated = newConsultion => {
	return {
		type: actionTypes.CONSULTATION_CREATED,
		newConsultion
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
