import React from "react"
import { TaskRef, TaskListFilterMode, getSelectedTasks, getTaskListFilterMode } from "../../model/task";
import { TaskDetailsPath, getTaskLink } from "./TaskPage";
import { useParams } from "react-router-dom";
import { CardList } from "../cards/CardList";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TaskCard } from "../cards/TaskCard";


export const RelatedTaskListPath = TaskDetailsPath + "/:filterMode"

export function getTaskListLink(taskId: TaskRef, filter: TaskListFilterMode): string {
    return getTaskLink(taskId) + "/" + filter
}

export function TaskList() {

    const { taskId, filterMode } = useParams()
    const tasksState = useSelector((state: RootState) => state.tasks)

    const tasksFilter = { contextTaskId: taskId, filterMode: getTaskListFilterMode(filterMode) }
    const tasks = getSelectedTasks(tasksState.idToTask, tasksFilter)

    const selectedTasksSet = new Set(tasks?.selected)

    const allTasks = tasks ? [...tasks.selected, ...tasks.other] : []

    return (
        <CardList
            items={allTasks}
            getItemKey={t => t.id}
            getGroupKey={t => selectedTasksSet.has(t) ? 1 : 2}
            getGroupTitle={t => selectedTasksSet.has(t) ? "Selected " + getPageTitle(tasksFilter.filterMode) : "Use Plus to add task as step"}
            renderItem={t =>
                <TaskCard
                    key={t.id}
                    icon={selectedTasksSet.has(t) ? "remove" : "add"}
                    title={t.title}
                    titleLinkTo={getTaskLink(t.id)}
                    subtitle={t.notes}
                />
            }
        />
    )
}

export function getPageTitle(filterMode?: TaskListFilterMode): string | undefined {
    switch (filterMode) {
        case "subSteps":
            return "Steps"
        case "nextSteps":
            return "Next Steps"
        case "prevSteps":
            return "Prev Steps"
    }
}
