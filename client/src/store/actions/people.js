import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
import * as peopleFields from '../../data/peopleFields'; //
import {
	PEOPLE_TABLE,
	INQUIRERS_VIEW,
} from '../../data/peopleData';
import {
	recordForUpdate
} from '../../data/dataTransforms';

// async action creators

// lawyers and coordinators
const getLawyers = () => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			// TO DO: remove array
			let lawyersArray = [];
			let lawyersObject = {};
			airtableBase(PEOPLE_TABLE).select({
				// view: LAWYERS_VIEW,
				// filterByFormula: 'Type = ...', // array
			}).eachPage(function page(records, fetchNextPage) {
				records.forEach(record => {
					// array
					const _record = record.fields;
					if (
						_record?.[peopleFields.TYPE]?.includes(peopleFields.TYPE_LAWYER) ||
						_record?.[peopleFields.TYPE]?.includes(peopleFields.TYPE_COORDINATOR)
					) {
						_record.id = record.id
						lawyersArray.push(_record)
						// object
						lawyersObject[record.id] = record.fields
					}

				});
				fetchNextPage(); // next 100
			}, function done(error) {
				if (error) {
					console.error('Airtable Error: ', error);
					return reject({
						status: 'failed',
						error,
					});

				}
				const lawyers = [lawyersArray, lawyersObject];
				dispatch(initLawyers(lawyers));
				return resolve({
					status: 'success',
					type: 'getLawyers',
					payload: lawyers,
				});
			});
		})
	}
}

const createLawyer = lawyer => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let payload = {
				...lawyer,
				[peopleFields.TYPE]: [
					"Lawyer"
				],
			};
			airtableBase(PEOPLE_TABLE).create(payload, function (error, record) {
				if (error) {
					console.error('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				const lawyer = {
					...record.fields,
					id: record.id
				};
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

const getInquirers = () => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let inquirersArray = [];
			let inquirersObject = {};
			airtableBase(PEOPLE_TABLE).select({
				view: INQUIRERS_VIEW,
				// filterByFormula: 'OR(NOT({First Name} = ""), NOT({Last Name} = ""))'
				// filterByFormula: 'Type = "Inquirer"'
			}).eachPage(function page(records, fetchNextPage) {
				records.forEach(function (record) {
					// array
					const _record = record.fields;
					_record.id = record.id;
					inquirersArray.push(_record);
					// object
					inquirersObject[record.id] = record.fields;
				});
				fetchNextPage(); // next 100
			}, function done(error, records) {
				if (error) {
					console.error('Airtable Error: ', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				const inquirers = [inquirersArray, inquirersObject]
				dispatch(initInquirers(inquirers));
				return resolve({
					status: 'success',
					type: 'getInquirers',
					payload: inquirers,
				});
			});
		});
	}
}

const createInquirer = inquirer => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let payload = {
				...inquirer,
				[peopleFields.TYPE]: [
					"Inquirer"
				],
				[peopleFields.REPEAT_VISIT]: 'No',
			};
			airtableBase(PEOPLE_TABLE).create(payload, function (error, record) {
				if (error) {
					console.error('Airtable Error:', error);
					return reject({
						status: 'failed',
						error,
					});
				}
				const inquirer = {
					...record.fields,
					id: record.id
				};
				dispatch(addInquirer(inquirer));
				return resolve({
					status: 'success',
					type: 'createInquirer',
					payload: inquirer,
				});
			});
		})
	}
}

const updateInquirer = info => {
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
				// record is array
				const inquirer = {
					...record[0].fields,
					id: record[0].id
				};
				dispatch(updateInquirers(inquirer));
				return resolve({
					status: 'success',
					type: 'updateInquirer',
					payload: inquirer,
				})
			});
		});
	}
}

// sync action creators

const initLawyers = lawyers => {
	return {
		type: actionTypes.INIT_LAWYERS,
		// array with array & object
		lawyers
	}
}

const addLawyer = lawyer => {
	return {
		type: actionTypes.ADD_LAWYER,
		lawyer
	}
}

// TO DO: inquirers object only
const initInquirers = (inquirers) => {
	return {
		type: actionTypes.INIT_INQUIRERS,
		inquirers,
	}
}

const addInquirer = inquirer => {
	return {
		type: actionTypes.ADD_INQUIRER,
		inquirer
	}
}

// take updated inquirer and replace with new info
const updateInquirers = inquirer => {
	return {
		type: actionTypes.UPDATE_INQUIRERS,
		inquirer
	}
}

export {
	// async action creators
	getLawyers,
	createLawyer,
	getInquirers,
	createInquirer,
	updateInquirer,

	// sync action creators
	initLawyers,
	addLawyer,
	initInquirers,
	addInquirer,
	updateInquirers,
}