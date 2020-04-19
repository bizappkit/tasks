import { Action } from 'redux'
import { Task } from "../model/task";

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