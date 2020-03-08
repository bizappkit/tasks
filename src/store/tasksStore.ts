import { Task, ScheduleItem, getScheduleItems, orderTasksByName } from "../model/task";

export interface TasksStoreState {
	loading: boolean
	allTasks?: Task[]
	scheduleItems?: ScheduleItem[]
	//selectedTaskId?: string
	//selectedTask?: Task
}

const initialState: TasksStoreState = {
	loading: true
}

export type TasksStoreAction = {
	type: 'tasks-loaded'
	tasks: Task[]
} | {
	type: 'tasks-select'
	taskId?: string
}

export function tasksReducer(state = initialState, action: TasksStoreAction): TasksStoreState {
	switch(action.type) {
		case 'tasks-loaded':
			return {
				...state,
				loading: false,
				allTasks: orderTasksByName(action.tasks),
				scheduleItems: getScheduleItems(new Date(), action.tasks),
				//selectedTask: findTask(state.allTasks, state.selectedTaskId)
			}

		case 'tasks-select':
			return {
				...state,
				//selectedTaskId: action.taskId,
				//selectedTask: findTask(state.allTasks, action.taskId)
			}

		default:
			return state
	}
}

