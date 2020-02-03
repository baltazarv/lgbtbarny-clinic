import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
import * as peopleFields from '../../data/peopleFields'; //
import { PEOPLE_TABLE, INQUIRERS_VIEW, LAWYERS_VIEW } from '../../data/peopleData';
import { recordForUpdate } from '../../data/dataTransforms';

// async action creators

export const getLawyers = () => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let lawyers = [];
			airtableBase(PEOPLE_TABLE).select({
				fields: [
					peopleFields.FIRST_NAME,
					peopleFields.MIDDLE_NAME,
					peopleFields.LAST_NAME,
					peopleFields.OTHER_NAMES,
				],
				view: LAWYERS_VIEW
				// filterByFormula: 'Type = "Lawyer"'
			}).eachPage(function page(records, fetchNextPage) {
				records.forEach(record => {
					const _record = record.fields;
					_record.id = record.id;
					lawyers.push(_record);
				});
				fetchNextPage(); // next 100
			}, function done(err, records) {
				if (err) {
					console.error('Airtable Error: ', err);
					return reject('Airtable Error: ', err);
				}
				dispatch(initLawyers(lawyers));
				return resolve(lawyers);
			});
		})
	}
}

export const createLawyer = lawyer => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let payload = {
				...lawyer,
				[peopleFields.TYPE]: [
					"Lawyer"
				],
				[peopleFields.REPEAT_VISIT]: 'Yes',
			};
			airtableBase(PEOPLE_TABLE).create(payload, function (error, record) {
				if (error) {
					console.error('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				let lawyer = {...record.fields, id: record.id};
				dispatch(addLawyer(lawyer));
				return resolve({
					status: 'success',
					type: 'createLawyer',
					payload: lawyer,
				})
			});
		});
	}
}

export const getInquirers = () => {
	return dispatch => {
		let inquirers = [];
		airtableBase(PEOPLE_TABLE).select({
			view: INQUIRERS_VIEW,
			fields: [
				peopleFields.REPEAT_VISIT,
				peopleFields.FIRST_NAME,
				peopleFields.MIDDLE_NAME,
				peopleFields.LAST_NAME,
				peopleFields.OTHER_NAMES,
				peopleFields.EMAIL,
				peopleFields.PHONE,
				peopleFields.ADDRESS,
				peopleFields.GENDER,
				peopleFields.PRONOUNS,
				peopleFields.INCOME,
				peopleFields.INTAKE_NOTES,
				peopleFields.TERMS,
				peopleFields.SIGNATURE,
				peopleFields.CONSULTATIONS
			],
			// filterByFormula: 'OR(NOT({First Name} = ""), NOT({Last Name} = ""))'
			// filterByFormula: 'Type = "Inquirer"'
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function (record) {
				const _record = record.fields;
				_record.id = record.id;
				inquirers.push(_record);
			});
			fetchNextPage(); // next 100
		}, function done(err, records) {
			if (err) {
				console.log('Airtable Error: ', err);
				// dispatch(fetchInquirersFailed())
				return;
			}
			dispatch(initInquirers(inquirers));
		});
	}
}

export const createInquirer = inquirer => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let payload = {
				...inquirer,
				[peopleFields.TYPE]: [
					"Inquirer"
				],
				[peopleFields.REPEAT_VISIT]: 'Yes',
			};
			airtableBase(PEOPLE_TABLE).create(payload, function (error, record) {
				if (error) {
					console.error('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				// payload is one inquirer object with `id` and `fields` props
				dispatch(addInquirer(inquirer));
				return resolve({
					status: 'success',
					type: 'createInquirer',
					payload: record,
				});
			});
		})
	}
}

export const updateInquirer = info => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let payload = recordForUpdate(info);
			// replace (vs update) will perform a destructive update and clear all unspecified cell values.
			airtableBase(PEOPLE_TABLE).update([payload], function (error, record) {
				if (error) {
					console.error('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				// could getInquirers(), but expensive
				const _record = record[0].fields;
				_record.id = record[0].id;
				dispatch(updateInquirers(_record)); // _record
				return resolve({
					status: 'success',
					type: 'updateInquirer',
					payload: record, // record
				})
			});
		});
	}
}


// sync action creators

export const initLawyers = lawyers => {
	return {
		type: actionTypes.INIT_LAWYERS,
		lawyers
	}
}

export const addLawyer = lawyer => {
	return {
		type: actionTypes.ADD_LAWYER,
		lawyer
	}
}

export const initInquirers = inquirers => {
	return {
		type: actionTypes.INIT_INQUIRERS,
		inquirers
	}
}

export const addInquirer = inquirer => {
	return {
		type: actionTypes.ADD_INQUIRER,
		inquirer
	}
}

// take updated inquirer and replace with new info
export const updateInquirers = inquirer => {
	return {
		type: actionTypes.UPDATE_INQUIRERS,
		inquirer
	}
}

// select an inquirer to send between screens
// export const setCurrentInquirers = currentInquirers => {
// 	return {
// 		type: actionTypes.SET_CURRENT_INQUIRERS,
// 		currentInquirers
// 	}
// }
