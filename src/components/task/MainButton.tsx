import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"

export function MainButton() {

	const mainButton = useSelector((state: RootState) => state.mainButton)

	if (!mainButton.visible)
		return null

	return (
		<button className="btn btn-primary" onClick={mainButton.handler}>
			{mainButton.text}
		</button>
	)
}