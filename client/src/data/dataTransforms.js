/** Functions that are specific to the AirTable db schema.
 *  Select options in react-select component in format:
 *    [{ label: "Alligators", value: 1 }].
 */
import * as peopleFields from './peopleFields';
import * as lawTypeData from './lawTypeData';

// format data from people table into react-select options
export const getPeopleIntoSelectOptions = (arr) => {
	return arr.reduce((options, item) => {
		if (item[peopleFields.FIRST_NAME] || item[peopleFields.LAST_NAME]) {
			const inqObj = {
				value: item.id,
				label: formatName(item),
			}
			return [...options, inqObj]
		} else {
			return options;
		}
	}, []);
}

// format type of law state into select options
export const getLawTypeSelectOptions = (arr) => {
	return arr.reduce((acc, curr) => {
		return [...acc, { value: curr.id, label: curr[lawTypeData.NAME] }]
	}, []);
}

export const formatName = inquirer => {
	const firstName = inquirer[peopleFields.FIRST_NAME];
	const middleName = inquirer[peopleFields.MIDDLE_NAME];
	const otherNames = inquirer[peopleFields.OTHER_NAMES];
	const lastName = inquirer[peopleFields.LAST_NAME];
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName[0] : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' "' + otherNames + '"' : '');
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

const objectWithoutProps = (obj, keys) => {
	var target = {};
	for (var i in obj) {
		if (keys.indexOf(i) >= 0) continue;
		if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
		target[i] = obj[i];
	}
	return target;
}
