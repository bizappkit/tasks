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
//const analytics = Firebase.analytics(app);
const firestore = Firebase.firestore(app)
firestore.enablePersistence({synchronizeTabs: true})

const TasksCollection = "tasks"

export async function subscribeToTasks(email: string, password: string, next: (docs: Task[]) => void) {

	if(!auth.currentUser) {
		await auth.signInWithEmailAndPassword(email, password)
	}

	return firestore.collection(TasksCollection)
		.where("owner", "==", auth.currentUser?.uid)
		.onSnapshot(
			snapshot => next(snapshot.docs.map(d => {
				return {
					...(d.data() as Task),
					id: d.id
				}
			})),
			error => console.error(error)
		)
}

export async function insertTask(task: Task): Promise<void> {
	const ref = firestore.collection(TasksCollection).doc()
	task.id = ref.id
	ref.set(task)
}

export function updateTask(taskId: string, changes: Partial<Task>): Promise<void> {
	return firestore.collection(TasksCollection).doc(taskId).update(changes)
}
