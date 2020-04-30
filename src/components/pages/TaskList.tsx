import React, { Dispatch } from "react"
import { TaskRef, TaskRelation, getSelectedTasks, getTaskListFilterMode, Task } from "../../model/task";
import { TaskDetailsPath, getTaskLink } from "./TaskPage";
import { useParams } from "react-router-dom";
import { CardList } from "../task/CardList";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { TaskCard } from "../task/TaskCard";
import { TasksStoreAction } from "../../store/taskActions";


export const RelatedTaskListPath = TaskDetailsPath + "/:filterMode"

export function getTaskListLink(taskId: TaskRef, filter: TaskRelation): string {
    return getTaskLink(taskId) + "/" + filter
}

export function TaskList() {

    const dispatch: Dispatch<TasksStoreAction> = useDispatch()
    const { taskId, filterMode } = useParams()
    const tasksState = useSelector((state: RootState) => state.taskList)

    const tasksFilter = { contextTaskId: taskId, filterMode: getTaskListFilterMode(filterMode) }
    const tasks = getSelectedTasks(tasksState.idToTask, tasksFilter)
    const contextTask = (taskId && tasksState.idToTask?.get(taskId)) || undefined

    const selectedTasksSet = new Set(tasks?.selected)

    const allTasks = tasks ? [...tasks.selected, ...tasks.other] : []

    const onTaskClick = (task: Task) => {
        if (!contextTask || !tasksFilter.filterMode) return
        const type = selectedTasksSet.has(task) ? "tasks-remove-relations" : "tasks-add-relations"
        dispatch({ type, parent: contextTask, child: task, relation: tasksFilter.filterMode })
    }

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
                    onIconClick={() => onTaskClick(t)}
                    title={t.title}
                    titleLinkTo={getTaskLink(t.id)}
                    subtitle={t.notes}
                />
            }
        />
    )
}

export function getPageTitle(filterMode?: TaskRelation): string | undefined {
    switch (filterMode) {
        case "subSteps":
            return "Steps"
        case "nextSteps":
            return "Next Steps"
        case "prevSteps":
            return "Prev Steps"
    }
}
