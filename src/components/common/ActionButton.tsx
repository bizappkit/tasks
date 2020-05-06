import React from "react";

interface ActionButtonProps {
    icon: string
    children: React.ReactNode
    visible?: boolean
    appearance?: ("primary" | "secondary" | "danger")
    onClick?: () => void
}

export function ActionButton(props: ActionButtonProps) {
    
    if(props.visible === false)
        return null

    return (
        <button
            type="button"
            className={"action-btn btn btn-block btn-" + (props.appearance || "secondary")}
            onClick={props.onClick}
        >
            <i className="material-icons">{props.icon}</i>
            &nbsp;
            {props.children}
        </button>
    )
}