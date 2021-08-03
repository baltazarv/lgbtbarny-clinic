import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import peopleReducer from './reducers/people';
import consultReducer from './reducers/consultations';
import lawTypeReducer from './reducers/lawtypes';

const rootReducer = combineReducers({
	people: peopleReducer,
	consultations: consultReducer,
	lawTypes: lawTypeReducer,
})

// Chrome Redux DevTools store setup

const composeEnhancers =
	typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		}) : compose;

const enhancer = composeEnhancers(
	applyMiddleware(thunk),
	// other store enhancers if any
);
const store = createStore(rootReducer, enhancer);

// const store = createStore(rootReducer, applyMiddleware(thunk))

export default store;
