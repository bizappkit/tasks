import { Task } from "../model/task";
import Immutable from "immutable";
import { TasksStoreAction } from "./tasksActions";
import { TaskFilter } from "../sync";


export interface TasksStoreState {
	loading: boolean
	filter?: TaskFilter
	idToTask?: Immutable.Map<string, Task>
}

const initialState: TasksStoreState = {
	loading: false
}

export function tasksReducer(state = initialState, action: TasksStoreAction): TasksStoreState {
	switch (action.type) {
		case 'tasks-start-loading':
			return {
				...state,
				loading: true,
				filter: action.filter
			}

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

