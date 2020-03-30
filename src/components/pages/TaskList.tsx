import { TaskRef } from "../../model/task";

export type TaskListFilterMode = "subSteps" | "nextSteps" | "prevSteps"

export type TaskListFilter = {
    filter: TaskListFilterMode
    taskId: TaskRef
}

export function getTaskListLink(options: TaskListFilter): string {
    return "tasks/" + options.filter + "/" + options.taskId + "/"
}