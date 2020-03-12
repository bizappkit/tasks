import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CardList } from '../cards/CardList';
import { ScheduleItem } from '../../model/task';
import { ScheduleItemCard } from '../cards/ReminderCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

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
			onClick={(r) => console.log("Reminder clicked: " + r.taskId)}
		/>
	)
}

export function SchedulePage() {

	const scheduleItems = useSelector((state: RootState) => state.tasks.scheduleItems)

	return (
		<Container>
			<Row>
				<Col>
					<CardList
						items={scheduleItems || []}
						getItemKey={r => r.taskId}
						getGroupKey={r => getDate(r.time)}
						getGroupTitle={getReminderGroupTitle}
						renderItem={renderReminder}
					/>
				</Col>
			</Row>
		</Container>
	)
}