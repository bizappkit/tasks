import React from "react"
import { useLocation, matchPath, Link, Route } from "react-router-dom"
import { TaskRef, Task } from "../model/task"
import { TaskListFilterMode } from "./pages/TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { Map } from "immutable"
import { Breadcrumb, Container } from "react-bootstrap"
import { SchedulePage } from "./pages/SchedulePage"
import TaskPage from "./pages/TaskPage"

export function ContentRouting() {

    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const location = useLocation()

    const segments = tasks ? getSegments(tasks, location.pathname) : undefined
    const lastSegment = (segments && segments.length > 0 && segments[segments.length - 1]) || undefined;

    return (
        <Container>
            <Route path="/">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <div className="dropdown-toggle"><Link to="/"></Link>Schedule</div>
                    </Breadcrumb.Item>

                    {segments?.map(s => (
                        <Breadcrumb.Item href={s.url}><Link to={s.url}>{s.title}</Link></Breadcrumb.Item>
                    ))}
                </Breadcrumb>

                {(lastSegment === undefined || lastSegment.params.taskId === undefined) &&
                    <SchedulePage />
                }

                {/*Task List*/}

                {lastSegment && lastSegment.params.taskId &&
                    <TaskPage />
                }
            </Route>
        </Container>
    )
}

const ROUTS = [
    "/schedule",
    "/tasks/:filterMode/:taskId",
    "/details/:taskId"
]

type Params = {
    filterMode: TaskListFilterMode
    taskId: string
} | {
    taskId: string
}

function getRouteTitle(params: Params, tasks: Map<TaskRef, Task>): string {

    const task = tasks.get(params.taskId)

    if ("filterMode" in params) {
        switch (params.filterMode) {
            case "stepsOf":
                return "Steps of " + task?.title
            case "nextStepsOf":
                return "Next Steps of " + task?.title
            case "prevStepsOf":
                return "Prev Steps of " + task?.title
        }
    }

    return task?.title || ""
}

interface PathSegment {
    title: string
    url: string
    params: Params
}

function getSegments(tasks: Map<TaskRef, Task>, url: string): PathSegment[] {
    const segments = [] as PathSegment[]
    fillSegmentsRecursive(tasks, url, segments)
    return segments;
}

function fillSegmentsRecursive(tasks: Map<TaskRef, Task>, url: string, segments: PathSegment[]): void {

    const match = matchPath<Params>(url, ROUTS)

    if (match === null)
        return

    segments.push({ params: match.params, url: match.url, title: getRouteTitle(match.params, tasks) })

    const subUrl = url.substring(match.url.length)

    fillSegmentsRecursive(tasks, subUrl, segments)
}