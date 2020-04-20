import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Reminder, ReminderRepeatSettings, DallyReminderRepeatSettings, WeekDay, MonthlyReminderRepeatSettings, DateNumber, MonthNumber, YearlyReminderRepeatSettings } from "../../model/task";
import { setTime, setDate } from "../../utils/dateTimeUtils";
import moment from "moment";

const RepeatNoneValue = 'none';
const RepeatDallyValue: ReminderRepeatSettings['type'] = 'dally'
const RepeatMonthlyValue: ReminderRepeatSettings['type'] = 'monthly'
const RepeatYearlyValue: ReminderRepeatSettings['type'] = 'yearly'

const weekDays: { value: WeekDay, text: string }[] = [
    { value: 'monday', text: 'Monday' },
    { value: 'tuesday', text: 'Tuesday' },
    { value: 'wednesday', text: 'Wednesday' },
    { value: 'thursday', text: 'Thursday' },
    { value: 'friday', text: 'Friday' },
    { value: 'saturday', text: 'Saturday' },
    { value: 'sunday', text: 'Sunday' }
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

interface Time {
    hours: number
    minutes: number
}

const times: Time[] = Array(24 * 4).fill(0).map((value, index) => {
    return {
        hours: Math.floor(index / 4),
        minutes: Math.floor(index * 15 % 60)
    }
})

interface ReminderEditProps {
    reminder: Reminder
    onSave: (changes: Partial<Reminder>) => void
    onDelete?: () => void
}

export function ReminderEdit(props: ReminderEditProps) {

    return (
        <form>
            <div className="form-group">
                <label>Remind me on</label>
                <Row>
                    <Col>
                        <Form.Control
                            type="date"
                            placeholder="Date"
                            value={moment(props.reminder.date).format("YYYY-MM-DD")}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => props.onSave({ ...props.reminder, date: setDate(props.reminder.date, e.currentTarget.value) })}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            style={{ width: "8rem" }}
                            as="select"
                            placeholder="Time"
                            value={moment(props.reminder.date).format("HH:mm")}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => props.onSave({ ...props.reminder, date: setTime(props.reminder.date, e.currentTarget.value) })}
                        >
                            {times.map(t =>
                                <option value={moment().hours(t.hours).minutes(t.minutes).format("HH:mm")}>{moment().hours(t.hours).minutes(t.minutes).format("LT")}</option>
                            )}
                        </Form.Control>
                    </Col>
                </Row>
            </div>
            <div className="form-group">
                <label>Repeat</label>
                <select
                    placeholder="Notes"
                    className="form-control"
                    value={props.reminder.repeat?.type ?? 'none'}
                    onChange={(e) => props.onSave({ ...props.reminder, repeat: createRepeatSettings(e.currentTarget.value) })}
                >
                    <option value={RepeatNoneValue}>None</option>
                    <option value={RepeatDallyValue}>Dally</option>
                    <option value={RepeatMonthlyValue}>Monthly</option>
                    <option value={RepeatYearlyValue}>Yearly</option>
                </select>
            </div>

            {props.reminder.repeat?.type === 'dally' && (
                <div className="form-group">
                    <label>Weekdays</label>
                    <Row>
                        {weekDays.map(currentDay => (
                            <Col key={currentDay.value} xs={4}>
                                <Form.Check
                                    id={"weekday:" + currentDay.value}
                                    label={currentDay.text}
                                    value={currentDay.value}
                                    checked={props.reminder.repeat?.type === 'dally' && props.reminder.repeat.days.includes(currentDay.value)}
                                    onChange={() => props.onSave({ ...props.reminder, repeat: updateWeekDays(props.reminder.repeat as DallyReminderRepeatSettings, currentDay.value) })} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {props.reminder.repeat?.type === 'monthly' && (
                <div className="form-group">
                    <label>Days</label>
                    <Row>
                        {dates.map(currentDate => (
                            <Col key={currentDate} xs={2}>
                                <Form.Check
                                    id={"day:" + currentDate}
                                    label={currentDate}
                                    value={currentDate}
                                    checked={props.reminder.repeat?.type === 'monthly' && props.reminder.repeat.days.includes(currentDate)}
                                    onChange={() => props.onSave({ ...props.reminder, repeat: updateMonthlyDates(props.reminder.repeat as MonthlyReminderRepeatSettings, currentDate) })} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {props.reminder.repeat?.type === 'yearly' && (
                <div className="form-group">
                    <label>Months</label>
                    <Row>
                        {months.map(currentMonth => (
                            <Col key={currentMonth.value} xs={4}>
                                <Form.Check
                                    id={"month:" + currentMonth.value}
                                    type="checkbox"
                                    label={currentMonth.text}
                                    value={currentMonth.value}
                                    checked={props.reminder.repeat?.type === 'yearly' && props.reminder.repeat.dates.months.includes(currentMonth.value)}
                                    onChange={() => props.onSave({ ...props.reminder, repeat: updateYearlyMonths(props.reminder.repeat as YearlyReminderRepeatSettings, currentMonth.value) })} />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {props.reminder.repeat?.type === 'yearly' && (
                <div className="form-group">
                    <label>Days</label>
                    <Row>
                        {dates.map(currentDate => (
                            <Col key={currentDate} xs={2}>
                                <Form.Check
                                    id={"day:" + currentDate}
                                    label={currentDate}
                                    value={currentDate}
                                    checked={props.reminder.repeat?.type === 'yearly' && props.reminder.repeat.dates.days.includes(currentDate)}
                                    onChange={() => props.onSave({ ...props.reminder, repeat: updateYearlyDays(props.reminder.repeat as YearlyReminderRepeatSettings, currentDate) })} />
                            </Col>
                        ))}
                    </Row>
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

    console.log("updateFlagsArray - current", current);

    let result: T[]

    if (current.includes(flag))
        result = current.filter(d => d !== flag)
    else
        result = [...current, flag];

    console.log("updateFlagsArray - result", result);

    return result
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