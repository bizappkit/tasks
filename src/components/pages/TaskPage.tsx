import React, { useEffect } from 'react';
import { TaskEdit } from '../task/TaskEdit';
import { useParams, useHistory } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";
import { useRootDispatch, useRootSelector } from '../../store';
import { useTranslation } from 'react-i18next';

export const TaskDetailsPath = "/details/:taskId"

export function getTaskLink(taskId: string): string {
	return TaskDetailsPath.replace(":taskId", taskId)
}

const getStepsLink = (id: string) => getTaskListLink(id, "subtasks")
const getPrevStepsLink = (id: string) => getTaskListLink(id, "prevSteps")
const getNextStepsLink = (id: string) => getTaskListLink(id, "nextSteps")

export function TaskPage() {

	const { taskId } = useParams()
	const { userId } = useRootSelector(state => state.user)
	const { t } = useTranslation()
	const dispatch = useRootDispatch()
	const history = useHistory()

	useEffect(() => {
		if (userId) {
			const doneClick = () => {
				history.goBack()
			}
			dispatch({ type: "mainButton-show", text: t("Done"), handler: doneClick })
		} else {
			dispatch({ type: "mainButton-hide" })
		}

	}, [userId, dispatch, history, t])

	useEffect(() => {
		if (taskId && userId)
			dispatch({ type: "tasks-start-loading", filter: { tasks: [taskId] } })
	}, [userId, taskId, dispatch])

	return (
		<TaskEdit
			taskId={taskId}
			getTaskLink={getTaskLink}
			getStepsLink={getStepsLink}
			getPrevStepsLink={getPrevStepsLink}
			getNextStepsLink={getNextStepsLink}
		/>
	)
}
