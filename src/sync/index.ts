import Firebase from "firebase";
import { Task } from "../model/task";

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

export function subscribeToTasks(userId: string, next: (docs: Task[]) => void) {

	return tasksCollection
		.where("owner", "==", userId)
		.onSnapshot(
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