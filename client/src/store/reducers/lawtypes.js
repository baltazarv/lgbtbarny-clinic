import * as actionTypes from '../actions/actionTypes';

const initialState = {
	lawTypes: [],
	lawTypesObject: {},
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT_LAW_TYPES:
			return {
				...state,
				lawTypes: action.lawTypes[0],
				lawTypesObject: action.lawTypes[1],
			}
			default:
				return state;
	}
}

export default reducer;
