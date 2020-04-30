import React, { useState } from "react"
import { Collapse } from "react-bootstrap"

interface SectionProps {
    title: string
    children: React.ReactNode
    open?: boolean
    onOpenChanged?: (open: boolean) => void
}

export function Section(props: SectionProps) {

    const [open, setOpen] = useState((props.open === undefined ? true : props.open))

    const toggleOpen = () => {
        if (props.onOpenChanged)
            props.onOpenChanged(!open)
        else
            setOpen(!open)
    }

    return (
        <div style={{ marginBottom: (open ? "2rem" : "0.5rem") }}>
            <div className="d-flex">
                <div className="flex-grow-1 d-flex" style={{ cursor: "pointer" }} onClick={toggleOpen}>
                    <i className="material-icons">{open ? "arrow_drop_down" : "arrow_right"}</i>
                    <h5>{props.title}</h5>
                </div>
                {open &&
                    <i className="material-icons">edit</i>
                }
            </div>
            <Collapse in={open}>
                <div>
                    {props.children}
                </div>
            </Collapse>
        </div>
    )
}