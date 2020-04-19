
export interface UserStoreState {
	loading: boolean
	userId?: string
}

const initialState: UserStoreState = {
	loading: true
}

export interface UserStoreAction {
	type: "user-set"
	userId: string
}

export function userReducer(state = initialState, action: UserStoreAction): UserStoreState {
	switch(action.type) {
		case "user-set":
			return {
				...state,
				loading: false,
				userId: action.userId
			}

		default:
			return state
	}
}
