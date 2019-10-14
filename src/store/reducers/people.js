import * as actionTypes from '../actions/actionTypes';

const initialState = {
	inquirers: [],
	currentInquirers: [],
	lawyers: [],
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT_INQUIRERS:
			return {
				...state,
				inquirers: action.inquirers
			}
		case actionTypes.SET_CURRENT_INQUIRERS:
			return {
				...state,
				currentInquirers: action.currentInquirers
			}
		case actionTypes.INIT_LAWYERS:
			return {
				...state,
				lawyers: action.lawyers
			}
		default:
			return state;
	}
}

export default reducer;
