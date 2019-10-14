import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';

const LAW_TYPES_TABLE = 'Type Of Law';
const LAW_TYPES_RECORD = 'Name';

// async action creators

export const getLawTypes = () => {
	return dispatch => {
		let lawTypes = [];
		airtableBase(LAW_TYPES_TABLE).select().eachPage(function page(records, fetchNextPage) {
			records.forEach(function (record) {
				// console.log('Retrieved', record.get('Name'));
				lawTypes.push({
					id: record.id,
					type: record.get(LAW_TYPES_RECORD)
				})
			});
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.error(err);
				// dispatch(fetchInquirersFailed())
				return;
			}
			dispatch(initLawTypes(lawTypes));
		});
	}
}

// sync action creators

export const initLawTypes = lawTypes => {
	return {
		type: actionTypes.INIT_LAW_TYPES,
		lawTypes
	}
}
