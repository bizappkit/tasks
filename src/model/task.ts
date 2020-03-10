export interface ScheduleItem {
    taskId: string
    title: string
    subtitle?: string
    reminderId?: string
    time?: Date
}

export interface Task {
    id: string
    title: string
    notes?: string
    reminders?: Reminder[]
}

export interface Reminder {
    id: string
    time: Date
    notes?: string
    repeat?: ReminderRepeatSettings
}

export type ReminderRepeatSettings = DallyReminderRepeatSettings | MonthlyReminderRepeatSettings | YearlyReminderRepeatSettings

export interface DallyReminderRepeatSettings {
    type: 'dally'
    days: WeekDay[]
}

export interface MonthlyReminderRepeatSettings {
    type: 'monthly'
    days: number[]
}

export interface YearlyReminderRepeatSettings {
    type: 'yearly'
    dates: {
        months: MonthNumber[]
        days: DateNumber[]
    }
}

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type DateNumber =
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
    21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
    31;

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export function findTask(tasks?: Task[], taskId?: string): Task | undefined {

    if (!tasks || !taskId)
        return undefined;

    return tasks.find(t => t.id === taskId);
}

export function orderTasksByName(tasks: Task[]): Task[] {
    let orderedTasks = tasks.slice(0)
    orderedTasks.sort((a, b) => a.title.localeCompare(b.title))
    return orderedTasks
}

export function getScheduleItems(now: Date, tasks: IterableIterator<Task>): ScheduleItem[] {

    let scheduleItems: ScheduleItem[] = []

    for (let t of tasks) {
        if (t.reminders) {
            t.reminders.forEach(r => scheduleItems.push({
                taskId: t.id,
                time: r.time,
                title: r.notes || t.title,
                subtitle: (r.notes ? t.title : t.notes),
                reminderId: r.id
            }))
        } else {
            scheduleItems.push({
                taskId: t.id,
                title: t.title,
                subtitle: t.notes,
            })
        }
    }

    scheduleItems.sort((a, b) => compareScheduleItems(now, a, b))

    return scheduleItems
}

function compareScheduleItems(now: Date, a: ScheduleItem, b: ScheduleItem): number {
    const timeA = getScheduleTime(now, a.time);
    const timeB = getScheduleTime(now, b.time);

    if (timeA !== timeB)
        return timeA - timeB;

    return a.title.localeCompare(b.title);
}

function getScheduleTime(now: Date, time?: Date): number {
    if (time === undefined)
        return -2;
    if (time < now)
        return -1;
    return time.valueOf();
}