import React from "react"
import { BrowserRouter as Router, Route, useRouteMatch, Switch, Redirect, Link } from "react-router-dom"
import { TaskRelation } from "../../model/task"
import { RelatedTaskListPath, TaskList, getPageTitle } from "./TaskList"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { SchedulePage, SchedulePath } from "./TaskSchedule"
import { TaskPage, getTaskLink, TaskDetailsPath } from "./TaskPage"
import { MainButton } from "../task/MainButton";
import { useTranslation } from "react-i18next";
import Container from "@material-ui/core/Container"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import MaterialLink from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"
import { AppBar, Toolbar } from "@material-ui/core"


export function ContentRouting() {

    return (
        <Router>
            <ContentRoutingInternal />
        </Router>
    )
}

function ContentRoutingInternal() {

    const { t } = useTranslation()
    const match = useRouteMatch<Params>(Paths)
    const tasks = useSelector((state: RootState) => state.taskList.idToTask)
    const params = match?.params;

    const currentTask = (params?.taskId && tasks?.get(params.taskId)) || undefined
    const filterMode = (params && ("filterMode" in params) && params.filterMode) || undefined

    return (
        <React.Fragment>
            <AppBar color="inherit" position="static">
                <Toolbar>
                    <Breadcrumbs style={{flexGrow: 1}}>

                        <NavLink to={SchedulePath} active={currentTask !== undefined}>{t("Schedule")}</NavLink>

                        {currentTask && params?.taskId &&
                            <NavLink to={getTaskLink(params.taskId)} active={filterMode !== undefined}>{t("Task Details")}</NavLink>
                        }

                        {filterMode &&
                            <NavLink>{getPageTitle(filterMode)}</NavLink>
                        }

                    </Breadcrumbs>
                    <MainButton />
                </Toolbar>
            </AppBar>

            <Container fixed>
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
            </Container>
        </React.Fragment>
    )
}

interface NavLinkProps {
    children: React.ReactNode
    to?: string
    active?: boolean
}

function NavLink(props: NavLinkProps) {

    const { active, to } = props;

    if(!active || !to) {
        return (
            <Typography color="textPrimary">{props.children}</Typography>
        )
    }

    const RoutingLink = (props: unknown) => <Link to={to} {...props}/>

    return (
        <MaterialLink component={RoutingLink} href={props.to}>{props.children}</MaterialLink>
    )
}


const Paths = [
    SchedulePath,
    RelatedTaskListPath,
    TaskDetailsPath,
]

type Params = TaskDetailsParams | RelatedTaskParams

type RelatedTaskParams = {
    filterMode: TaskRelation
    taskId: string
}

type TaskDetailsParams = {
    taskId: string
}
