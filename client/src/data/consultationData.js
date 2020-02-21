import React from 'react';
import { Tag } from 'antd';
import * as consultFields from './consultionFields';

// database item names

export const TABLE = 'Consultations';

const DISPO_FEE_BASED_COLOR = 'cyan';
const DISPO_PRO_BONO_COLOR = 'blue';
const DISPO_COMPELLING_COLOR = 'magenta';
const DISPO_IMMIGRATION_COLOR = 'volcano';

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
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro Bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Highly Compelling",
	[consultFields.DISPOSITIONS_IMMIGRATION]: "Immigration",
}

// given an array
export const getDispoShortNames = dispos => {
	if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
	return [];
}

// given a fields object with a long-name Disposition
// and the Status to fill in any empty Dispositons for eligible cases
// return non-empty status
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

// given an array of long-name dispositions, return short-name Tag
export const getDispoTags = (dispos, isShortName = false) => {
	return <span>
		{dispos.map((dispo, index) => {
			let color = '#8c8c8c';
			if (dispo === consultFields.DISPOSITIONS_FEE_BASED) color = DISPO_FEE_BASED_COLOR;
			if (dispo === consultFields.DISPOSITIONS_PRO_BONO) color = DISPO_PRO_BONO_COLOR;
			if (dispo === consultFields.DISPOSITIONS_COMPELLING) color = DISPO_COMPELLING_COLOR;
			if (dispo === consultFields.DISPOSITIONS_IMMIGRATION) color = DISPO_IMMIGRATION_COLOR;
			return (
				<Tag color={color} key={index}>
					{isShortName ? dispoShortNames[dispo] : dispo}
				</Tag>
			);
		})}
	</span>
}