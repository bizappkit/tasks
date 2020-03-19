import React from "react";

interface FormListSectionProps<T> {
    sectionTitle?: string
    addItemText?: string
    items?: T[]
    children: (item: T, index: number) => React.ReactNode
    onItemClick?: (item: T, index: number) => void
    onAddItem?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function FormListSection<T>(props: FormListSectionProps<T>) {
    return (
        <div className="content-list">
            <div className="row content-list-head">
                <div className="col-auto">
                    <h3>{props.sectionTitle || ""}</h3>
                    {props.onAddItem &&
                        <button className="btn btn-round" title={props.addItemText} onClick={props.onAddItem}>
                            <i className="material-icons">add</i>
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
