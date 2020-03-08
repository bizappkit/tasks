import { Task, ScheduleItem, getScheduleItems, orderTasksByName } from "../model/task";

export interface TasksStoreState {
	loading: boolean
	allTasks?: Task[]
	idToTask?: Map<string, Task>
	scheduleItems?: ScheduleItem[]
}

const initialState: TasksStoreState = {
	loading: true
}

export type TasksStoreAction = {
	type: 'tasks-loaded'
	tasks: Task[]
}

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

