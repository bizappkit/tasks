import React from 'react';

interface CardListProps<T> {
	items: T[]
	getItemKey?: (item: T) => any
	getGroup: (item: T) => any
}

export function CardList<T>(props: CardListProps<T>) {
	let lastGroup = undefined;

	return props.items.map((item, index) => {

	})
}

function groupBy<T, G>(items: T[], getGroupKey: (item: T) => any, createGroup: (groupItems: T[]) => G): G[] {

	if(items.length == 0)
		return [];

	let groups: G[] = [];
	let lastGroupKey = undefined;
	let groupStartIndex = 0;

	for(let i = 0; i < items.length; i++) {

		let item = items[i];
		let itemGroupKey = getGroupKey(item);

		if(lastGroupKey === undefined) {
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