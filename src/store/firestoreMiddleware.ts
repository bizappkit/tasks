import { Dispatch } from "redux"
import { TasksStoreAction } from "./taskActions"
import { updateTask, insertTask, deleteTask } from "../sync";


export function firestoreMiddleware() {
	return function (next: Dispatch) {
		return function (action: TasksStoreAction | {}) {

			if ("type" in action) {
				switch (action.type) {
					case "tasks-updated":
						updateTask(action.taskId, action.payload)
						break

					case "tasks-new-task":
						insertTask(action.task)
						break

					case "tasks-delete":
						deleteTask(action.task.id)
						break

					//todo: Move to DeleteConfirmationMiddleware
					// const timeout = setTimeout(() => {
					// 	next(ToastActions.hide())
					// }, 5000)

					// next(ToastActions.show("Task is deleted", () => {
					// 		clearTimeout(timeout)
					// 		next(TaskActions.restore(task))
					// 		next(ToastActions.hide())
					// 	}
					// ))
				}
			}

			return next(action as any)
		}
	}
}