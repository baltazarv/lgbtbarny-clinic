import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

import * as peopleFields from '../../data/peopleFields';
// move constants to client/src/data?
const PEOPLE_TABLE = 'People';
const INQUIRERS_VIEW = 'Inquirers';
const LAWYERS_VIEW = 'Lawyers';

// async action creators

export const getLawyers = () => {
	return dispatch => {
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
				lawyers.push({
					id: record.id,
					firstName: record.get(peopleFields.FIRST_NAME),
					middleName: record.get(peopleFields.MIDDLE_NAME),
					lastName: record.get(peopleFields.LAST_NAME),
					otherNames: record.get(peopleFields.OTHER_NAMES),
				});
			});
			fetchNextPage(); // next 100
		}, function done(err, records) {
			if (err) {
				console.log('Airtable Error: ', err);
				// dispatch(fetchLawyersFailed())
				return;
			}
			dispatch(initLawyers(lawyers))
		});
	}
}

export const getInquirers = () => {
	return dispatch => {
		let inquirers = [];
		airtableBase(PEOPLE_TABLE).select({
			view: INQUIRERS_VIEW,
			fields: [
				peopleFields.FIRST_NAME,
				peopleFields.MIDDLE_NAME,
				peopleFields.LAST_NAME,
				peopleFields.OTHER_NAMES,
				peopleFields.PRONOUNS,
				peopleFields.EMAIL,
				peopleFields.INCOME,
				peopleFields.INTAKE_NOTES,
				peopleFields.REPEAT_VISIT,
				peopleFields.CONSULTATIONS
			],
			// filterByFormula: 'OR(NOT({First Name} = ""), NOT({Last Name} = ""))'
			// filterByFormula: 'Type = "Inquirer"'
		}).eachPage(function page(records, fetchNextPage) {
			records.forEach(function (record) {
				inquirers.push({
					id: record.id,
					firstName: record.get(peopleFields.FIRST_NAME),
					middleName: record.get(peopleFields.MIDDLE_NAME),
					lastName: record.get(peopleFields.LAST_NAME),
					otherNames: record.get(peopleFields.OTHER_NAMES),
					email: record.get(peopleFields.EMAIL),
					pronouns: record.get(peopleFields.PRONOUNS),
					income: record.get(peopleFields.INCOME),
					intakeNotes: record.get(peopleFields.INTAKE_NOTES),
					repeatVisit: record.get(peopleFields.REPEAT_VISIT),
					consultations: record.get(peopleFields.CONSULTATIONS)
				});
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

// sync action creators

export const initLawyers = lawyers => {
	return {
		type: actionTypes.INIT_LAWYERS,
		lawyers
	}
}

export const initInquirers = inquirers => {
	return {
		type: actionTypes.INIT_INQUIRERS,
		inquirers
	}
}

export const setCurrentInquirers = currentInquirers => {
	return {
		type: actionTypes.SET_CURRENT_INQUIRERS,
		currentInquirers
	}
}