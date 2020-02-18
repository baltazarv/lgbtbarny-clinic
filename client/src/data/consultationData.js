import * as consultFields from './consultionFields';

// database item names

export const TABLE = 'Consultations';

// fetch functions

// given consultations as an object, return object with only referral-eligible consultations
export const filterEligibleConsultations = consultations => {
	const eligible = {};
	for (var key in consultations) {
		const fields = consultations[key];
		let dispoHasEligible = false;
		if (fields[consultFields.DISPOSITIONS]) {
			dispoHasEligible = fields[consultFields.DISPOSITIONS].some(dispo => {
				if (dispo === consultFields.DISPOSITIONS_FEE_BASED) return true;
				if (dispo === consultFields.DISPOSITIONS_PRO_BONO) return true;
				if (dispo === consultFields.DISPOSITIONS_COMPELLING) return true;
				return false;
			})
		}
		if (dispoHasEligible) {
			eligible[key] = consultations[key];
		}
		// eligible = Object.assign(eligible, consultations[key]);
	}
	return eligible;
}
