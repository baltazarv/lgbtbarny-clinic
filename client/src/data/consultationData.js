import React from 'react';
import { Tag } from 'antd';
import * as consultFields from './consultionFields';

export const TABLE = 'Consultations';

const DISPO_FEE_BASED_COLOR = 'cyan';
const DISPO_PRO_BONO_COLOR = 'blue';
const DISPO_COMPELLING_COLOR = 'magenta';
const DISPO_IMMIGRATION_COLOR = 'volcano';

// export const statuses = [
// 	consultFields.STATUS_REFER,
// 	consultFields.STATUS_REFERRED,
// 	consultFields.STATUS_POSSIBLE_IMPACT,
// 	consultFields.STATUS_IMPACT_CONSIDERED,
// ];

export const statuses = [
	{ group: 'Referral', value: consultFields.STATUS_REFER, text: 'Needed' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRED, text: 'Made' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRAL_NOT_PICKED_UP, text: 'Not Picked Up' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRAL_PICKED_UP, text: 'Picked Up' },
	{ group: 'Impact', value: consultFields.STATUS_POSSIBLE_IMPACT, text: 'Possible' },
	{ group: 'Impact', value: consultFields.STATUS_IMPACT_CONSIDERED, text: 'Considered' },
];

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
				if (dispo === consultFields.DISPOSITIONS_IMMIGRATION) return true;
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

// display short names for dispositions

export const dispoShortNames = {
	[consultFields.DISPOSITIONS_FEE_BASED]: "Fee-based",
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Impact",
	[consultFields.DISPOSITIONS_IMMIGRATION]: "Immigration",
	[consultFields.DISPOSITIONS_NO_FURTHER]: "Info given",
}

// given an array
export const getDispoShortNames = dispos => {
	if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
	return [];
}

// given a fields object with a long-name Disposition
// and given a, sometimes empty, Status
// return non-empty Status
export const getStatusForEmptyShortName = object => {
	const statusField = object[consultFields.STATUS];
	const dispoField = dispoShortNames[object[consultFields.DISPOSITIONS]];
	// fee-base or pro-bono => reference needed
	if (!statusField && (dispoField === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED] || dispoField === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO])) {
		return consultFields.STATUS_REFER;
	}
	// compelling => high impact
	if (!statusField && (dispoField === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING] || dispoField === dispoShortNames[consultFields.DISPOSITIONS_IMMIGRATION])) {
		return consultFields.STATUS_POSSIBLE_IMPACT;
	}
	if (!statusField && dispoField === dispoShortNames[consultFields.DISPOSITIONS_NO_FURTHER]) {
		return 'Nothing Further';
	}
	// no further action
	return object[consultFields.STATUS];
}

// given an array of Dispostion short names, get antd Tag components
export const getDispoTagsFromShortNames = dispos => {
	return <span>
		{dispos.map((dispo, index) => {
			let color = '#8c8c8c';
			if (dispo === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED]) color = DISPO_FEE_BASED_COLOR;
			if (dispo === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]) color = DISPO_PRO_BONO_COLOR;
			if (dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING]) color = DISPO_COMPELLING_COLOR;
			if (dispo === dispoShortNames[consultFields.DISPOSITIONS_IMMIGRATION]) color = DISPO_IMMIGRATION_COLOR;
			return (
				<Tag color={color} key={index}>
					{dispo}
				</Tag>
			);
		})}
	</span>
}

// given an array of long-name dispositions
// return either long- or short-name Tag
export const getDispoTags = (dispos, returnShortName = false) => {
	return <span>
		{dispos.map((dispo) => {
			return getDispoTag(dispo, returnShortName);
		})}
	</span>
}

export const getDispoTag = (dispo, returnShortName = false) => {
	let color = '#8c8c8c';
	if (dispo === consultFields.DISPOSITIONS_FEE_BASED) color = DISPO_FEE_BASED_COLOR;
	if (dispo === consultFields.DISPOSITIONS_PRO_BONO) color = DISPO_PRO_BONO_COLOR;
	if (dispo === consultFields.DISPOSITIONS_COMPELLING) color = DISPO_COMPELLING_COLOR;
	if (dispo === consultFields.DISPOSITIONS_IMMIGRATION) color = DISPO_IMMIGRATION_COLOR;
	return (
		<Tag color={color} key={dispo}>
			{returnShortName ? dispoShortNames[dispo] : dispo}
		</Tag>
	);
}