import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';


export function TaskPage() {
	const { taskId } = useParams();

	return (
		<Container>
			<Row>
				<Col>
					<div>Task: {taskId}</div>
				</Col>
			</Row>
		</Container>
	)
}