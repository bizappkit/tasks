import { combineReducers } from "redux"
import { taskListReducer } from "./tasksStore"
import { userReducer } from "./userStore"


export const rootReducer = combineReducers({
	taskList: taskListReducer,
	user: userReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>