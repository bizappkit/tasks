export interface ScheduleItem {
    taskId: string
    time?: Date
    title: string
    subtitle?: string
}

export interface Task {
    id: string
    title: string
    notes: string
    reminders: Reminder[]
}

export interface Reminder {
    time: Date
    notes: string
    repeat?: {
        type: 'dally'
        days: WeekDay[]
    } | {
        type: 'monthly'
        days: number[]
    } | {
        type: 'yearly'
        dates: {
            month: number
            date: number
        }[]
    }
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'