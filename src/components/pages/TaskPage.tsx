import React from 'react';
import { TaskEdit } from '../cards/TaskEdit';
import { useParams } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";

export function getTaskLink(id: string): string {
	return "/details/" + id
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
