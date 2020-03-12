import { Task } from './task';

const testTasks: Task[] = [
    {
        id: "t:1",
        title: 'Test Task 1',
        notes: 'Some text for task notes'
    },
    {
        id: "t:2",
        title: 'Test Task 2',
        notes: 'Some text for task notes',
        reminders: [
            {
                id: "r:1",
                notes: "Don't forgot about this task",
                on: new Date()
            }
        ]
    }
]

export default testTasks;