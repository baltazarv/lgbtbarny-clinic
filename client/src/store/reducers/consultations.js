import * as actionTypes from '../actions/actionTypes';

const initialState = {
	// consultations: [],
	consultSubmitStatus: {
		status: 'in-progress',
		payload: null,
	},
	consultsCreated: []
}

// maybe use for later // is there a need to get all consultations?
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CONSULTATION_CREATED:
			return {
				...state,
				consultSubmitStatus: {
					status: 'success',
					payload: action.newConsultation,
				},
				consultsCreated: [...state.consultsCreated, action.newConsultation]
			}
		case actionTypes.CONSULTATION_IN_PROGRESS:
			return {
				...state,
				consultSubmitStatus: {
					status: 'in-progress',
					payload: null
				}
			}
		// case actionTypes.INIT_CONSULTATIONS:
		// 	return {
		// 		...state,
		// 		consultations: action.consultations
		// 	}
		default:
			return state;
	}
}

export default reducer;