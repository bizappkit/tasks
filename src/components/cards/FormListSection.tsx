import React from "react";
import { Link } from "react-router-dom";

interface FormListSectionProps<T> {
    sectionTitle?: string
    items?: T[]
    children: (item: T, index: number) => React.ReactNode
    onItemClick?: (item: T, index: number) => void

    mainAction?: {
        text: string
        icon?: string
        handler: string | ((event: React.MouseEvent<HTMLButtonElement>) => void)
    }
}

export function FormListSection<T>(props: FormListSectionProps<T>) {



    return (
        <div className="content-list">
            <div className="row content-list-head">
                <div className="col-auto">
                    <h3>{props.sectionTitle || ""}</h3>
                    {props.mainAction && typeof props.mainAction.handler === "string" &&
                        <Link className="btn btn-round" to={props.mainAction.handler} title={props.mainAction.text}>
                            <i className="material-icons">{props.mainAction.icon || "add"}</i>
                        </Link>
                    }
                    {props.mainAction && typeof props.mainAction.handler === "function" &&
                        <button className="btn btn-round" title={props.mainAction.text} onClick={props.mainAction.handler}>
                            <i className="material-icons">{props.mainAction.icon || "add"}</i>
                        </button>
                    }
                </div>
            </div>
            <ol className="list-group">
                {props.items?.map((item, index) => (
                    <div
                        key={index}
                        className="list-group-item list-group-item-action justify-content-between align-items-center"
                    >
                        {props.children(item, index)}
                    </div>
                ))}
            </ol>
        </div>
    )
}
