import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { TaskEdit } from '../cards/TaskEdit';
import { useParams } from 'react-router-dom';

function TaskPage() {

	const { taskId } = useParams()

	return (
		<Container>
			<TaskEdit taskId={taskId} />
		</Container>
	)
}

export default connect()(TaskPage)