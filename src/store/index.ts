import { combineReducers, createStore } from "redux";
import { tasksReducer } from "./tasksStore";

const rootReducer = combineReducers({
	tasks: tasksReducer
})

export type RootState = ReturnType<typeof rootReducer>

export function configureStore() {
	return createStore(rootReducer);
}