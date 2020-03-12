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
                    <a
                        href="/"
                        className="list-group-item list-group-item-action justify-content-between align-items-center"
                        onClick={(e) => onItemClick(e, item, index, props.onItemClick)}
                    >
                        {props.children(item, index)}
                    </a>
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

function onItemClick<T>(event: React.MouseEvent<HTMLAnchorElement>, item: T, index: number, onItemClick?: (item: T, index: number) => void) {
    event.preventDefault();
    if (onItemClick)
        onItemClick(item, index);
}

function onAddItem<T>(event: React.MouseEvent<HTMLAnchorElement>, onAddItem?: () => void) {
    event.preventDefault();
    if (onAddItem)
        onAddItem();
}