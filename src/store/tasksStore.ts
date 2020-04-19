import { Task } from "../model/task";
import Immutable from "immutable";
import {TaskLoadedAction, TaskUpdatedAction, TaskAddedAction, TaskChangeRelationAction} from "./taskActions";


export type TasksStoreAction = TaskLoadedAction | TaskUpdatedAction | TaskAddedAction | TaskChangeRelationAction;

export interface TasksStoreState {
	loading: boolean
	idToTask?: Immutable.Map<string, Task>
}

const initialState: TasksStoreState = {
	loading: true
}

export function tasksReducer(state = initialState, action: TasksStoreAction): TasksStoreState {
	switch (action.type) {
		case 'tasks-loaded':
			return {
				...state,
				loading: false,
				idToTask: Immutable.Map(action.tasks.map(t => [t.id, t])),
			}

		case 'tasks-updated':
			if (state.idToTask) {
				let task = state.idToTask.get(action.taskId)
				if (task) {
					task = { ...task, ...action.payload }
					let idToTasks = state.idToTask?.set(action.taskId, task);
					return {
						...state,
						idToTask: idToTasks,
					}
				}
			}
			return state

		case 'tasks-new-task':
			if (state.idToTask) {
				let idToTasks = state.idToTask.set(action.task.id, action.task);
				if (action.task.parent) {
					let parentTask = state.idToTask.get(action.task.parent)
					if (parentTask) {
						parentTask = { ...parentTask, subtasks: [...parentTask.subtasks, action.task.id] }
						idToTasks = idToTasks.set(parentTask.id, parentTask)
					}
				}
				console.log(idToTasks)
				return {
					...state,
					idToTask: idToTasks,
				}
			}
			return state

		default:
			return state
	}
}

