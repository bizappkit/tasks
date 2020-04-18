import { Task, createTask, createReminder } from './task';
import moment from 'moment';


const customerId = '41846032-CA88-46B0-A944-AA4F7117DCA0'
const billGatesId = '0AF2F9A5-9C1A-4F33-ACE6-89582B1E100C'
const elonMuskId = '41D78497-97FC-40AE-8C6D-830FC1CE4F9D'
const buyAirpodsId = '7CBD7AB2-C969-4DB3-A1A5-85C6CDC4FA2D'

const customerTask = createTask("Customer", undefined, undefined, undefined, customerId)
const billGatesTask = createTask("Bill Gates", "", createReminder(moment().add({ days: 3 }).set({ hours: 9, minutes: 0 }).toDate()), customerId, billGatesId)
const elonMuskTask = createTask("Elon Musk", "", createReminder(moment().add({ days: 5 }).set({ hours: 14, minutes: 0 }).toDate()), customerId, elonMuskId)
const buyAirpodsTask = createTask("Buy new airpods", undefined, undefined, undefined, buyAirpodsId)

customerTask.subtasks = [billGatesId, elonMuskId]

const testTasks: Task[] = [
    customerTask,
    billGatesTask,
    elonMuskTask,
    buyAirpodsTask
]

export default testTasks;