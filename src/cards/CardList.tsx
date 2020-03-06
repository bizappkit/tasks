import React from 'react';

interface CardListProps<T> {

	items: T[]

	getItemKey: (item: T) => any
	getGroupKey: (item: T) => any
	getGroupTitle: (item: T) => string

	renderItem: (item: T) => JSX.Element | null
}

export function CardList<T>(props: CardListProps<T>) {

	const groups = groupBy(props.items, props.getGroupKey, (groupItems) => {
		const groupName = props.getGroupTitle(groupItems[0]);
		return (
			<div className="card-list">
				<div className="card-list-head"><h6>{groupName}</h6></div>
				{groupItems.map(item => props.renderItem(item))}
			</div>
		)
	})

	return (
		<div>
			{groups}
		</div>
	)
}

function groupBy<T, G>(items: T[], getGroupKey: (item: T) => any, createGroup: (groupItems: T[]) => G): G[] {

	if (items.length == 0)
		return [];

	let groups: G[] = [];
	let lastGroupKey = undefined;
	let groupStartIndex = 0;

	for (let i = 0; i < items.length; i++) {

		let item = items[i];
		let itemGroupKey = getGroupKey(item);

		if (lastGroupKey === undefined) {
			itemGroupKey = getGroupKey(item);
		} else {
			groups.push(createGroup(items.slice(groupStartIndex, i)));
			lastGroupKey = itemGroupKey;
			groupStartIndex = i;
		}
	}

	groups.push(createGroup(items.slice(groupStartIndex, items.length)));

	return groups;
}