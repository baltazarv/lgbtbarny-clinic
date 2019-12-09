import * as actionTypes from '../actions/actionTypes';

const initialState = {
	consultSubmitStatus: {
		status: 'in-progress',
		payload: null,
	},
	consultsCreated: [],
	currInqsPastConsults: [],
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SET_CURR_INQS_PAST_CONSULTS:
			return {
				...state,
				currInqsPastConsults: action.currInqsPastConsults,
			}
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
		default:
			return state;
	}
}

export default reducer;
