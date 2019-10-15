import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

import * as peopleFields from '../../data/peopleFields';
import * as consultFields from '../../data/consultionFields';
const PEOPLE_TABLE = 'People';
const INQUIRERS_VIEW = 'Inquirers';
const LAWYERS_VIEW = 'Lawyers';
const CONSULT_TABLE = 'Consultations';

// async action creators

export const getLawyers = () => {
	return dispatch => {
		let lawyers =[];
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

// check for expanded consultation info on inquirers
//	adds property if missing
export const initCurrentInquirers = inqs => {
	return dispatch => {
		// if expanded consultation info already added to all inquirers, init inquirers
		const hasConsultations = inqs.every(inq => {
			return (inq.consultations && inq.consultationsExp);
		})
		if (hasConsultations) {
			dispatch(setCurrentInquirers(inqs));
			return;
		}

		// else get consultation rec id
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
		airtableBase(CONSULT_TABLE).select({
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
			if(err) {
				console.log('Airtable Error: ', err);
				return;
			}

			// for each inquirer add expanded consultation property
			const inqsWithConsult = inqs.map(inq => {
				let inqWithConsult = null;
				if (inq.consultations && inq.consultations.length > 0) {
					inqWithConsult = inq.consultations.map(inqConsultId => {
						return consultations.find(consult => {
							return inqConsultId === consult.id;
						})
					});
					inq.consultationsExp = inqWithConsult;
				}
				return inq;
			});
			dispatch(setCurrentInquirers(inqsWithConsult));
		})
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
