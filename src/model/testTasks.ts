import { Task, task, reminder } from './task';
import moment from 'moment';

const testTasks: Task[] = [
    task("Bill Gates", "Customer", [reminder(moment().add({days: 3}).set({hours: 9, minutes: 0}).toDate(), "Confirm dinner")]),
    task("Elon Musk", "Customer", [reminder(moment().add({days: 5}).set({hours: 14, minutes: 0}).toDate(), "Schedule Interview")]),
    task("Buy new airpods")
]

export default testTasks;