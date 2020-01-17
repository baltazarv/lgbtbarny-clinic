/** Functions that are specific to the AirTable db schema.
 *  Select options in react-select component in format:
 *    [{ label: "Alligators", value: 1 }].
 */

// format data from people table into react-select options
export const getPeopleIntoSelectOptions = (arr) => {
	return arr.reduce((options, item) => {
		if (item.firstName || item.lastName) {
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

// people table record full name format
export const formatName = inquirer => {
	const firstName = inquirer.firstName;
	const middleName = inquirer.middleName;
	const otherNames = inquirer.otherNames;
	const lastName = inquirer.lastName;
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' (' + otherNames + ')' : '')
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
	if(Array.isArray(selection)) {
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
