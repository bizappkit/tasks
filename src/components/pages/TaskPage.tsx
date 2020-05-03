import React, { useEffect } from 'react';
import { TaskEdit } from '../task/TaskEdit';
import { useParams, useHistory } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";
import { useRootDispatch } from '../../store';
import { useTranslation } from 'react-i18next';

export const TaskDetailsPath = "/details/:taskId"

export function getTaskLink(taskId: string): string {
	return TaskDetailsPath.replace(":taskId", taskId)
}

const getStepsLink = (id: string) => getTaskListLink(id, "subSteps")
const getPrevStepsLink = (id: string) => getTaskListLink(id, "prevSteps")
const getNextStepsLink = (id: string) => getTaskListLink(id, "nextSteps")

export function TaskPage() {

	const { taskId } = useParams()
	const { t } = useTranslation()
	const dispatch = useRootDispatch()
	const history = useHistory()

	const doneClick = () => {
		history.goBack()
	}

	useEffect(() => {
		dispatch({type: "mainButton-show", text: t("Done"), handler: doneClick})
	})

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
