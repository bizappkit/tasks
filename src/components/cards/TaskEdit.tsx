import React, { useState, Dispatch } from "react";
import { Task, Reminder } from "../../model/task";
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

interface TaskEditProps {
    taskId?: string
}

interface TaskEditState {
    //task?: Task
    //originTask?: Task
    //steps?: Task[]
    //prevSteps?: CompletionStatistics
    //nextSteps?: CompletionStatistics

    selectedReminderIndex?: number
    selectedReminder?: Reminder
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

    const dispatch: Dispatch<TasksStoreAction> = useDispatch()
    const updateTask = (payload: Partial<Task>) => {
        if (props.taskId)
            dispatch({ type: 'tasks-updated', taskId: props.taskId, payload })
    }

    const editReminder = (event: React.MouseEvent<HTMLAnchorElement>, index?: number) => {

        event.preventDefault()

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
        setState({ selectedReminder: undefined, selectedReminderIndex: undefined });
    }

    return (
        <form>
            <div className="form-group">
                <TextareaAutosize
                    disabled={task === undefined}
                    placeholder="Task Title"
                    className="form-control"
                    style={{ fontSize: "2rem" }}
                    value={task?.title}
                    onChange={(e) => updateTask({ title: e.currentTarget.value })}
                />
            </div>
            {originTask &&
                <div className="form-group">
                    <label>Origin:&nbsp;</label>
                    <Link to={"/task/" + originTask?.id}>{originTask.title}</Link>
                </div>
            }
            <div className="form-group">
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
                addItemText="Add Reminder"
            >
                {(reminder, index) => (
                    <a
                        href="/"
                        onClick={(e) => editReminder(e, index)}
                    >
                        <div><strong>{toShortDateAndTime(reminder.on)}{reminder.notes ? ": " : " "}</strong>{reminder.notes || ""}</div>
                    </a>
                )}
            </FormListSection>

            {/* <FormListSection
                items={["Origin", "Steps", "Previous", "Next"]}
                sectionTitle="Relations"
                onItemClick={(_, index) => editReminder(index)}
            >
                {(item) => (
                    <div><span>{item}</span></div>
                )}
            </FormListSection> */}

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
        </form>
    )
}