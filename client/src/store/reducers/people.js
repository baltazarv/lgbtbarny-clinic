import * as actionTypes from '../actions/actionTypes';
import { getPeopleIntoSelectOptions } from '../../data/dataTransforms';

const initialState = {
	inquirers: [],
	currentInquirers: [], // maybe should save in component state
	lawyers: [],
	currentLawyers: [], // not sure if necessary
	// REMOVE!
	lawyerSelectOptions: [],
	inqSelectOptions: [],
	lawTypeOptions: [],
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT_LAWYERS:
			return {
				...state,
				lawyers: action.lawyers,
				// REMOVE!
				lawyerSelectOptions: getPeopleIntoSelectOptions(action.lawyers),
			}
		case actionTypes.ADD_LAWYER:
			return {
				...state,
				lawyers: [...state.lawyers, action.lawyer],
				// REMOVE!
				lawyerSelectOptions: [...state.lawyerSelectOptions, ...getPeopleIntoSelectOptions([action.lawyer])],
			}
		case actionTypes.INIT_INQUIRERS:
			return {
				...state,
				inquirers: action.inquirers,
			}
		case actionTypes.ADD_INQUIRER:
			return {
				...state,
				inquirers: [...state.inquirers, action.inquirer],
			}
		// REMOVE!
		case actionTypes.SET_CURRENT_INQUIRERS:
			return {
				...state,
				currentInquirers: action.currentInquirers
			}
		case actionTypes.UPDATE_INQUIRERS:
			const updatedInquirers = state.inquirers.map(rec => {
				if (rec.id === action.inquirer.id) {
					return { ...rec, ...action.inquirer }
				}
				return rec;
			})
			return {
				...state,
				inquirers: updatedInquirers,
			}
		default:
			return state;
	}
}

export default reducer;
