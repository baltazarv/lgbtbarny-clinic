// AirTable field names
// these vars and local vars used on `/client/src/components/forms/VisitorAddForm.js`
export const REPEAT_VISIT = 'Repeat Visit?'; // TO-DO: set
export const FIRST_NAME = 'First Name';
export const MIDDLE_NAME = 'Middle Name';
export const LAST_NAME = 'Last Name';
export const OTHER_NAMES = 'Other Names';
export const EMAIL = 'Email';
export const PHONE = 'Phone Number';
export const ADDRESS = 'Home Address';
export const GENDER = 'Gender and/or Sexuality';
// pronouns
export const PRONOUNS = 'Gender Pronouns';
export const PRONOUNS_THEY = 'They/Them/Theirs';
export const PRONOUNS_SHE = 'She/Her/Hers';
export const PRONOUNS_HE = 'He/Him/His';
export const PRONOUNS_OTHER = 'Other';
// income
export const INCOME = 'Annual Household Income';
export const INCOME_UNDER_20K = 'Under 20,000 Dollars';
export const INCOME_20K = '20,000 - 40,000 Dollars';
export const INCOME_40K = '40,000 - 60,000 Dollars';
export const INCOME_60K = '60,000 to 80,000 Dollars';
export const INCOME_80K = '80,000 - 100,000 Dollars';
export const INCOME_100K = '100,000+ Dollars';
export const INCOME_UNEMPLOYED = 'Unemployed';
export const INCOME_UNABLE = 'Unable To Work';
export const INCOME_NO_ANSWER = 'Decline To Answer';
export const INTAKE_NOTES = 'Intake Notes';
//terms
export const TERMS = 'Acknowledgment';
export const TERMS_AGREE = 'I understand and agree to the terms and conditions of the clinic.';
export const SIGNATURE = 'Digital Signature';
export const CONSULTATIONS = 'Consultations';

// when data is fetched from `/client/src/store/actions/people.js`, vars from DB are saved to local vars
export const local = {
	REPEAT_VISIT: 'repeat',
	FIRST_NAME: 'firstName',
	MIDDLE_NAME: 'middleName',
	LAST_NAME: 'lastName',
	OTHER_NAMES: 'otherNames',
	EMAIL: 'email',
	PHONE: 'phone',
	ADDRESS: 'address',
	GENDER: 'gender',
	PRONOUNS: 'pronouns',
	INCOME: 'income',
	INTAKE_NOTES: 'notes',
	TERMS: 'terms',
	SIGNATURE: 'signature',
	CONSULTATIONS: 'consultations',
}
