import * as actionTypes from './actionTypes';
import airtableBase from '../../airtableBase';
import { LAW_TYPES_TABLE, NAME } from '../../data/lawTypeData';

// async action creators

export const getLawTypes = () => {
	return dispatch => {
		let lawTypesArray = [];
		let lawTypesObject = {};
		airtableBase(LAW_TYPES_TABLE).select().eachPage(function page(records, fetchNextPage) {
			records.forEach(record => {
				// array
				const _record = {}
				_record[NAME] = record.fields[NAME];
				_record.id = record.id;
				lawTypesArray.push(_record);
				// object
				lawTypesObject[record.id] = record.fields;
			});
			fetchNextPage();
		}, function done(err) {
			if (err) {
				console.error(err);
				// dispatch(fetchInquirersFailed())
				return;
			}
			const lawTypes = [lawTypesArray, lawTypesObject]
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
