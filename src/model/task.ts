import { v4 as uuid } from 'uuid';
import { Map } from "immutable";

export function createTask(title: string, notes?: string, reminders?: Reminder[], parent?: TaskRef, id?: string): Task {
    return {
        id: id || uuid(),
        createdOn: new Date(),
        title,
        notes,
        parent,
        reminders,
    }
}

export function createReminder(on?: Date, notes?: string): Reminder {
    return {
        id: uuid(),
        on: on || new Date(),
        notes
    }
}

export type UUID = string

export type TaskRef = UUID

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
    createdOn: Date
    notes?: string
    reminders?: Reminder[]
    parent?: TaskRef
    subtasks?: TaskRef[]
    prevSteps?: TaskRef[]
    nextSteps?: TaskRef[]
}

export interface Reminder {
    id: string
    on: Date
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
    1 | 2 | 3 | 4 | 5 | 6 | 7 |
    8 | 9 | 10 | 11 | 12 | 13 | 14 |
    15 | 16 | 17 | 18 | 19 | 20 | 21 |
    22 | 23 | 24 | 25 | 26 | 27 | 28 |
    29 | 30 | 31;

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

export function getScheduleItems(now: Date, tasks?: IterableIterator<Task>): ScheduleItem[] {

    let scheduleItems: ScheduleItem[] = []

    if (tasks) {
        for (let t of tasks) {
            if (t.reminders) {
                t.reminders.forEach(r => scheduleItems.push({
                    taskId: t.id,
                    time: r.on,
                    title: r.notes || t.title,
                    subtitle: (r.notes ? t.title : t.notes),
                    reminderId: r.id
                }))
            } else {
                scheduleItems.push({
                    reminderId: t.id,
                    taskId: t.id,
                    title: t.title,
                    subtitle: t.notes,
                })
            }
        }

        scheduleItems.sort((a, b) => compareScheduleItems(now, a, b))
    }

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

export function getTaskListFilterMode(str?: string): TaskListFilterMode | undefined {
    return str && TaskListFilterModeValues.has(str) ? str as TaskListFilterMode : undefined
}

export function getSelectedTasks(tasks?: Map<TaskRef, Task>, options?: FilterOptions): { selected: Task[], other: Task[] } | undefined {

    if (!tasks || !options)
        return undefined

    const contextTask = options.contextTaskId && tasks.get(options.contextTaskId)

    if (!contextTask)
        return undefined

    const allTasks = Array.from(tasks?.values())

    const selectedTaskIds = getSelectedTaskIds(contextTask, options.filterMode)
    const ignoreFilter = getOtherFilter(contextTask, options.filterMode)

    const selected = allTasks.filter(t => selectedTaskIds.has(t.id))
    const other = allTasks.filter(ignoreFilter)

    return { selected, other }
}

export type TaskListFilterMode = "subSteps" | "nextSteps" | "prevSteps"
export const TaskListFilterModeValues: ReadonlySet<string> = new Set<TaskListFilterMode>(["subSteps", "nextSteps", "prevSteps"])

export interface FilterOptions {
    contextTaskId?: TaskRef
    filterMode?: TaskListFilterMode
}

type TaskFilter = (task: Task) => boolean

function getOtherFilter(contextTask: Task, mode?: TaskListFilterMode): TaskFilter {
    switch (mode) {
        case "subSteps":
            return (task) => task.parent === undefined && task !== contextTask

        case "prevSteps":
            const nextTaskIds = new Set(contextTask.nextSteps)
            return (task) => task !== contextTask && !nextTaskIds.has(task.id)

        case "nextSteps":
            const prevTaskIds = new Set(contextTask.prevSteps)
            return (task) => task !== contextTask && !prevTaskIds.has(task.id)
    }

    return () => true
}

function getSelectedTaskIds(contextTask: Task, mode?: TaskListFilterMode): Set<TaskRef> {

    const field = getTaskFieldByFilterMode(mode)

    return new Set((field ? contextTask[field] as TaskRef[] : []));
}

export function getTaskFieldByFilterMode(mode?: TaskListFilterMode): (keyof Task & ("subtasks" | "nextSteps" | "prevSteps")) | undefined {
    switch (mode) {
        case "subSteps":
            return "subtasks"

        case "nextSteps":
            return "nextSteps"

        case "prevSteps":
            return "prevSteps"
    }
}
