import { Action } from 'redux'

export interface MainButtonShowAction extends Action {
	type: "mainButton-show"
	text: string
	handler: () => void
}

export interface MainButtonHideAction extends Action {
	type: "mainButton-hide"
}

export type MainButtonAction = MainButtonShowAction | MainButtonHideAction

export type MainButtonState = {
	visible: false
} | {
	visible: true
	text: string
	handler: () => void
}

const initialState: MainButtonState = {
	visible: false
}

export function mainButtonReducer(state = initialState, action: MainButtonAction): MainButtonState {
	switch (action.type) {
		case "mainButton-show":
			return {
				visible: true,
				text: action.text,
				handler: action.handler
			}

		case "mainButton-hide":
			return {
				visible: false
			}

		default:
			return state
	}
}