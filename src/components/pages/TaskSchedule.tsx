import React from 'react';
import { CardList } from '../task/CardList';
import { ScheduleItem, getScheduleItems } from '../../model/task';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getTaskLink } from './TaskPage';
import { TaskCard } from '../task/TaskCard';
import { toShortTimeStr } from "../../utils/dateTimeUtils";

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
			renderItem={r => (
				<TaskCard
					key={r.reminderId || r.taskId}
					icon="check"
					title={
						<span>
							{r.time &&
								<span style={{ fontWeight: 'bold' }}>
									{toShortTimeStr(r.time) + ": "}
								</span>
							}
							{r.title}
						</span>
					}
					titleLinkTo={getTaskLink(r.taskId)}
					subtitle={r.subtitle}
				/>
			)}
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
