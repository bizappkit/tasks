import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import Button from "@material-ui/core/Button"


export function MainButton() {

	const mainButton = useSelector((state: RootState) => state.mainButton)

	if (!mainButton.visible)
		return null

	return (
		<Button color="primary" onClick={mainButton.handler}>
			{mainButton.text}
		</Button>
	)
}