import React from "react"
import { createTask } from "../../model/task"
import { Dispatch } from "redux"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../store"
import { TasksStoreAction } from "../../store/tasksStore"
import { getTaskLink } from "../pages/TaskPage"
import { useHistory } from "react-router-dom"

export function AddTaskButton() {

	const currentUserId = useSelector((state: RootState) => state.user.userId)
	const dispatch: Dispatch<TasksStoreAction> = useDispatch()
	const history = useHistory()

	const onAddTaskClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		
		event.preventDefault()
		
		if (currentUserId) {
			const task = createTask(currentUserId, "")
			dispatch({type: "tasks-new-task", task})
			history.push(getTaskLink(task.id))
		}
	}
	
	if(!currentUserId)
		return null

	return (
		<a href="#new-task" onClick={(e) => onAddTaskClick(e)}>
			Add Task
		</a>
	)
}