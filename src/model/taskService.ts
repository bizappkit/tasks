import {Task, ScheduleItem } from "./task";

type Callback<T> = (result: T) => void

interface Service<T> {
	dispatch(data: Partial<T>): void
	on(callback: Callback<T>): void
	off(callback: Callback<T>): void
}

interface TaskService {
	//getScheduleItems: (callback: (result: ScheduleItem[]) => void) => void
	getTask: (options: {taskId: string}, callback: (result: Task) => void) => void
	updateTask: (payload: Partial<Task>) => void
}


class TasksApi implements TaskService {
	
	getScheduleItems: (callback: (result: ScheduleItem[]) => void) => void;
	
	getTask: (options: { taskId: string; }, callback: (result: Task) => void) => void;


}