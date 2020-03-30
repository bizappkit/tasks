import React from 'react';
import { TaskEdit } from '../cards/TaskEdit';
import { useParams } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";

export const TaskDetailsRoute = "/details/:taskId"

export function getTaskLink(taskId?: string): string {
	return TaskDetailsRoute.replace(":taskId", taskId || "")
}

const getStepsLink = (id: string) => getTaskListLink({ filter: "subSteps", taskId: id })
const getPrevStepsLink = (id: string) => getTaskListLink({ filter: "prevSteps", taskId: id })
const getNextStepsLink = (id: string) => getTaskListLink({ filter: "nextSteps", taskId: id })

export function TaskPage() {

	const { taskId } = useParams()

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
