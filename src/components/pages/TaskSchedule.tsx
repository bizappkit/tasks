import React from 'react';
import { CardList } from '../cards/CardList';
import { ScheduleItem } from '../../model/task';
import { ScheduleItemCard } from '../cards/ScheduleItemCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getTaskLink } from './TaskPage';

export const SchedulePath = "/schedule"


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

export function SchedulePage() {

	const scheduleItems = useSelector((state: RootState) => state.tasks.scheduleItems)

	return (
		<CardList
			items={scheduleItems || []}
			getItemKey={r => r.taskId}
			getGroupKey={r => getDate(r.time)}
			getGroupTitle={getReminderGroupTitle}
			renderItem={renderReminder}
		/>
	)
}