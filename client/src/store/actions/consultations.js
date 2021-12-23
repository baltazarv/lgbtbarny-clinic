import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
// db item names
import { TABLE } from '../../data/consultationData';

// async action creators

// TODO: don't limit to view: _Consultations
const getConsultations = () => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			// let consultations = [];
			let consultations = {}
			airtableBase(TABLE).select({
				view: "_Consultations"
			}).eachPage(function page(records, fetchNextPage) {
				records.forEach(function (record) {
					// option 1
					// const _record = record.fields;
					// _record.id = record.id;
					// consultations.push(_record);

					// option 2
					// consultations.push(records);

					// option 3
					consultations[record.id] = record.fields;
				});
				fetchNextPage();
			}, function done(err) {
				if (err) {
					console.error('Airtable Error: ', err);
					return reject('Airtable erroror: ', err);
				}
				dispatch(initConsultations(consultations));
				return resolve({
					status: 'success',
					type: 'getConsultations',
					payload: consultations,
				});
			});
		})
	}
}

const createConsultation = submitFields => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			airtableBase(TABLE).create([{
				fields: submitFields
			}], function (error, records) {
				if (error) {
					console.log('Airtable Error:', error)
					return reject({
						status: 'failed',
						error,
					})
				}
				// object with fields: Created On, Date, Disposition, Inquirer, Last Modified On, Lawyer, Name, Type, id
				const consultRecord = records[0]['fields']
				consultRecord['id'] = records[0]['id']
				//-> dispatch(consultationCreated(consultRecord))
				return resolve({
					status: 'success',
					type: 'createConsultation',
					payload: consultRecord,
				})
			})
		})
	}
}

// takes an oject: { key, fields }
const updateConsultation = (updateObject) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let newConsultation = {};
			airtableBase(TABLE).update(updateObject.id,
				updateObject.fields,
				function (error, record) {
					if (error) {
						console.log('Airtable Error:', error);
						return reject({
							status: 'failed',
							error,
						});
					}
					newConsultation[record.id] = record.fields;
					dispatch(consultationUpdated(newConsultation));
					return resolve({
						status: 'success',
						type: 'updateConsultation',
						payload: newConsultation,
					})
				})
		});
	}
}

const deleteConsultation = (id) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			airtableBase(TABLE).destroy(id,
				(error, deletedRecord) => {
					if (error) {
						console.log('Airtable Error:', error)
						return reject({
							status: 'failed',
							error,
						})
					}
					return resolve({
						status: 'success',
						type: 'deletedConsultation',
						// deletedRecord almost empty but have deletedRecord.id
						payload: deletedRecord,
					})
				})
		})
	}
}

// sync action creators

const initConsultations = consultations => {
	return {
		type: actionTypes.INIT_CONSULTATIONS,
		consultations
	}
}

const consultationCreated = (consultation) => {
	return {
		type: actionTypes.CONSULTATION_CREATED,
		consultation,
	}
}

const consultationUpdated = consultation => {
	return {
		type: actionTypes.CONSULTATION_UPDATED,
		consultation
	}
}

const consultationDeleted = (id) => {
	return {
		type: actionTypes.CONSULTATION_DELETED,
		id,
	}
}

export {
	// async action creators
	getConsultations,
	createConsultation,
	updateConsultation,
	deleteConsultation,
	// sync action creators
	initConsultations,
	consultationCreated,
	consultationUpdated,
	consultationDeleted,
}