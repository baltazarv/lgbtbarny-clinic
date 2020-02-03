import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
import { LAW_TYPES_TABLE, NAME } from '../../data/lawTypeData';

// async action creators

export const getLawTypes = () => {
	return dispatch => {
		let lawTypes = [];
		airtableBase(LAW_TYPES_TABLE).select().eachPage(function page(records, fetchNextPage) {
			records.forEach(record => {
				const _record = {}
				_record[NAME] = record.fields[NAME];
				_record.id = record.id;
				lawTypes.push(_record);
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
