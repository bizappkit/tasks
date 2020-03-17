import React from "react";

interface FormListSectionProps<T> {
    sectionTitle?: string
    addItemText?: string
    items?: T[]
    children: (item: T, index: number) => React.ReactNode
    onItemClick?: (item: T, index: number) => void
    onAddItem?: () => void
}

export function FormListSection<T>(props: FormListSectionProps<T>) {
    return (
        <div className="form-group">
            <div className="row content-list-head">
                <div className="col-auto">
                    <h3>{props.sectionTitle || ""}</h3>
                    <button className="btn btn-round" data-toggle="tooltip" data-title="New item" data-original-title="" title="">
                        <i className="material-icons">add</i>
                    </button>
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
            {props.onAddItem && props.addItemText &&
                <div>
                    <a href="/" onClick={(e) => onAddItem(e, props.onAddItem)}>{props.addItemText}</a>
                </div>
            }
        </div>
    )
}

function onAddItem<T>(event: React.MouseEvent<HTMLAnchorElement>, onAddItem?: () => void) {
    event.preventDefault();
    if (onAddItem)
        onAddItem();
}