import React, { useState } from "react";
import { Task, Reminder } from "../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortTimeStr } from '../utils/dateTimeUtils';
import { Modal, Button } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { v4 as uuid } from 'uuid';

interface TaskEditProps {
    task?: Task
    updateTask: (changes: Partial<Task>) => void
    reminderDeleted?: (reminder: Reminder) => void
}

interface TaskEditState {
    isNew?: boolean
    selectedReminderIndex?: number
    selectedReminder?: Reminder
}

export function TaskEdit(props: TaskEditProps) {

    const [state, setState] = useState<TaskEditState>({})

    const editReminder = (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index?: number) => {
        
        e?.preventDefault()

        if(!props.task?.reminders)
            return;

        let isNew = false

        //todo 

        if (!index || index < 0) {
            const now = new Date()
            const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9)
            index = props.task?.reminders?.push({id: uuid(), time: tomorrowMorning})
            isNew = true
        }

        setState({...state, isNew, selectedReminderIndex: index, selectedReminder: props.task?.reminders[index]})
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
            setState({ selectedReminder: { ...state.selectedReminder, ...payload } });
    }

    const saveReminderChanges = () => {
        if(props.task?.reminders && state.selectedReminder && state.selectedReminderIndex) {
            const reminders = props.task?.reminders?.slice(0);
            reminders[state.selectedReminderIndex] = state.selectedReminder;
            props.updateTask({reminders: reminders})
        }
    }

    const cancelEditReminder = () => {
        if(state.isNew) {

        }
        setState({ selectedReminder: undefined, selectedReminderIndex: undefined, isNew: undefined });
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
                        <a ref="/"
                            className="list-group-item list-group-item-action justify-content-between align-items-center"
                            onClick={(e) => editReminder(e, index)}
                        >
                            <span className="badge badge-pill badge-light">{toShortTimeStr(reminder.time)}</span>
                            &nbsp;
							<span>{reminder.notes || ""}</span>
                        </a>
                    ))}
                </ol>
                <a href="/">Add Reminder</a>
            </div>

            {state.selectedReminder &&
                <Modal show={state.selectedReminder !== undefined} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Reminder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReminderEdit
                            data={state.selectedReminder}
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