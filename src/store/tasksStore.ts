import { Task, ScheduleItem, getScheduleItems, orderTasksByName } from "../model/task";
import { Action } from 'redux'
import Immutable from "immutable";

export interface TasksStoreState {
	loading: boolean
	allTasks?: Task[]
	idToTask?: Immutable.Map<string, Task>
	scheduleItems?: ScheduleItem[]
}

const initialState: TasksStoreState = {
	loading: true
}

export interface TaskLoadedAction extends Action {
	type: 'tasks-loaded'
	tasks: Task[]
}

export interface TaskUpdatedAction extends Action {
	type: 'tasks-updated'
	taskId: string
	payload: Partial<Task>
}

export type TasksStoreAction = TaskLoadedAction | TaskUpdatedAction;

export function tasksReducer(state = initialState, action: TasksStoreAction): TasksStoreState {
	switch (action.type) {
		case 'tasks-loaded':
			return {
				...state,
				loading: false,
				allTasks: orderTasksByName(action.tasks),
				idToTask: Immutable.Map(action.tasks.map(t => [t.id, t])),
				scheduleItems: getScheduleItems(new Date(), action.tasks.values())
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
						scheduleItems: getScheduleItems(new Date(), idToTasks.values())
					}
				}
			}
			return state

		default:
			return state
	}
}

