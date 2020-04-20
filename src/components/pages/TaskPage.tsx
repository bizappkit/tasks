import React from 'react';
import { TaskEdit } from '../cards/TaskEdit';
import { useParams } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";

export const TaskDetailsPath = "/details/:taskId"

export function getTaskLink(taskId?: string): string {
	return TaskDetailsPath.replace(":taskId", taskId || "0")
}

const getStepsLink = (id: string) => getTaskListLink(id, "subSteps")
const getPrevStepsLink = (id: string) => getTaskListLink(id, "prevSteps")
const getNextStepsLink = (id: string) => getTaskListLink(id, "nextSteps")

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
