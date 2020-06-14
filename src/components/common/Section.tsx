import React, { useState, CSSProperties } from "react"
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

interface SectionProps {
    title: string
    value?: string 
    children: React.ReactNode
    open?: boolean
    onOpenChanged?: (open: boolean) => void
    style?: CSSProperties
    mainActionIcon?: string
    onMainActionClick?: () => void
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
        <ExpansionPanel expanded={open} onChange={toggleOpen}>
            <ExpansionPanelSummary>
                <div className="flex-grow-1 d-flex" style={{ cursor: "pointer" }} onClick={toggleOpen}>
                    <i className="material-icons">{open ? "arrow_drop_down" : "arrow_right"}</i>
                    <h5>{props.title}</h5>
                </div>
                {props.mainActionIcon && open &&
                    <i className="material-icons" style={{ cursor: "pointer" }} onClick={props.onMainActionClick}>{props.mainActionIcon}</i>
                }
                {!open && props.value !== undefined &&
                    <span>{props.value}</span>
                }
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div>
                    {props.children}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}