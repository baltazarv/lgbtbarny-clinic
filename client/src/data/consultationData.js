import * as consultFields from './consultionFields';
import * as peopleFields from './peopleFields';
import airtableBase from '../airtableBase';

// database item names

export const TABLE = 'Consultations';

// fetch functions

/**
 * Given a array of consultation id's,
 * return a promise resolved to all consultation fields for the record in the db
 */
export const readConsultationsByIds = consultIds => {
	return new Promise((resolve, reject) => {
		/* filterByFormula
		OR(
			RECORD_ID() = 'recwQW5JVQFCZAZt8',
			RECORD_ID() = 'recj49jLIShvTEg6f',
			RECORD_ID() = 'recR09DMEKd1YPfyH'
			) */
		let filterByFormula = 'OR(';
		filterByFormula += consultIds.map(id => {
			return `RECORD_ID() = '${id}'`
		}).toString();
		filterByFormula += ')';

		// get consultations from airtable & match to inquirer objects
		let consultations = [];
		airtableBase(TABLE).select({
			filterByFormula: filterByFormula,
			fields: [
				consultFields.NAME,
				consultFields.DATE,
				consultFields.LAWYERS,
				consultFields.INQUIRERS,
				consultFields.SITUATION,
				consultFields.DISPOSITIONS,
				consultFields.REF_SUMMARY,
				consultFields.LAW_TYPES,
				consultFields.STATUS
			]
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(record => {
				const _record = record.fields;
				_record.id = record.id;
				consultations.push(_record);
			})
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.log('Airtable Error:', err);
				return reject('Airtable Error:', err);
			}
			return resolve(consultations);
		})
	})
};

// given a full inquirer record with consultations,
// 	fetch the inquirer's consultation data as an array.
//  Needed for <ConsultationsList />
export const getInquirerConsultations = async (inqs) => {
	if (inqs && inqs.length > 0) {
		const consultIds = inqs.reduce((acc, inq) => {
			if (inq[peopleFields.CONSULTATIONS] && inq[peopleFields.CONSULTATIONS].length) {
				return [...acc, ...inq[peopleFields.CONSULTATIONS]];
			}
			return acc;
		}, []);
		const results = await readConsultationsByIds(consultIds); // return promise
		return results;
	} else {
		return [];
	}
}

export const getReferralConsultations = () => {
	return new Promise((resolve, reject) => {
		let consultations = [];
		airtableBase(TABLE).select({
			view: "_Referrals"
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function (record) {
				consultations.push(record);
			});
			fetchNextPage();
		}, function done(error) {
			if (error) {
				console.log('Airtable Error:', error);
				return reject({
					status: 'failed',
					error,
				});
			}
			return resolve({
				status: 'success',
				type: 'getReferralConsultations',
				payload: consultations,
			})
		});
	})
};