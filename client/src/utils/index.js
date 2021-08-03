export const objectIsEmpty = (obj) => {
	// E6 way
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const isoToStandardDate = isoDate => {
	let date = new Date(isoDate);
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(-2);
}