import React from "react"
import { BrowserRouter as Router, Link, Route, useRouteMatch, Switch, Redirect } from "react-router-dom"
import { TaskListFilterMode } from "../../model/task"
import { RelatedTaskListPath, TaskList, getPageTitle } from "./TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
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
    const filterMode = (params && ("filterMode" in params) && params.filterMode) || undefined

    return (
        <div className="main-container">
            <div className="breadcrumb-bar navbar bg-white sticky-top">

                <ol className="breadcrumb flex-nowrap" style={{ maxWidth: "100%" }}>
                    <NavLink to={SchedulePath} active={currentTask !== undefined}>Schedule</NavLink>

                    {currentTask &&
                        <NavLink to={getTaskLink(params?.taskId)} active={filterMode !== undefined}>{currentTask.title}</NavLink>
                    }

                    {filterMode &&
                        <NavLink>{getPageTitle(filterMode)}</NavLink>
                    }
                </ol>

            </div>

            <div className="container" style={{ marginTop: "1rem" }}>
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
        <li className="breadcrumb-item text-truncate">
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
