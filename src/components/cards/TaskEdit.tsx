import React, { useState, Dispatch } from "react";
import { createTask, Task, Reminder, TaskRef } from "../../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortDateAndTime } from '../../utils/dateTimeUtils';
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { v4 as uuid } from 'uuid';
import { FormListSection } from "./FormListSection";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { TasksStoreAction } from "../../store/tasksStore";
import { Link } from "react-router-dom";
import { Map } from "immutable"

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

    selectedReminderIndex?: number
    selectedReminder?: Reminder
    subtaskTitle?: string
}

interface CompletionStatistics {
    completedCount: number
    allCount: number
}

export function TaskEdit(props: TaskEditProps) {

    const [state, setState] = useState<TaskEditState>({})

    const tasks = useSelector((state: RootState) => state.tasks.idToTask)
    const task = ((props.taskId && tasks && tasks.get(props.taskId)) || undefined)
    const originTask = ((task?.parent && tasks && tasks.get(task.parent)) || undefined)

    const subtasks = selectTasks(tasks, task?.subtasks)
    const nextSteps = selectTasks(tasks, task?.nextSteps)
    const prevSteps = selectTasks(tasks, task?.prevSteps)

    console.log("Subtasks", subtasks)

    const dispatch: Dispatch<TasksStoreAction> = useDispatch()
    const updateTask = (payload: Partial<Task>) => {
        if (props.taskId)
            dispatch({ type: 'tasks-updated', taskId: props.taskId, payload })
    }

    const editReminder = (event?: React.MouseEvent, index?: number) => {

        event?.preventDefault()

        let selectedReminder: Reminder

        if (index !== undefined && index >= 0 && task?.reminders) {
            selectedReminder = task.reminders[index]
        } else {
            const now = new Date()
            const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)
            selectedReminder = { id: uuid(), on: tomorrowMorning };
            index = undefined;
        }

        setState({ ...state, selectedReminderIndex: index, selectedReminder })
    }

    const deleteReminder = () => {
        const reminder = state.selectedReminder;
        if (reminder) {
            updateTask({ reminders: task?.reminders?.filter(r => r === reminder) })
            setState({ selectedReminder: undefined })
        }
    }

    const updateSelectedReminder = (payload: Partial<Reminder>) => {
        if (state.selectedReminder)
            setState({ ...state, selectedReminder: { ...state.selectedReminder, ...payload } })
    }

    const saveReminderChanges = () => {

        if (state.selectedReminder) {

            const reminders = task?.reminders?.slice(0) || []

            if (state.selectedReminderIndex !== undefined)
                reminders[state.selectedReminderIndex] = state.selectedReminder;
            else
                reminders.push(state.selectedReminder);

            reminders.sort((a, b) => a.on.valueOf() - b.on.valueOf());

            updateTask({ reminders: reminders })

            cancelEditReminder()
        }
    }

    const cancelEditReminder = () => {
        setState({ selectedReminder: undefined, selectedReminderIndex: undefined })
    }

    const onNewStepKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.charCode === 13) {
            addSubtask(event)
        }
    }

    const addSubtask = (event?: { preventDefault: () => void }) => {

        event?.preventDefault()

        if (!task || !state.subtaskTitle)
            return;

        const title = state.subtaskTitle.trim();

        if (title.length === 0)
            return;

        const newTask = createTask(title, undefined, undefined, task.id)

        dispatch({ type: "tasks-new-task", task: newTask })

        setState({ ...state, subtaskTitle: "" })
    }

    return (
        <form>
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
                    <Link to={"task/" + originTask?.id}>{originTask.title}</Link>
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
                items={task?.reminders}
                sectionTitle="Reminders"
                mainAction={{
                    text: "Add Reminder",
                    handler: (e) => editReminder(e)
                }}
            >
                {(reminder, index) => (
                    <a
                        href="/"
                        onClick={editReminder}
                    >
                        <div><strong>{toShortDateAndTime(reminder.on)}{reminder.notes ? ": " : " "}</strong>{reminder.notes || ""}</div>
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
                <div className="content-list-head" style={{ paddingTop: 8 }}>
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