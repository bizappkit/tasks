import React from "react"
import { TaskRef } from "../../model/task";
import { TaskDetailsPath, getTaskLink } from "./TaskPage";
import { useParams } from "react-router-dom";
import { CardList } from "../cards/CardList";

export const RelatedTaskListPath = TaskDetailsPath + "/:filterMode"

export type TaskListFilterMode = "subSteps" | "nextSteps" | "prevSteps"

export function getTaskListLink(taskId: TaskRef, filter: TaskListFilterMode): string {
    return getTaskLink(taskId) + "/" + filter
}

export function TaskList() {

    return (
        <div>Task List</div>
    )

    // const { taskId, filterMode } = useParams()

    // return (
    //     <CardList
    //         items={scheduleItems || []}
    //         getItemKey={r => r.taskId}
    //         getGroupKey={r => getDate(r.time)}
    //         getGroupTitle={getReminderGroupTitle}
    //         renderItem={renderReminder}
    //     />
    // )
}