import * as actionTypes from '../actions/actionTypes';

const initialState = {
	clinicSettings: {},
	currentClinic: 'tuesday',
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SET_CLINIC_SETTINGS:
			return {
				...state,
				clinicSettings: action.clinicSettings
			}
		case actionTypes.SET_CURRENT_CLINIC:
			return {
				...state,
				currentClinic: action.currentClinic
			}
		default:
			return state;
	}
}

export default reducer;