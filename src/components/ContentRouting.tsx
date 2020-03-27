import React from "react"
import { useLocation, matchPath } from "react-router-dom";
import { TaskRef, Task } from "../model/task";
import { TaskListFilterMode } from "./pages/TaskList";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Map } from "immutable";
import { Breadcrumb } from "react-bootstrap";

export function ContentRouting() {

    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const location = useLocation()

    const segments = tasks ? getSegments(tasks, location.pathname) : undefined

    return (
        <Breadcrumb>
            <Breadcrumb.Item href="/">Schedule</Breadcrumb.Item>
            {segments?.map(s => (
            <Breadcrumb.Item href={s.url}>{s.title}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}

const ROUTS = [
    "/tasks/:filterMode/:taskId",
    "/task/:taskId"
]

type Params = {
    filterMode: TaskListFilterMode
    taskId: string
} | {
    taskId: string
}

function getRouteTitle(params: Params, tasks: Map<TaskRef, Task>): string {
    
    const task = tasks.get(params.taskId)

    if("filterMode" in params) {
        switch(params.filterMode) {
            case "stepsOf":
                return "Steps of " + task?.title
            case "nextStepsOf":
                return "Next steps of " + task?.title
            case "prevStepsOf":
                return "Prev steps of " + task?.title
        }
    }

    return task?.title || ""
}

interface PathSegment {
    title: string
    url: string
}

function getSegments(tasks: Map<TaskRef, Task>, url: string): PathSegment[] {
    const segments = [] as PathSegment[]
    fillSegments(tasks, url, segments)
    return segments;
}

function fillSegments(tasks: Map<TaskRef, Task>, url: string, segments: PathSegment[]): void {
    
    const match = matchPath<Params>(url, ROUTS)

    if(match === null) return;

    segments.push({url: match.url, title: getRouteTitle(match.params, tasks)})

    const subUrl = url.substring(match.url.length);

    fillSegments(tasks, subUrl, segments)
}