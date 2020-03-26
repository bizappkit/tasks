import React from "react"
import { useRouteMatch } from "react-router-dom";


const Paths = [
    "/tasks/:filterMode/:value",
    "/task/:taskId"
]

type Params = {
    filterMode: string
    value: string
} | {
    taskId: string
}

export function ContentRouting(props: {}) {

    let match = useRouteMatch<Params>(Paths)

    return (
        <div>{match && "matched"}</div>
    )
}