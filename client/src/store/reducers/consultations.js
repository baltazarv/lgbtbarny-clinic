// import * as actionTypes from '../actions/actionTypes';

const initialState = {
	// maybe rename `createConsultationStatus`
	// consultSubmitStatus: {
	// 	status: 'in-progress',
	// 	payload: null,
	// },
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		// case actionTypes.CONSULTATION_CREATED:
		// 	return {
		// 		...state,
		// 		consultSubmitStatus: {
		// 			status: 'success',
		// 			payload: action.newConsultation,
		// 		},
		// 		// consultsCreated: [...state.consultsCreated, action.newConsultation]
		// 	}
		// case actionTypes.CONSULTATION_IN_PROGRESS:
		// 	return {
		// 		...state,
		// 		consultSubmitStatus: {
		// 			status: 'in-progress',
		// 			payload: null
		// 		}
		// 	}
		default:
			return state;
	}
}

export default reducer;
