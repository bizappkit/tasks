import React from "react"
import { TaskRef, TaskListFilterMode, Task, getSelectedTasks, getTaskListFilterMode } from "../../model/task";
import { TaskDetailsPath, getTaskLink } from "./TaskPage";
import { useParams, Link } from "react-router-dom";
import { CardList } from "../cards/CardList";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


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
            getGroupTitle={t => selectedTasksSet.has(t) ? "Selected" : "Other"}
            renderItem={renderTask}
        />
    )
}

function renderTask(task: Task) {
    return (
		<div className="card card-task">
			<div className="card-body">
				<div className="card-title" >
					<Link to={getTaskLink(task.id)}>
						<h6 className="H6-filter-by-text">
							{task.title}
						</h6>
					</Link>
					<span className="text-small">{task.notes || ""}</span>
				</div>
			</div>
		</div>
    )
}