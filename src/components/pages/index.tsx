import React from "react"
import { BrowserRouter as Router, Link, Route, useRouteMatch, Switch, Redirect } from "react-router-dom"
import { TaskRef, Task } from "../../model/task"
import { TaskListFilterMode, RelatedTaskListPath, TaskList } from "./TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Map } from "immutable"
import { Container } from "react-bootstrap"
import { SchedulePage, SchedulePath } from "./TaskSchedule"
import { TaskPage, getTaskLink, TaskDetailsPath } from "./TaskPage"


export function ContentRouting() {

    return (
        <Router>
            <ContentRoutingInContext />
        </Router>
    )
}

function ContentRoutingInContext() {

    const match = useRouteMatch<Params>(Paths)
    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const params = match?.params;
    const currentTask = (params?.taskId && tasks?.get(params.taskId)) || undefined

    return (
        <Container>
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to={SchedulePath}>Schedule</Link>
                    </li>

                    {currentTask &&
                        <li className="breadcrumb-item">
                            <Link to={getTaskLink(params?.taskId)}>{currentTask.title}</Link>
                        </li>
                    }

                    {params && ("filterMode" in params) &&
                        <li className="breadcrumb-item active">
                            {getTaskListTitle(params, tasks)}
                        </li>
                    }
                </ol>
            </nav>

            <Switch>
                <Route path={RelatedTaskListPath}>
                    <TaskList />
                </Route>
                <Route path={TaskDetailsPath}>
                    <TaskPage />
                </Route>
                <Route path={SchedulePath}>
                    <SchedulePage />
                </Route>
                <Route path="/">
                    <Redirect to={SchedulePath} />
                </Route>
            </Switch>

        </Container>
    )
}



const Paths = [
    SchedulePath,
    RelatedTaskListPath,
    TaskDetailsPath,
]

type Params = TaskDetailsParams | RelatedTaskParams

type RelatedTaskParams = {
    filterMode: TaskListFilterMode
    taskId: string
}

type TaskDetailsParams = {
    taskId: string
}

function getTaskListTitle(params?: Params, tasks?: Map<TaskRef, Task>): string | undefined {

    if (!params || !tasks)
        return undefined

    const task = tasks.get(params.taskId)

    if ("filterMode" in params) {
        switch (params.filterMode) {
            case "subSteps":
                return "Steps of " + task?.title
            case "nextSteps":
                return "Next Steps of " + task?.title
            case "prevSteps":
                return "Prev Steps of " + task?.title
        }
    }

    return undefined
}
