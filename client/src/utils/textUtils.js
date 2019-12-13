export const formatInquirerName = inquirer => {
	const firstName = inquirer.firstName;
	const middleName = inquirer.middleName;
	const otherNames = inquirer.otherNames;
	const lastName = inquirer.lastName;
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' (' + otherNames + ')' : '')
}
