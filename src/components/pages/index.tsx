import React from "react"
import { BrowserRouter as Router, Link, Route, useRouteMatch, Switch, Redirect } from "react-router-dom"
import { TaskRef, Task } from "../../model/task"
import { TaskListFilterMode } from "./TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Map } from "immutable"
import { Container } from "react-bootstrap"
import { SchedulePage } from "./TaskSchedule"
import { TaskPage } from "./TaskPage"


export function ContentRouting() {

    return (
        <Router>
            <ContentRoutingInContext/>
        </Router>
    )
}

function ContentRoutingInContext() {

    const match = useRouteMatch<Params>(Routs)
    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const params = match?.params;
    const currentTask = (params?.taskId && tasks?.get(params.taskId)) || undefined

    return (
        <Container>
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/schedule">Schedule</Link>
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
                <Route path={TaskDetailsRoute}>
                    <TaskPage />
                </Route>
                <Route path={ScheduleRoute}>
                    <SchedulePage />
                </Route>
                <Route path="/">
                    <Redirect to={ScheduleRoute}/>
                </Route>
            </Switch>
            
        </Container>
    )
}

const ScheduleRoute = "/schedule"


const TaskDetailsRoute = "/details/:taskId"

export function getTaskLink(taskId?: string): string {
	return TaskDetailsRoute.replace(":taskId", (taskId || ""))
}

const RelatedTaskListRoute = "/details/:taskId/:filterMode"

const Routs = [
    ScheduleRoute,
    TaskDetailsRoute,
    RelatedTaskListRoute
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

    if(!params || !tasks)
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
