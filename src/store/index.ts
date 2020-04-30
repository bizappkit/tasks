import { createStore, applyMiddleware } from "redux"
import { firestoreMiddleware } from "./firestoreMiddleware";
import { rootReducer, RootReducerType } from "./rootReducer";

export type RootState = RootReducerType

export function configureStore() {
	return createStore(
		rootReducer, 
		applyMiddleware(
			firestoreMiddleware
		)
	)
}
