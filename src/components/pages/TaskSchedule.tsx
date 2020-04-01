import React from 'react';
import { CardList } from '../cards/CardList';
import { ScheduleItem, getScheduleItems } from '../../model/task';
import { ScheduleItemCard } from '../cards/ScheduleItemCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getTaskLink } from './TaskPage';

export const SchedulePath = "/schedule"

export function SchedulePage() {

	const tasks = useSelector((state: RootState) => state.tasks.idToTask)
	const scheduleItems = getScheduleItems(new Date(), tasks?.values())

	return (
		<CardList
			items={scheduleItems}
			getItemKey={r => r.reminderId || r.taskId}
			getGroupKey={r => getDate(r.time)}
			getGroupTitle={getReminderGroupTitle}
			renderItem={renderReminder}
		/>
	)
}

function getDate(dateTime?: Date) {

	if (dateTime === undefined)
		return -1;

	return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()).valueOf();
}

function getReminderGroupTitle(reminder: ScheduleItem): string {
	return reminder.time?.toLocaleDateString() || "Unscheduled";
}

function renderReminder(scheduleItem: ScheduleItem): JSX.Element {
	return (
		<ScheduleItemCard
			key={scheduleItem.taskId}
			data={scheduleItem}
			link={getTaskLink(scheduleItem.taskId)}
		/>
	)
}