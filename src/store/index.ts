import { combineReducers, createStore, applyMiddleware } from "redux"
import { tasksReducer } from "./tasksStore"
import { userReducer } from "./userStore"
import { firestoreMiddleware } from "./firestoreMiddleware";


const rootReducer = combineReducers({
	tasks: tasksReducer,
	user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>

export function configureStore() {
	return createStore(
		rootReducer, 
		applyMiddleware(
			firestoreMiddleware
		)
	)
}
