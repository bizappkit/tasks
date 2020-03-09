import React, { Dispatch } from 'react';
import { Container } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router-dom';
import { Task } from '../model/task';
import { RootState } from '../store';
import { connect, useSelector, useDispatch } from 'react-redux';
import { TasksStoreAction } from '../store/tasksStore';
import { toShortTimeStr } from '../utils/dateTimeUtils';


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

				{task && task.reminders && task.reminders.length > 0 &&
					<div className="form-group">
						<label>Reminders</label>
						<ol className="list-group">
							{task.reminders.map(reminder => (
								<a href="/" className="list-group-item list-group-item-action justify-content-between align-items-center">
									<span className="badge badge-secondary">{toShortTimeStr(reminder.time)}</span>
									&nbsp;
									<span>{reminder.notes || ""}</span>
								</a>
							))}
						</ol>
					</div>
				}

			</form>
		</Container>
	)
}

export default connect()(TaskPage)