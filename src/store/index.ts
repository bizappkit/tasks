import { combineReducers, createStore, applyMiddleware } from "redux"
import { taskListReducer } from "./tasksStore"
import { userReducer } from "./userStore"
import { firestoreMiddleware } from "./firestoreMiddleware";


const rootReducer = combineReducers({
	taskList: taskListReducer,
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
