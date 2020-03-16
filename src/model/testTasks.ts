import { Task, task, reminder } from './task';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

const customerId = uuid();

const testTasks: Task[] = [
    task("Customer", undefined, undefined, undefined, customerId),
    task("Bill Gates", "", [reminder(moment().add({ days: 3 }).set({ hours: 9, minutes: 0 }).toDate(), "Confirm dinner")], customerId),
    task("Elon Musk", "", [reminder(moment().add({ days: 5 }).set({ hours: 14, minutes: 0 }).toDate(), "Schedule Interview")], customerId),
    task("Buy new airpods")
]

export default testTasks;