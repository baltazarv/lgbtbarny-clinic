import * as consultFields from './consultionFields';
import * as peopleFields from './peopleFields';
import airtableBase from '../airtableBase';

// database item names

export const TABLE = 'Consultations';

// fetch functions

// consultations is an object
export const filterEligibleConsultations = consultations => {
	const eligible = {};
	for (var key in consultations) {
		const fields = consultations[key];
		let dispoHasEligible = false;
		if (fields[consultFields.DISPOSITIONS]) {
			dispoHasEligible = fields[consultFields.DISPOSITIONS].some(dispo => {
				if (dispo === consultFields.DISPOSITIONS_FEE_BASED) return true;
				if (dispo === consultFields.DISPOSITIONS_PRO_BONO) return true;
				if (dispo === consultFields.DISPOSITIONS_COMPELLING) return true;
				return false;
			})
		}
		if (dispoHasEligible) {
			eligible[key] = consultations[key];
		}
		// eligible = Object.assign(eligible, consultations[key]);
	}
	return eligible;
}

// TO DO: get rid of functions below

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