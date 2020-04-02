import React from "react"
import { BrowserRouter as Router, Link, Route, useRouteMatch, Switch, Redirect } from "react-router-dom"
import { TaskRef, Task, TaskListFilterMode } from "../../model/task"
import { RelatedTaskListPath, TaskList } from "./TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Map } from "immutable"
import { SchedulePage, SchedulePath } from "./TaskSchedule"
import { TaskPage, getTaskLink, TaskDetailsPath } from "./TaskPage"


export function ContentRouting() {

    return (
        <Router>
            <ContentRoutingInternal />
        </Router>
    )
}

function ContentRoutingInternal() {

    const match = useRouteMatch<Params>(Paths)
    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const params = match?.params;
    const currentTask = (params?.taskId && tasks?.get(params.taskId)) || undefined

    return (
        <div className="main-container">
            <div className="breadcrumb-bar navbar bg-white sticky-top">
                <nav>
                    <ol className="breadcrumb">
                        <NavLink to={SchedulePath} active={currentTask !== undefined}>Schedule</NavLink>

                        {currentTask &&
                            <NavLink to={getTaskLink(params?.taskId)} active={params && ("filterMode" in params)}>{currentTask.title}</NavLink>
                        }

                        {params && ("filterMode" in params) &&
                            <NavLink to={getTaskListTitle(params, tasks)}>{getTaskListTitle(params, tasks)}</NavLink>
                        }
                    </ol>
                </nav>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11 col-xl-10">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

interface NavLinkProps {
    children: React.ReactNode
    to?: string
    active?: boolean
}

function NavLink(props: NavLinkProps) {
    return (
        <li className="breadcrumb-item">
            {(!props.active || !props.to) && props.children}
            {props.active && props.to &&
                <Link to={props.to}>{props.children}</Link>
            }
        </li>
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
