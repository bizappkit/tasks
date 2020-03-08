import React from 'react';
import { Container } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router-dom';
import { Task } from '../model/task';
import { RootState } from '../store';
import { connect } from 'react-redux';

interface TaskPageProps {
	tasks?: Map<string, Task>
}

function TaskPage(props: TaskPageProps) {

	const { taskId } = useParams()

	const task = (taskId && props.tasks ? props.tasks.get(taskId) : undefined)

	return (
		<Container>
			<form>
				<div className="form-group">
					<TextareaAutosize
						disabled={task === undefined}
						placeholder="Task Title"
						className="form-control"
						style={{ fontSize: "2rem" }}
					/>
				</div>
				<div className="form-group">
					<label>Notes</label>
					<TextareaAutosize
						disabled={task === undefined}
						minRows={4}
						className="form-control"
					/>
				</div>
			</form>
		</Container>
	)
}

const mapRootStateToProp = (state: RootState): TaskPageProps => ({
	tasks: state.tasks.idToTask
});

export default connect(mapRootStateToProp)(TaskPage)