import { TaskRef } from "../../model/task";


export type TaskListFilter = {
    filter: "stepsOf" | "nextStepsOf" | "prevStepsOf"
    taskId: TaskRef
}

export function getLink(options: TaskListFilter): string {
    return "tasks/" + options.filter + "/" + options.taskId
}