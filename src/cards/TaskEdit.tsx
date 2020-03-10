import React, { useState } from "react";
import { Task, Reminder } from "../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortTimeStr } from '../utils/dateTimeUtils';
import { Modal } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";

interface TaskEditProps {
    task?: Task
    updateTask: (changes: Partial<Task>) => void
    reminderDeleted?: (reminder: Reminder) => void
}

interface TaskEditState {
    selectedReminder?: Reminder
}

export function TaskEdit(props: TaskEditProps) {

    const [state, setState] = useState<TaskEditState>({})

    const deleteReminder = () => {
        const reminder = state.selectedReminder;
        if (reminder) {
            props.updateTask({ reminders: props.task?.reminders?.filter(r => r === reminder) })
            setState({ selectedReminder: undefined })
            if (props.reminderDeleted)
                props.reminderDeleted(reminder)
        }
    }

    const updateReminder = (payload: Partial<Reminder>) => {
        if (state.selectedReminder)
            setState({ selectedReminder: { ...state.selectedReminder, ...payload } });
    }

    const reminderEditClosed = () => {
        setState({ selectedReminder: undefined });
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
                    {props.task && props.task.reminders && props.task.reminders.length > 0 && props.task.reminders.map(reminder => (
                        <a href="/" className="list-group-item list-group-item-action justify-content-between align-items-center">
                            <span className="badge badge-pill badge-light">{toShortTimeStr(reminder.time)}</span>
                            &nbsp;
								<span>{reminder.notes || ""}</span>
                        </a>
                    ))}
                </ol>
                <a href="/">Add Reminder</a>
            </div>

            {state.selectedReminder &&
                <Modal show={state.selectedReminder !== undefined}>
                    <Modal.Body>
                        <ReminderEdit
                            data={state.selectedReminder}
                            onSave={(r) => updateReminder(r)}
                            onDelete={deleteReminder}
                            onClose={reminderEditClosed}
                        />
                    </Modal.Body>
                </Modal>
            }
        </form>


    )
}