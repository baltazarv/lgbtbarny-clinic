/** Functions that are specific to the AirTable db schema.
 *  Select options in react-select component in format:
 *    [{ label: "Alligators", value: 1 }].
 */
import * as lawTypeData from './lawTypeData';

// format type of law state into select options
export const getLawTypeSelectOptions = (arr) => {
	return arr.reduce((acc, curr) => {
		return [...acc, { value: curr.id, label: curr[lawTypeData.NAME] }]
	}, []);
}

/**
 * Given pulldown selected object(s) from a pulldown (w/ `value` key),
 * get full AirTable record(s) (w/ `id' key)
 */
export const getRecordsFromSelection = (selection, recordsIn) => {
	if (!selection) return [];
	let recordsOut = [];
	let selectArray = [];
	// if selection is not an array, push into one
	if (Array.isArray(selection)) {
		selectArray = selection;
	} else {
		selectArray.push(selection);
	}
	if (selectArray.length > 0) {
		selectArray.forEach(opt => {
			const recFound = recordsIn.find(rec => {
				return rec.id === opt.value;
			})
			recordsOut = [...recordsOut, recFound];
		});
	}
	return recordsOut;
}

export const recordForUpdate = data => {
	let fields = objectWithoutProps(data, ['id']);
	let payload = {};
	payload.fields = fields;
	payload.id = data.id;
	return payload;
}

// utility function

const objectWithoutProps = (obj, keys) => {
	var target = {};
	for (var i in obj) {
		if (keys.indexOf(i) >= 0) continue;
		if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
		target[i] = obj[i];
	}
	return target;
}
