import React from "react"
import { createTask } from "../../model/task"
import { Dispatch } from "redux"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../store"
import { TasksStoreAction } from "../../store/tasksActions"
import { getTaskLink } from "../pages/TaskPage"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next";

export function AddTaskButton() {

	const { t } = useTranslation()
	const currentUserId = useSelector((state: RootState) => state.user.userId)
	const dispatch: Dispatch<TasksStoreAction> = useDispatch()
	const history = useHistory()

	const onAddTaskClick = () => {

		//event.preventDefault()

		if (currentUserId) {
			const task = createTask(currentUserId, "")
			dispatch({ type: "tasks-new-task", task })
			history.push(getTaskLink(task.id))
		}
	}

	if (!currentUserId)
		return null

	return (
		<button className="btn btn-primary" onClick={() => onAddTaskClick()}>
			{t("Add Task")}
		</button>
	)
}