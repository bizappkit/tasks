import React, { Dispatch } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Task } from '../../model/task';
import { RootState } from '../../store';
import { connect, useSelector, useDispatch } from 'react-redux';
import { TasksStoreAction } from '../../store/tasksStore';
import { TaskEdit } from "../cards/TaskEdit";

function TaskPage() {

	const { taskId } = useParams()
	const tasks = useSelector((state: RootState) => state.tasks.idToTask)
	const task = (taskId && tasks ? tasks.get(taskId) : undefined)

	const dispatch: Dispatch<TasksStoreAction> = useDispatch()
	const updateTask = (payload: Partial<Task>) => {
		if (taskId)
			dispatch({ type: 'tasks-updated', taskId: taskId, payload })
	}

	return (
		<Container>
			<TaskEdit task={task} updateTask={updateTask} />
		</Container>
	)
}

export default connect()(TaskPage)