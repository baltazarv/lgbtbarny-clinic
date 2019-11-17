import * as actionTypes from '../actions/actionTypes';

const initialState = {
	lawTypes: []
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT_LAW_TYPES:
			return {
				...state,
				lawTypes: action.lawTypes
			}
			default:
				return state;
	}
}

export default reducer;
