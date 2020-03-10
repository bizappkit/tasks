import React from "react";
import { Form } from "react-bootstrap";
import { Reminder, ReminderRepeatSettings, DallyReminderRepeatSettings, WeekDay, MonthlyReminderRepeatSettings, DateNumber, MonthNumber, YearlyReminderRepeatSettings } from "../model/task";


const RepeatNoneValue = 'none';
const RepeatDallyValue: ReminderRepeatSettings['type'] = 'dally'
const RepeatMonthlyValue: ReminderRepeatSettings['type'] = 'monthly'
const RepeatYearlyValue: ReminderRepeatSettings['type'] = 'yearly'

const weekDays: { value: WeekDay, text: string }[] = [
    { value: 'sunday', text: 'Sunday' },
    { value: 'monday', text: 'Monday' },
    { value: 'tuesday', text: 'Tuesday' },
    { value: 'wednesday', text: 'Wednesday' },
    { value: 'thursday', text: 'Thursday' },
    { value: 'friday', text: 'Friday' },
    { value: 'saturday', text: 'Saturday' }
]
const dates = Array(31).fill(0).map((_, index) => index + 1) as DateNumber[];

const months: { value: MonthNumber, text: string }[] = [
    { value: 1, text: 'January' },
    { value: 2, text: 'February' },
    { value: 3, text: 'March' },
    { value: 4, text: 'April' },
    { value: 5, text: 'May' },
    { value: 6, text: 'June' },
    { value: 7, text: 'July' },
    { value: 8, text: 'August' },
    { value: 9, text: 'September' },
    { value: 10, text: 'October' },
    { value: 11, text: 'November' },
    { value: 12, text: 'December' },
]

interface ReminderEditProps {
    data: Reminder
    onSave: (changes: Partial<Reminder>) => void
    onDelete?: () => void
}

export function ReminderEdit(props: ReminderEditProps) {

    const [state, setState] = React.useState(props.data)

    return (
        <form>
            <div className="form-group">
                <label>Reminder Notes</label>
                <input
                    placeholder="Notes"
                    className="form-control"
                    value={state.notes}
                    onChange={(e) => setState({ ...state, notes: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label>Repeat</label>
                <select
                    placeholder="Notes"
                    className="form-control"
                    value={state.repeat?.type ?? 'none'}
                    onChange={(e) => setState({ ...state, repeat: createRepeatSettings(e.currentTarget.value) })}
                >
                    <option value={RepeatNoneValue}>None</option>
                    <option value={RepeatDallyValue}>Dally</option>
                    <option value={RepeatMonthlyValue}>Monthly</option>
                    <option value={RepeatYearlyValue}>Yearly</option>
                </select>
            </div>

            {props.data.repeat?.type === 'dally' && (
                <div className="form-group">
                    <label>Weekdays</label>
                    {weekDays.map(currentDay => (
                        <Form.Check
                            label={currentDay.text}
                            value={currentDay.value}
                            checked={state.repeat?.type === 'dally' && state.repeat.days.includes(currentDay.value)}
                            onChange={() => setState({ ...state, repeat: updateWeekDays(state.repeat as DallyReminderRepeatSettings, currentDay.value) })} />
                    ))}
                </div>
            )}

            {props.data.repeat?.type === 'monthly' && (
                <div className="form-group">
                    <label>Days</label>
                    {dates.map(currentDate => (
                        <Form.Check
                            label={currentDate}
                            value={currentDate}
                            checked={state.repeat?.type === 'monthly' && state.repeat.days.includes(currentDate)}
                            onChange={() => setState({ ...state, repeat: updateMonthlyDates(state.repeat as MonthlyReminderRepeatSettings, currentDate) })} />
                    ))}
                </div>
            )}

            {props.data.repeat?.type === 'yearly' && (
                <div className="form-group">
                    <label>Months</label>
                    {months.map(currentMonth => (
                        <Form.Check
                            type="checkbox"
                            label={currentMonth.text}
                            value={currentMonth.value}
                            checked={state.repeat?.type === 'monthly' && state.repeat.days.includes(currentMonth.value)}
                            onChange={() => setState({ ...state, repeat: updateYearlyMonths(state.repeat as YearlyReminderRepeatSettings, currentMonth.value) })} />
                    ))}
                </div>
            )}

            {props.data.repeat?.type === 'yearly' && (
                <div className="form-group">
                    <label>Days</label>
                    {months.map(currentMonth => (
                        <Form.Check
                            label={currentMonth.text}
                            value={currentMonth.value}
                            checked={state.repeat?.type === 'monthly' && state.repeat.days.includes(currentMonth.value)}
                            onChange={() => setState({ ...state, repeat: updateYearlyDays(state.repeat as YearlyReminderRepeatSettings, currentMonth.value) })} />
                    ))}
                </div>
            )}
        </form>
    )
}

function updateYearlyDays(settings: YearlyReminderRepeatSettings, day: DateNumber): YearlyReminderRepeatSettings {
    return {
        ...settings,
        dates: {
            ...settings.dates,
            days: updateFlagsArray(settings.dates.days, day)
        }
    }
}

function updateYearlyMonths(settings: YearlyReminderRepeatSettings, day: MonthNumber): YearlyReminderRepeatSettings {
    return {
        ...settings,
        dates: {
            ...settings.dates,
            months: updateFlagsArray(settings.dates.months, day)
        }
    }
}

function updateWeekDays(settings: DallyReminderRepeatSettings, day: WeekDay): DallyReminderRepeatSettings {
    return { ...settings, days: updateFlagsArray(settings.days, day) }
}

function updateMonthlyDates(settings: MonthlyReminderRepeatSettings, day: DateNumber): MonthlyReminderRepeatSettings {
    return { ...settings, days: updateFlagsArray(settings.days, day) }
}

function updateFlagsArray<T>(current: T[], flag: T): T[] {

    if (current.includes(flag))
        return current.filter(d => d === flag)
    else
        return [...current, flag]
}

function createRepeatSettings(value: string): ReminderRepeatSettings | undefined {
    switch (value) {
        case RepeatDallyValue:
            return { type: 'dally', days: [] }
        case RepeatMonthlyValue:
            return { type: 'monthly', days: [] }
        case RepeatYearlyValue:
            return { type: 'yearly', dates: { months: [], days: [] } }
        default:
            return undefined
    }
}