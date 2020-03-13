import { Task, task, reminder } from './task';
import moment from 'moment';

const testTasks: Task[] = [
    task("Bill Gates", "Customer", [reminder(moment().add({days: 3}).set({hours: 9, minutes: 0}).toDate(), "Confirm dinner")], undefined, "B0FD804F-FFA0-4A59-AF9C-B9B929EA8250"),
    task("Elon Musk", "Customer", [reminder(moment().add({days: 5}).set({hours: 14, minutes: 0}).toDate(), "Schedule Interview")], undefined, "0169F6EB-C79E-4C0B-A5B4-4B604B0BE885"),
    task("Buy new airpods", undefined, undefined, undefined, "25A07891-F23C-4614-BB1D-B92E6C021ECC")
]

export default testTasks;