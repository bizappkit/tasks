import React, { useState } from "react";
import { Task, Reminder } from "../../model/task";
import TextareaAutosize from "react-textarea-autosize";
import { toShortDateAndTime } from '../../utils/dateTimeUtils';
import { Modal, Button, Badge } from "react-bootstrap";
import { ReminderEdit } from "./ReminderEdit";
import { v4 as uuid } from 'uuid';
import { FormListSection } from "./FormListSection";

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

    const editReminder = (index?: number) => {

        let selectedReminder: Reminder

        if (index !== undefined && index >= 0 && props.task?.reminders) {
            selectedReminder = props.task.reminders[index]
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

        if (state.selectedReminder) {

            const reminders = props.task?.reminders?.slice(0) || []

            if (state.selectedReminderIndex !== undefined)
                reminders[state.selectedReminderIndex] = state.selectedReminder;
            else
                reminders.push(state.selectedReminder);

            reminders.sort((a, b) => a.on.valueOf() - b.on.valueOf());

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

            <FormListSection
                items={props.task?.reminders}
                sectionTitle="Reminders"
                addItemText="Add Reminder"
                onItemClick={(_, index) => editReminder(index)}
                onAddItem={() => editReminder()}
            >
                {(reminder) => (
                    <span><strong>{toShortDateAndTime(reminder.on)}{reminder.notes ? ": " : " "}</strong>{reminder.notes || ""}</span>
                )}
            </FormListSection>

            <FormListSection
                items={["Sub Steps", "Previous Steps", "Next Steps"]}
                sectionTitle="Related Tasks"
                onItemClick={(_, index) => editReminder(index)}
            >
                {(item) => (
                    <div><span>{item} </span><Badge variant="primary">2/5</Badge></div>
                )}
            </FormListSection>

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