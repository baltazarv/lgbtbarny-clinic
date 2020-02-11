import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
// db item names
import { TABLE } from '../../data/consultationData';

// fetch function that does not save to redux state
export { readConsultationsByIds } from '../../data/consultationData';

// async action creators

export const createConsultation = submitFields => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			airtableBase(TABLE).create([{
				fields: submitFields
			}], function (error, records) {
				if (error) {
					console.log('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				// object with fields: Created On, Date, Disposition, Inquirer, Last Modified On, Lawyer, Name, Type, id
				const consultRecord = records[0]['fields'];
				consultRecord['id'] = records[0]['id'];
				// dispatch(consultationCreated(consultRecord));
				return resolve({
					status: 'success',
					type: 'createConsultation',
					payload: consultRecord,
				})
			})
		});
	}
}

// sync action creators

// maybe use for later // is there a need to get all consultations?
export const initConsultations = consultations => {
	return {
		type: actionTypes.INIT_CONSULTATIONS,
		consultations
	}
}
