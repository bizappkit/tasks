import { Action } from 'redux'
import { Task } from "../model/task";
import { TaskFilter } from '../sync';

export interface TaskStartLoadingAction extends Action {
	type: 'tasks-start-loading'
	filter: TaskFilter
}

export interface TaskLoadErrorAction extends Action {
	type: 'tasks-loading-error'
	error: string
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

export interface TaskAddedAction extends Action {
	type: 'tasks-new-task'
	task: Task
}

export interface TaskChangeRelationAction extends Action {
	type: "tasks-remove-relations" | "tasks-add-relations"
	parent: Task
	child: Task
	relation: "subSteps" | "prevSteps" | "nextSteps"
}

export interface TaskDeleteAction extends Action {
	type: 'tasks-delete'
	task: Task
}

export interface TaskRestoreAction extends Action {
	type: 'tasks-restore'
	task: Task
}

export type TasksStoreAction =
	TaskStartLoadingAction | TaskLoadErrorAction | TaskLoadedAction | TaskUpdatedAction | TaskAddedAction |
	TaskChangeRelationAction | TaskDeleteAction | TaskRestoreAction
