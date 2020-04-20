import { Dispatch} from "redux"
import { TasksStoreAction } from "./tasksStore"
import { updateTask, insertTask } from "../sync";


export function firestoreMiddleware() {
	return function (next: Dispatch) {
		return function (action: TasksStoreAction | {}) {

			if ("type" in action) {
				if (action.type === "tasks-updated")
					updateTask(action.taskId, action.payload)
				if (action.type === "tasks-new-task")
					insertTask(action.task)
			}

			return next(action as any)
		}
	}
}