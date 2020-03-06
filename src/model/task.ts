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
    notes: string
    reminders: Reminder[]
}

export interface Reminder {
    id: string
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