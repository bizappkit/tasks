import { combineReducers } from "redux"
import { tasksReducer } from "./tasksReducer"
import { userReducer } from "./userReducer"


export const rootReducer = combineReducers({
	taskList: tasksReducer,
	user: userReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>