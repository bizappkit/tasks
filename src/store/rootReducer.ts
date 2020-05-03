import { combineReducers } from "redux"
import { tasksReducer } from "./tasksReducer"
import { userReducer } from "./userReducer"
import { mainButtonReducer } from "./mainButtonStore";


export const rootReducer = combineReducers({
	taskList: tasksReducer,
	user: userReducer,
	mainButton: mainButtonReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>