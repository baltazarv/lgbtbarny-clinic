import * as actionTypes from '../actions/actionTypes';

const initialState = {
	consultations: {},
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT_CONSULTATIONS:
			return {
				...state,
				consultations: action.consultations,
			}
		case actionTypes.CONSULTATION_UPDATED:
			let consultations = {};
			for (var key in state.consultations) {
				if (key !== Object.keys(action.consultation)[0]) {
					consultations[key] = state.consultations[key];
				} else {
					consultations[key] = action.consultation[key];
				}
			}
			return {
				...state,
				consultations,
			}
		default:
			return state;
	}
}

export default reducer;
