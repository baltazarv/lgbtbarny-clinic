import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

import * as peopleFields from '../../data/peopleFields'; //
import { PEOPLE_TABLE, INQUIRERS_VIEW, LAWYERS_VIEW } from '../../data/tableNames';

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
				inquirers.push({
					id: record.id,
					[peopleFields.local.REPEAT_VISIT]: record.get(peopleFields.REPEAT_VISIT),
					[peopleFields.local.FIRST_NAME]: record.get(peopleFields.FIRST_NAME),
					[peopleFields.local.MIDDLE_NAME]: record.get(peopleFields.MIDDLE_NAME),
					[peopleFields.local.LAST_NAME]: record.get(peopleFields.LAST_NAME),
					[peopleFields.local.OTHER_NAMES]: record.get(peopleFields.OTHER_NAMES),
					[peopleFields.local.EMAIL]: record.get(peopleFields.EMAIL),
					[peopleFields.local.PHONE]: record.get(peopleFields.PHONE),
					[peopleFields.local.ADDRESS]: record.get(peopleFields.ADDRESS),
					[peopleFields.local.GENDER]: record.get(peopleFields.GENDER),
					[peopleFields.local.PRONOUNS]: record.get(peopleFields.PRONOUNS),
					[peopleFields.local.INCOME]: record.get(peopleFields.INCOME),
					[peopleFields.local.INTAKE_NOTES]: record.get(peopleFields.INTAKE_NOTES),
					[peopleFields.local.TERMS]: record.get(peopleFields.TERMS),
					[peopleFields.local.SIGNATURE]: record.get(peopleFields.SIGNATURE),
					[peopleFields.local.CONSULTATIONS]: record.get(peopleFields.CONSULTATIONS)
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