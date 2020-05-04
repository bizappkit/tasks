import Firebase from "firebase";
import { Task, TaskRef } from "../model/task";

const firebaseConfig = {
	apiKey: "AIzaSyANjSC-PcKqSQSTCq-j039vgoT16yltHb4",
	authDomain: "bizappkit-32089.firebaseapp.com",
	databaseURL: "https://bizappkit-32089.firebaseio.com",
	projectId: "bizappkit-32089",
	storageBucket: "bizappkit-32089.appspot.com",
	messagingSenderId: "377385016314",
	appId: "1:377385016314:web:bdef44cc9a9efa59472243",
	measurementId: "G-04T0WWCT18"
}

const app = Firebase.initializeApp(firebaseConfig)
const auth = app.auth()

const firestore = Firebase.firestore(app)
firestore.enablePersistence({ synchronizeTabs: true })

//const analytics = Firebase.analytics(app);

const tasksCollection = firestore.collection("tasks")

export async function signInWithEmailAndPassword(email: string, password: string): Promise<string | undefined> {

	if (auth.currentUser) {
		return auth.currentUser.uid
	}

	const result = await auth.signInWithEmailAndPassword(email, password)

	return result.user?.uid
}

export type TaskFilter = ({
	tasks: TaskRef[]
} | {
	//status: "all" | "active" | "pending"
	completion: "all" | "incompleted"
}) & {
	orderBy?: "reminder.date" | "createdOn" | "title"
}

export const scheduleFilter: TaskFilter = {
	completion: "incompleted"
}

export function subscribeToTasks(filter = scheduleFilter, next: (docs: Task[]) => void) {

	if (!auth.currentUser)
		throw new Error("auth.currentUser is undefined.")

	let query = tasksCollection.where("owner", "==", auth.currentUser.uid);

	if ("tasks" in filter) {
		tasksCollection.where(Firebase.firestore.FieldPath.documentId(), "in", filter.tasks)
	} else {
		if (filter.completion === "incompleted")
			query = query.where("completedOn", "==", null)

		if (filter.orderBy === "createdOn")
			query = query.orderBy("createdOn", "desc")
		else if (filter.orderBy === "title")
			query = query.orderBy("title", "asc")
		// else
		// 	query = query.orderBy("reminder.date", "asc")
	}

	return query.onSnapshot(
		snapshot => next(snapshot.docs.map(d => {
			return {
				...getTaskFromDoc(d.data()),
				id: d.id
			}
		})),
		error => console.error(error)
	)
}

export async function insertTask(task: Task): Promise<void> {
	const ref = tasksCollection.doc()
	task.id = ref.id
	ref.set(task)
}

export function updateTask(taskId: string, changes: Partial<Task>): Promise<void> {
	return tasksCollection.doc(taskId).update(changes)
}

export function deleteTask(taskId: string): Promise<void> {
	return tasksCollection.doc(taskId).delete()
}

function getTaskFromDoc(data: any): Task {

	let task = { ...data }

	if (task.reminder?.date instanceof Firebase.firestore.Timestamp) {
		task.reminder.date = task.reminder.date.toDate()
	}

	if (task.completedOn instanceof Firebase.firestore.Timestamp) {
		task.completedOn = task.completedOn.toDate()
	}

	return task as Task
}