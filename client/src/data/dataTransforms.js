/** Functions that are specific to the AirTable db schema.
 */

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
