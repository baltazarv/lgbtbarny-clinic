import * as actionTypes from '../actions/actionTypes';

const initialState = {
	consultations: {},
}

const reducer = (state = initialState, action) => {
	let consultations = null
	switch (action.type) {
		// { action.consultations }
		case actionTypes.INIT_CONSULTATIONS:
			return {
				...state,
				consultations: { ...action.consultations },
			}

		// { action.consultation }
		case actionTypes.CONSULTATION_CREATED:
			consultations = { ...state.consultations }
			consultations[action.consultation.id] = { ...action.consultation }
			return {
				...state,
				consultations,
			}

		// { action.consultation } // aray or object
		case actionTypes.CONSULTATION_UPDATED:
			consultations = {}
			for (var key in state.consultations) {
				if (key !== Object.keys(action.consultation)[0]) {
					consultations[key] = state.consultations[key]
				} else {
					consultations[key] = action.consultation[key]
				}
			}
			return {
				...state,
				consultations,
			}

		// { action.id }
		case actionTypes.CONSULTATION_DELETED:
			consultations = {}
			for (const id in state.consultations) {
				if (id !== action.id) {
					consultations[id] = state.consultations[id]
				}
			}
			return {
				...state,
				consultations,
			}
		default:
			return state
	}
}

export default reducer
