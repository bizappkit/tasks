import { Task, ScheduleItem, getScheduleItems, orderTasksByName } from "../model/task";
import { Action } from 'redux'

export interface TasksStoreState {
	loading: boolean
	allTasks?: Task[]
	idToTask?: Map<string, Task>
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
				idToTask: new Map(action.tasks.map(t => [t.id, t])),
				scheduleItems: getScheduleItems(new Date(), action.tasks)
			}

		default:
			return state
	}
}

