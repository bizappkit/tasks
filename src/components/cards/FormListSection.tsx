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
            <label>{props.sectionTitle || ""}</label>
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