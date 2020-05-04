import { Dispatch, AnyAction } from "redux"

export const logMiddleware = () => (next: Dispatch) => (action: AnyAction) => {
    console.log("Action starting:", action)
    next(action)
}