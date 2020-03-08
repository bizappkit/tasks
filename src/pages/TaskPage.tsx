import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';

export function TaskPage() {
	const { taskId } = useParams();

	return (
		<Container>
			<form>
				<div className="form-group">
					<TextareaAutosize placeholder="Task Title" className="form-control" style={{fontSize: "2rem"}}/>
				</div>
				<div className="form-group">
					<label>Notes</label>
					<TextareaAutosize minRows={4} className="form-control"/>
				</div>
			</form>
		</Container>
	)
}