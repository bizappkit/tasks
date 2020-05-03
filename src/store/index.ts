import { createStore, applyMiddleware } from "redux"
import { firestoreMiddleware } from "./firestoreMiddleware";
import { rootReducer, RootReducerType } from "./rootReducer";
import { useDispatch, useSelector } from "react-redux";

function configureStore() {
	return createStore(
		rootReducer, 
		applyMiddleware(
			firestoreMiddleware
		)
	)
}

export const store = configureStore();

export type RootState = RootReducerType

export function useRootDispatch() {
	return useDispatch<typeof store.dispatch>()
}

export function useRootSelector<T>(selector: (state: RootState) => T): T {
	return useSelector(selector)
}