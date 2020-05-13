import React, { useState, useEffect } from "react";
import { createTask, Task, Reminder, TaskRef } from "../../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { FormListSection } from "./FormListSection";
import { useSelector } from "react-redux";
import { RootState, useRootDispatch } from "../../store";
import { Link, useHistory } from "react-router-dom";
import { Map } from "immutable"
import { ActionButton } from "../common/ActionButton";
import { useTranslation } from "react-i18next";
import { Section } from "../common/Section";
import { toShortDateAndTime } from "../../utils/dateTimeUtils";

import "./TaskEdit.css"

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

interface CompletionStatistics {
    completedCount: number
    allCount: number
}

export function TaskEdit(props: TaskEditProps) {

    const history = useHistory()
    const { t } = useTranslation()
    const [state, setState] = useState<TaskEditState>({})
    const dispatch = useRootDispatch()

    const currentUser = useSelector((state: RootState) => state.user.userId)
    const tasks = useSelector((state: RootState) => state.taskList.idToTask)
    const task = ((props.taskId && tasks && tasks.get(props.taskId)) || undefined)
    const originTask = ((task?.parent && tasks && tasks.get(task.parent)) || undefined)

    const subtasks = selectTasks(tasks, task?.subtasks)
    const nextSteps = selectTasks(tasks, task?.nextSteps)
    const prevSteps = selectTasks(tasks, task?.prevSteps)

    useEffect(() => {
        const allTaskIds: string[] = []
        if (props.taskId) allTaskIds.push(props.taskId)
        if (task?.subtasks) allTaskIds.push(...task?.subtasks)
        if (task?.nextSteps) allTaskIds.push(...task?.subtasks)
        if (task?.prevSteps) allTaskIds.push(...task?.subtasks)

        dispatch({ type: "tasks-start-loading", filter: { tasks: allTaskIds } })

    }, [dispatch, props.taskId, task])

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

    if (!task) {
        return <div>Loading...</div>
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
                        <FormListSection
                            items={subtasks}
                            sectionTitle="Steps"
                            mainAction={{
                                icon: "edit",
                                text: "Edit",
                                handler: props.getStepsLink(task.id)
                            }}
                        >
                            {(item) => (
                                <Link to={props.getTaskLink(item.id)}>{item.title}</Link>
                            )}
                        </FormListSection>
                    }

                    {task.subtasks &&
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
                            <button className="btn btn-round" title="Add" style={{ marginLeft: 16 }} onClick={(e) => addSubtask(e)}>
                                <i className="material-icons">add</i>
                            </button>
                        </div>
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
                        <ActionButton icon="playlist_add_check">{t("Steps")}</ActionButton>
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