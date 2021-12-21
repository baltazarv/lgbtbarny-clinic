import React from 'react';
import { Tag } from 'antd';
import * as consultFields from './consultFields';

const TABLE = 'Consultations';

const DISPO_FEE_BASED_COLOR = 'cyan';
const DISPO_PRO_BONO_COLOR = 'blue';
const DISPO_COMPELLING_COLOR = 'magenta';
const DISPO_IMMIGRATION_COLOR = 'volcano';

/** STATUSES */

const statuses = [
	{ group: 'Referral', value: consultFields.STATUS_REFER, text: 'Needed Referral' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRED, text: 'Made Referral' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRAL_NOT_PICKED_UP, text: 'Not Picked Up' },
	{ group: 'Referral', value: consultFields.STATUS_REFERRAL_PICKED_UP, text: 'Picked Up' },
	{ group: 'Impact', value: consultFields.STATUS_POSSIBLE_IMPACT, text: 'Possible' },
	{ group: 'Impact', value: consultFields.STATUS_IMPACT_CONSIDERED, text: 'Considered' },
]

// given a fields object with a long-name Disposition
// and given a, sometimes empty, Status
// return non-empty Status
const getStatusForEmptyShortName = object => {
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

/** DISPOSITIONS */

// given consultations as an object, return object with only referral-eligible consultations
const filterEligibleConsultations = consultations => {
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
	}
	return eligible;
}

// display short names for dispositions

const dispoShortNames = {
	[consultFields.DISPOSITIONS_FEE_BASED]: "Fee-based",
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Impact",
	[consultFields.DISPOSITIONS_IMMIGRATION]: "Immigration",
	[consultFields.DISPOSITIONS_NO_FURTHER]: "Info given",
}

// given an array
const getDispoShortNames = dispos => {
	if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
	return [];
}

// given a dispostion short name, get the long name that can be saved to Airtable
const getDispoLongNames = (shortName) => {
	let name = shortName
	for (const key in dispoShortNames) {
		if (dispoShortNames[key] === shortName) name = key
	}
	return name
}

const hotlineDispositions = [
	'No answer',
	'Sent follow-up email',
	'Left voicemail',
	'Spoke with inquirer',
	'Plans to attend Clinic',
	'Referred',
]

// options for antd table editable cell
const getHotlineDispoOptions = () => {
	const options = hotlineDispositions.map((dispo) => {
		return { value: dispo, text: dispo }
	})
	return options
}

// given an array of Dispostion short names, get antd Tag components
const getDispoTagsFromShortNames = dispos => {
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
const getDispoTags = (dispos, returnShortName = false) => {
	return <span>
		{dispos.map((dispo) => {
			return getDispoTag(dispo, returnShortName);
		})}
	</span>
}

const getDispoTag = (dispo, returnShortName = false) => {
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


/** TYPES */

const hotlineTypes = [
	consultFields.TYPE_PHONE,
	consultFields.TYPE_EMAIL,
	consultFields.TYPE_ONLINE,
]

export {
	TABLE,
	// status
	statuses,
	// dispositions
	filterEligibleConsultations,
	dispoShortNames,
	getDispoShortNames,
	getDispoLongNames,
	hotlineDispositions,
	getHotlineDispoOptions,
	getStatusForEmptyShortName,
	getDispoTagsFromShortNames,
	getDispoTags,
	getDispoTag,
	// types
	hotlineTypes,
}