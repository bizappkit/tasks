import React, { useState } from "react";
import { Task, Reminder } from "../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortDateAndTime } from '../utils/dateTimeUtils';
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { v4 as uuid } from 'uuid';

interface TaskEditProps {
    task?: Task
    updateTask: (changes: Partial<Task>) => void
    reminderDeleted?: (reminder: Reminder) => void
}

interface TaskEditState {
    selectedReminderIndex?: number
    selectedReminder?: Reminder
}

export function TaskEdit(props: TaskEditProps) {

    const [state, setState] = useState<TaskEditState>({})

    const editReminder = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index?: number) => {

        e.preventDefault()

        let selectedReminder: Reminder

        console.log("editReminder:", index, props.task?.reminders)

        if (index !== undefined && index >= 0 && props.task?.reminders) {
            selectedReminder = props.task.reminders[index]
        } else {
            const now = new Date()
            const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)
            selectedReminder = { id: uuid(), time: tomorrowMorning };
            index = undefined;
        }

        setState({ ...state, selectedReminderIndex: index, selectedReminder })
    }

    const deleteReminder = () => {
        const reminder = state.selectedReminder;
        if (reminder) {
            props.updateTask({ reminders: props.task?.reminders?.filter(r => r === reminder) })
            setState({ selectedReminder: undefined })
            if (props.reminderDeleted)
                props.reminderDeleted(reminder)
        }
    }

    const updateSelectedReminder = (payload: Partial<Reminder>) => {
        if (state.selectedReminder)
            setState({ ...state, selectedReminder: { ...state.selectedReminder, ...payload } })
    }

    const saveReminderChanges = () => {
        if (props.task?.reminders && state.selectedReminder) {

            console.log("saveReminderChanges", state)

            const reminders = props.task?.reminders?.slice(0);

            if (state.selectedReminderIndex !== undefined)
                reminders[state.selectedReminderIndex] = state.selectedReminder;
            else
                reminders.push(state.selectedReminder);

            props.updateTask({ reminders: reminders })

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
                    disabled={props.task === undefined}
                    placeholder="Task Title"
                    className="form-control"
                    style={{ fontSize: "2rem" }}
                    value={props.task?.title}
                    onChange={(e) => props.updateTask({ title: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label>Notes</label>
                <TextareaAutosize
                    disabled={props.task === undefined}
                    minRows={4}
                    className="form-control"
                    value={props.task?.notes}
                    onChange={(e) => props.updateTask({ notes: e.currentTarget.value })}
                />
            </div>

            <div className="form-group">
                <label>Reminders</label>
                <ol className="list-group">
                    {props.task && props.task.reminders && props.task.reminders.length > 0 && props.task.reminders.map((reminder, index) => (
                        <a
                            key={index}
                            href="/"
                            className="list-group-item list-group-item-action justify-content-between align-items-center"
                            onClick={(e) => editReminder(e, index)}
                        >
                            <span className="badge badge-pill badge-light">{toShortDateAndTime(reminder.time)}</span>
                            &nbsp;
                            <span>{reminder.notes || ""}</span>
                        </a>
                    ))}
                </ol>
                <a href="/" onClick={(e) => editReminder(e)}>Add Reminder</a>
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
        </form>


    )
}