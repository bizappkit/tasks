import React from 'react';

interface CardListProps<T> {

	items: T[]

	getItemKey: (item: T) => React.Key
	getGroupKey: (item: T) => React.Key
	getGroupTitle: (item: T) => string

	renderItem: (item: T) => JSX.Element | null
}

export function CardList<T>(props: CardListProps<T>) {

	const groups = groupBy(props.items, props.getGroupKey, props.getGroupTitle, (key, title, groupItems) => {

		return (
			<div key={key} className="card-list">
				<div className="card-list-head"><h6>{title}</h6></div>
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

function groupBy<T, G>(
	items: T[],
	getGroupKey: (item: T) => React.Key,
	getGroupTitle: (item: T) => string,
	createGroup: (key: React.Key, title: string, groupItems: T[]) => G
): G[] {

	if (items.length === 0)
		return [];

	let groups: G[] = [];
	let lastGroupKey = undefined;
	let lastGroupTitle = "";
	let groupStartIndex = 0;

	for (let i = 0; i < items.length; i++) {

		let item = items[i];
		let itemGroupKey = getGroupKey(item);

		console.log("Group Key:" + itemGroupKey);

		if (lastGroupKey === undefined) {
			lastGroupKey = itemGroupKey;
			lastGroupTitle = getGroupTitle(item);
		}

		if (itemGroupKey !== lastGroupKey) {
			groups.push(createGroup(lastGroupKey, lastGroupTitle, items.slice(groupStartIndex, i)));
			lastGroupTitle = getGroupTitle(item);
			lastGroupKey = itemGroupKey;
			groupStartIndex = i;
		}
	}

	if (lastGroupKey)
		groups.push(createGroup(lastGroupKey, lastGroupTitle, items.slice(groupStartIndex, items.length)));

	return groups;
}