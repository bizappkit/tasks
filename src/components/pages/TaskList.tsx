import { TaskRef } from "../../model/task";

export type TaskListFilterMode = "stepsOf" | "nextStepsOf" | "prevStepsOf"

export type TaskListFilter = {
    filter: TaskListFilterMode
    taskId: TaskRef
}

export function getTaskListLink(options: TaskListFilter): string {
    return "tasks/" + options.filter + "/" + options.taskId + "/"
}