import React, { useState, Dispatch } from "react";
import { createTask, Task, Reminder, TaskRef } from "../../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortDateAndTime } from '../../utils/dateTimeUtils';
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { FormListSection } from "./FormListSection";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { TasksStoreAction } from "../../store/tasksStore";
import { Link } from "react-router-dom";
import { Map } from "immutable"
import { ActionButton } from "../common/ActionButton";
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

    const [state, setState] = useState<TaskEditState>({})

    const currentUser = useSelector((state: RootState) => state.user.userId)
    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const task = ((props.taskId && tasks && tasks.get(props.taskId)) || undefined)
    const originTask = ((task?.parent && tasks && tasks.get(task.parent)) || undefined)

    const subtasks = selectTasks(tasks, task?.subtasks)
    const nextSteps = selectTasks(tasks, task?.nextSteps)
    const prevSteps = selectTasks(tasks, task?.prevSteps)

    const dispatch: Dispatch<TasksStoreAction> = useDispatch()
    const updateTask = (payload: Partial<Task>) => {
        if (props.taskId)
            dispatch({ type: 'tasks-updated', taskId: props.taskId, payload })
    }

    const editReminder = (event?: React.MouseEvent) => {

        event?.preventDefault()

        let selectedReminder: Reminder

        if (task?.reminder) {
            selectedReminder = task.reminder
        } else {
            const now = new Date()
            const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)
            selectedReminder = { date: tomorrowMorning };
        }

        setState({ ...state, selectedReminder })
    }

    const deleteReminder = () => {
        const reminder = state.selectedReminder;
        if (reminder) {
            updateTask({ reminder: undefined })
            setState({ selectedReminder: undefined })
        }
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

    return (
        <form>
            <div className="row">
                <div className="col-sm-8">
                    <div className="content-list">
                        <TextareaAutosize
                            disabled={task === undefined}
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
                    <div className="content-list">
                        <label>Notes</label>
                        <TextareaAutosize
                            disabled={task === undefined}
                            minRows={4}
                            className="form-control"
                            value={task?.notes}
                            onChange={(e) => updateTask({ notes: e.currentTarget.value })}
                        />
                    </div>

                    <FormListSection
                        items={task?.reminder ? [task.reminder] : []}
                        sectionTitle="Reminders"
                        mainAction={{
                            text: "Add Reminder",
                            handler: (e) => editReminder(e)
                        }}
                    >
                        {(reminder) => (
                            <a
                                href="/"
                                onClick={(e) => editReminder(e)}
                            >
                                <div><strong>{toShortDateAndTime(reminder.date)}</strong></div>
                            </a>
                        )}
                    </FormListSection>

                    {task &&
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

                    {task &&
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

                    {task &&
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

                    {task &&
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
                    <div className="d-flex">
                        <a className="flex-grow-1 d-flex" href="#">
                            <i className="material-icons">arrow_drop_down</i>
                            <h5>Actions</h5>
                        </a>
                        <i className="material-icons">edit</i>
                    </div>
                    <div>
                        <ActionButton icon="favorite_border">Save as Template</ActionButton>
                        <ActionButton icon="done">Complete</ActionButton>
                        <br/>
                        <ActionButton icon="delete" appearance="danger">Delete</ActionButton>
                    </div>
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

<<<<<<< HEAD
=======
interface ActionButtonProps {
    icon?: string
    children: React.ReactNode
    appearance?: ("primary" | "secondary" | "danger")
    onClick?: () => void
}

function ActionButton(props: ActionButtonProps) {
    return (
        <button
            type="button"
            className={"action-btn btn btn-block btn-" + (props.appearance || "secondary")}
            onClick={props.onClick}
        >
            <i className="material-icons">{props.icon || "chevron_right"}</i>
            &nbsp;
            {props.children}
        </button>
    )
}

>>>>>>> d2ac65d8f9329a3f556203fe20f350ab4cfdfeb2
function selectTasks(storage?: Map<TaskRef, Task>, ids?: TaskRef[]): Task[] | undefined {

    if (storage === undefined || ids === undefined)
        return [];

    return ids
        .map(id => storage.get(id))
        .filter(task => task !== undefined) as Task[]
}