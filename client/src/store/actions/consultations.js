import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

import * as consultFields from '../../data/consultionFields';
const TABLE = 'Consultations';

// async action creators

export const getCurrInqPastConsults = inqs => {
	return dispatch => {
		const consultIds = inqs.reduce((acc, inq) => {
			if (inq.consultations && inq.consultations.length) {
				return [...acc, ...inq.consultations]
			}
			return acc;
		}, []);
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
		const consultations = [];
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
			records.forEach(rec => {
				consultations.push({
					id: rec.id,
					name: rec.get(consultFields.NAME),
					date: rec.get(consultFields.DATE),
					lawyers: rec.get(consultFields.LAWYERS),
					inquirers: rec.get(consultFields.INQUIRERS),
					situation: rec.get(consultFields.SITUATION),
					dispositions: rec.get(consultFields.DISPOSITIONS),
					summary: rec.get(consultFields.REF_SUMMARY),
					lawTypes: rec.get(consultFields.LAW_TYPES),
					status: rec.get(consultFields.STATUS),
				});
			})
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.log('Airtable Error: ', err);
				return;
			}
			dispatch(setCurrInqPastConsults(consultations));
		})
	}
}

export const createConsultation = submitFields => {
	return dispatch => {
		airtableBase(TABLE).create([{
			fields: submitFields
		}], function (err, records) {
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

export const setCurrInqPastConsults = currInqsPastConsults => {
	return {
		type: actionTypes.SET_CURR_INQS_PAST_CONSULTS,
		currInqsPastConsults,
	}
}

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