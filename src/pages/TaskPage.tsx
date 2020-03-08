import React, { Dispatch } from 'react';
import { Container } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router-dom';
import { Task } from '../model/task';
import { RootState } from '../store';
import { connect, useSelector, useDispatch } from 'react-redux';
import { TasksStoreAction } from '../store/tasksStore';


function TaskPage() {

	const { taskId } = useParams()

	const tasks = useSelector((state: RootState) => state.tasks.idToTask)

	const dispatch: Dispatch<TasksStoreAction> = useDispatch();

	const task = (taskId && tasks ? tasks.get(taskId) : undefined)

	const updateTask = (payload: Partial<Task>) => {
		if (taskId)
			dispatch({ type: 'tasks-updated', taskId: taskId, payload })
	}

	return (
		<Container>
			<form>
				<div className="form-group">
					<TextareaAutosize
						disabled={task === undefined}
						placeholder="Task Title"
						className="form-control"
						style={{ fontSize: "2rem" }}
						value={task?.title}
						onChange={(e) => updateTask({ title: e.currentTarget.value })}
					/>
				</div>
				<div className="form-group">
					<label>Notes</label>
					<TextareaAutosize
						disabled={task === undefined}
						minRows={4}
						className="form-control"
						value={task?.notes}
						onChange={(e) => updateTask({ notes: e.currentTarget.value })}
					/>
				</div>
			</form>
		</Container>
	)
}

export default connect()(TaskPage)