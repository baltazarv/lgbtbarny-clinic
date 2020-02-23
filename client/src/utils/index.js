export const objectIsEmpty = (obj) => {
	for(var key in obj) {
			if(obj.hasOwnProperty(key))
					return false;
	}
	return true;
}

export const isoToStandardDate = isoDate => {
	let date = new Date(isoDate);
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(-2);
}
