import { Dispatch, MiddlewareAPI } from "redux"
import { TasksStoreAction } from "./tasksActions"
import { subscribeToTasks, updateTask, insertTask, deleteTask, unionArrayValues, removeArrayValues } from "../sync";
import { RootReducerType } from "./rootReducer";
import i18n from "../model/localization";


export function firestoreMiddleware(api: MiddlewareAPI<any, RootReducerType>) {

	let unsubscribeToTaskList: () => void | undefined

	return function (next: Dispatch<TasksStoreAction>) {
		return function (action: TasksStoreAction | {}) {

			if ("type" in action) {
				switch (action.type) {

					case "tasks-start-loading":

						if (unsubscribeToTaskList !== undefined) unsubscribeToTaskList()

						const state = api.getState()

						if (state.user.userId) {
							console.log("Subscribe to Tasks with filter:", state.taskList.filter)
							unsubscribeToTaskList = subscribeToTasks(action.filter,
								docs => next({ type: "tasks-loaded", tasks: docs }))
						} else {
							next({ type: "tasks-loading-error", error: i18n.t("User is not authenticated") })
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

					case "tasks-add-relations":
						unionArrayValues(action.parent.id, action.relation, [action.child.id])
						break

					case "tasks-remove-relations":
						removeArrayValues(action.parent.id, action.relation, [action.child.id])
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