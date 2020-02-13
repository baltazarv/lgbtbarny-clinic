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
		default:
			return state;
	}
}

export default reducer;
