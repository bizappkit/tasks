import { combineReducers, createStore } from "redux"
import { tasksReducer } from "./tasksStore"
import { userReducer } from "./userStore"


const rootReducer = combineReducers({
	tasks: tasksReducer,
	user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>

export function configureStore() {
	return createStore(rootReducer);
}