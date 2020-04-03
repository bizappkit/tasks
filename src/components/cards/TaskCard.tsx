import React from "react";
import { Link } from "react-router-dom";

interface TaskCardProps {
    icon?: React.ReactNode
    iconHighlighted?: boolean
    onIconClick?: () => void

    title?: React.ReactNode
    titleLinkTo?: string

    subtitle?: React.ReactNode

    actions?: {
        divider?: boolean
        danger?: boolean
        title?: React.ReactNode
    }
    onActionClick?: (index: number) => void
}

export function TaskCard(props: TaskCardProps) {
    return (
        <div className="card card-task">
            <div className="card-body d-flex flex-row">
                <div className="media align-items-center flex-fill">

                    {props.icon &&
                        <div className={"avatar bg-primary"} style={{ cursor: "pointer", marginRight: "1rem", opacity: (props.iconHighlighted ? 1 : 0.2) }}>
                            <i className="material-icons">check</i>
                        </div>
                    }

                    <div className="media-body justify-content-between align-items-center">
                        <div>
                            {props.titleLinkTo &&
                                <Link to={props.titleLinkTo}>
                                    {props.title || ""}
                                </Link>
                            }

                            {!props.titleLinkTo && (props.title || "")}

                            {props.subtitle &&
                                <br />
                            }

                            {props.subtitle &&
                                <span className="text-small">{props.subtitle}</span>
                            }
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="btn-options" type="button">
                            <i className="material-icons">more_vert</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
