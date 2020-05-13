import React, { useState, useEffect } from "react";
import { createTask, Task, Reminder, TaskRef } from "../../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { FormListSection } from "./FormListSection";
import { useRootDispatch, useRootSelector } from "../../store";
import { Link, useHistory } from "react-router-dom";
import { Map } from "immutable"
import { ActionButton } from "../common/ActionButton";
import { useTranslation } from "react-i18next";
import { Section } from "../common/Section";
import { toShortDateAndTime } from "../../utils/dateTimeUtils";
import { arrayEquals } from "../../utils/arrayUtils";

import "./TaskEdit.css"
import { getTaskLink } from "../pages/TaskPage";

interface TaskEditProps {
    taskId?: string
    getTaskLink: (id: TaskRef) => string
    getStepsLink: (id: TaskRef) => string
    getPrevStepsLink: (id: TaskRef) => string
    getNextStepsLink: (id: TaskRef) => string
}

interface TaskEditState {
    //task?: Task
    //originTask?: Task
    //steps?: Task[]
    //prevSteps?: CompletionStatistics
    //nextSteps?: CompletionStatistics

    selectedReminder?: Reminder
    subtaskTitle?: string
}

export function TaskEdit(props: TaskEditProps) {

    const history = useHistory()
    const { t } = useTranslation()
    const [state, setState] = useState<TaskEditState>({})
    const dispatch = useRootDispatch()

    const currentUser = useRootSelector(state => state.user.userId)
    const isLoading = useRootSelector(state => state.taskList.loading)
    const tasksFilter = useRootSelector(state => state.taskList.filter)
    const tasks = useRootSelector(state => state.taskList.idToTask)

    const task = ((props.taskId && tasks && tasks.get(props.taskId)) || undefined)
    const originTask = ((task?.parent && tasks && tasks.get(task.parent)) || undefined)

    const subtasks = selectTasks(tasks, task?.subtasks)
    const nextSteps = selectTasks(tasks, task?.nextSteps)
    const prevSteps = selectTasks(tasks, task?.prevSteps)

    useEffect(() => {
        const allTaskIds: string[] = []
        if (props.taskId) allTaskIds.push(props.taskId)
        if (task) {
            if (task.parent) allTaskIds.push(task.parent)
            if (task.subtasks) allTaskIds.push(...task.subtasks)
            if (task.nextSteps) allTaskIds.push(...task.nextSteps)
            if (task.prevSteps) allTaskIds.push(...task.prevSteps)
        }

        if (!tasksFilter || !("tasks" in tasksFilter) || !arrayEquals(allTaskIds, tasksFilter.tasks)) {
            dispatch({ type: "tasks-start-loading", filter: { tasks: allTaskIds } })
        }

    }, [dispatch, props.taskId, task, tasksFilter])

    const updateTask = (payload: Partial<Task>) => {
        if (props.taskId)
            dispatch({ type: 'tasks-updated', taskId: props.taskId, payload })
    }

    const addReminder = (event?: React.MouseEvent) => {

        event?.preventDefault()

        const now = new Date()
        const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)
        const reminder = { date: tomorrowMorning };

        updateTask({ reminder })
    }

    const deleteReminder = () => {
        updateTask({ reminder: null })
    }

    const addSubtasks = () => {
        updateTask({ subtasks: [] })
    }

    const openSubtasks = () => {
        if (props.taskId)
            history.push(props.getStepsLink(props.taskId))
    }

    const updateSelectedReminder = (payload: Partial<Reminder>) => {
        if (state.selectedReminder)
            setState({ ...state, selectedReminder: { ...state.selectedReminder, ...payload } })
    }

    const saveReminderChanges = () => {

        if (state.selectedReminder) {

            updateTask({ reminder: state.selectedReminder })

            cancelEditReminder()
        }
    }

    const cancelEditReminder = () => {
        setState({ selectedReminder: undefined })
    }

    const onNewStepKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.charCode === 13) {
            addSubtask(event)
        }
    }

    const addSubtask = (event?: { preventDefault: () => void }) => {

        event?.preventDefault()

        if (!currentUser || !task || !state.subtaskTitle)
            return;

        const title = state.subtaskTitle.trim();

        if (title.length === 0)
            return;

        const newTask = createTask(currentUser, title, undefined, undefined, task.id)

        dispatch({ type: "tasks-new-task", task: newTask })
        dispatch({ type: "tasks-add-relations", relation: "subtasks", parent: task, child: newTask })

        setState({ ...state, subtaskTitle: "" })
    }

    const completeTask = () => {
        if (task)
            dispatch({ type: "tasks-updated", taskId: task.id, payload: { completedOn: new Date() } })
    }

    const restoreTask = () => {
        if (task)
            dispatch({ type: "tasks-updated", taskId: task.id, payload: { completedOn: null } })
    }

    const deleteTask = () => {
        if (task)
            dispatch({ type: "tasks-delete", task })
        history.push("/")
    }

    if (!task && isLoading) {
        return <div>Loading...</div>
    }

    if (!task) {
        return <div>Task not found</div>
    }

    return (
        <form>
            <div className="row">
                <div className="col-sm-8">
                    <div className="content-list">
                        <TextareaAutosize
                            autoFocus
                            placeholder="Task Title"
                            className="form-control"
                            style={{ fontSize: "2.5rem" }}
                            value={task?.title}
                            onChange={(e) => updateTask({ title: e.currentTarget.value })}
                        />
                    </div>

                    {originTask &&
                        <p className="lead">
                            Origin Task:&nbsp;
                            <Link to={props.getTaskLink(originTask?.id)}>{originTask.title}</Link>
                        </p>
                    }

                    <Section title={t("Notes")} style={{ marginTop: "2rem" }}>
                        <TextareaAutosize
                            minRows={4}
                            className="form-control"
                            value={task?.notes}
                            onChange={(e) => updateTask({ notes: e.currentTarget.value })}
                        />
                    </Section>

                    {task.reminder &&
                        <Section
                            title={t("Reminder")}
                            value={toShortDateAndTime(task.reminder.date) || undefined}
                            mainActionIcon="delete"
                            onMainActionClick={deleteReminder}
                        >
                            <ReminderEdit reminder={task.reminder} onSave={(r) => updateTask({ reminder: r })} />
                        </Section>
                    }

                    {task.subtasks &&
                        <Section
                            title={t("Steps")}
                            value="0/3"
                            mainActionIcon="playlist_add"
                            onMainActionClick={openSubtasks}
                        >
                            {subtasks?.length === 0 &&
                                <span>No Steps</span>
                            }

                            {subtasks && subtasks?.length > 0 && subtasks.map(task =>
                                <div>
                                    <Link key={task.id} to={getTaskLink(task.id)}>
                                        {task.title + (task.reminder?.date ? " - " + toShortDateAndTime(task.reminder?.date) : "")}
                                    </Link>
                                </div>
                            )}

                            <div className="content-list-head d-flex flex-row" style={{ paddingTop: 8 }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ fontSize: "1rem" }}
                                    placeholder="Add New Step..."
                                    value={state.subtaskTitle || ""}
                                    onChange={(e) => setState({ ...state, subtaskTitle: e.currentTarget.value })}
                                    onKeyPress={(e) => onNewStepKeyPress(e)}
                                />
                                <i className="material-icons" style={{ marginLeft: 16, cursor: "pointer" }} onClick={() => addSubtask()}>add_circle_outline</i>
                            </div>
                        </Section>
                    }

                    {task.prevSteps &&
                        <FormListSection
                            items={prevSteps}
                            sectionTitle="Prev Steps"
                            mainAction={{
                                icon: "edit",
                                text: "Edit",
                                handler: props.getPrevStepsLink(task.id)
                            }}
                        >
                            {(item) => (
                                <Link to={props.getTaskLink(item.id)}>{item.title}</Link>
                            )}
                        </FormListSection>
                    }

                    {task.nextSteps &&
                        <FormListSection
                            items={nextSteps}
                            sectionTitle="Next Steps"
                            mainAction={{
                                icon: "edit",
                                text: "Edit",
                                handler: props.getNextStepsLink(task.id)
                            }}
                        >
                            {(item) => (
                                <Link to={props.getTaskLink(item.id)}>{item.title}</Link>
                            )}
                        </FormListSection>
                    }
                </div>

                <div className="col-sm-4">
                    <Section title={t("Add to Task")}>
                        <ActionButton icon="alarm" visible={!task.reminder} onClick={addReminder}>{t("Reminder")}</ActionButton>
                        <ActionButton icon="playlist_add_check" visible={!task.subtasks} onClick={addSubtasks}>{t("Steps")}</ActionButton>
                    </Section>
                    <Section title={t("Actions")}>
                        <ActionButton icon="favorite_border">{t("Save as Template")}</ActionButton>
                        {!task?.completedOn && <ActionButton icon="done" onClick={completeTask}>{t("Complete")}</ActionButton>}
                        {task?.completedOn && <ActionButton icon="restore" onClick={restoreTask}>{t("Restore")}</ActionButton>}
                        <br />
                        <ActionButton icon="delete" appearance="danger" onClick={deleteTask}>{t("Delete")}</ActionButton>
                    </Section>
                </div>
            </div>

            {state.selectedReminder &&
                <Modal show={state.selectedReminder !== undefined} size="lg" onHide={cancelEditReminder}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reminder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReminderEdit
                            reminder={state.selectedReminder}
                            onSave={(r) => updateSelectedReminder(r)}
                            onDelete={deleteReminder}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelEditReminder}>Cancel</Button>
                        <Button variant="primary" onClick={saveReminderChanges}>Save</Button>
                    </Modal.Footer>
                </Modal>
            }
        </form >
    )
}

function selectTasks(storage?: Map<TaskRef, Task>, ids?: TaskRef[]): Task[] | undefined {

    if (storage === undefined || ids === undefined)
        return [];

    return ids
        .map(id => storage.get(id))
        .filter(task => task !== undefined) as Task[]
}