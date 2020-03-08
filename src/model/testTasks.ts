import { Task } from './task';

const testTasks: Task[] = [
    {
        id: "t:1",
        title: 'Test Task 1',
        notes: 'Some text for task notes'
    },
    {
        id: "2",
        title: 'Test Task 1',
        notes: 'Some text for task notes',
        reminders: [
            {
                id: "r:1",
                notes: "Don't forgot about this task",
                time: new Date()
            }
        ]
    }
]

export default testTasks;