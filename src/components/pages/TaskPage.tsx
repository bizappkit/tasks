import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { TaskEdit } from '../cards/TaskEdit';
import { useParams, useRouteMatch } from 'react-router-dom';
import { getTaskListLink } from "./TaskList";

export function getTaskLink(id: string): string {
	return "details/" + id + "/"
}

const getStepsLink = (id: string) => getTaskListLink({ filter: "stepsOf", taskId: id })
const getPrevStepsLink = (id: string) => getTaskListLink({ filter: "prevStepsOf", taskId: id })
const getNextStepsLink = (id: string) => getTaskListLink({ filter: "nextStepsOf", taskId: id })

function TaskPage() {

	useRouteMatch({})

	const { taskId } = useParams()

	return (
		<Container>
			<TaskEdit
				taskId={taskId}
				getTaskLink={getTaskLink}
				getStepsLink={getStepsLink}
				getPrevStepsLink={getPrevStepsLink}
				getNextStepsLink={getNextStepsLink}
			/>
		</Container>
	)
}

export default connect()(TaskPage)