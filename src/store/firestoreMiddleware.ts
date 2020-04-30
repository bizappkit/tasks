import { Dispatch, MiddlewareAPI } from "redux"
import { TasksStoreAction } from "./taskActions"
import { subscribeToTasks, updateTask, insertTask, deleteTask } from "../sync";
import { RootReducerType } from "./rootReducer";
import i18n from "../model/localization";


export function firestoreMiddleware(api: MiddlewareAPI<Dispatch<TasksStoreAction>, RootReducerType>) {

	let unsubscribeToTaskList: () => void | undefined
	
	return function (next: Dispatch<TasksStoreAction>) {
		return function (action: TasksStoreAction | {}) {

			if ("type" in action) {
				switch (action.type) {
					case "tasks-start-loading":

						if(unsubscribeToTaskList)
							unsubscribeToTaskList()

						const state = api.getState()

						if(state.user.userId) {
							unsubscribeToTaskList = subscribeToTasks(state.user.userId,
								docs => next({type: "tasks-loaded", tasks: docs}))
						} else {
							next({type: "tasks-loading-error", error: i18n.t("User is not authenticated")})
						}

						break

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