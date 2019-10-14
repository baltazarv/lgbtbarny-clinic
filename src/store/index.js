import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import peopleReducer from './reducers/people';
import consultReducer from './reducers/consultations';
import lawTypeReducer from './reducers/lawtypes';

const rootReducer = combineReducers({
	people: peopleReducer,
	consultations: consultReducer,
	lawTypes: lawTypeReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store;
