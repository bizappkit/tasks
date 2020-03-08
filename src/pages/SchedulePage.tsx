import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CardList } from '../cards/CardList';
import { ScheduleItem } from '../model/task';
import { ReminderCard } from '../cards/ReminderCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';


const reminders: ScheduleItem[] = [
	{ taskId: "1", time: undefined, title: "Test task title", subtitle: "Test task subtile with text" },
	{ taskId: "2", time: new Date(), title: "Test task title", subtitle: "Test task subtile with text" },
	{ taskId: "3", time: new Date(), title: "Test task title", subtitle: "Test task subtile with text" }
]

function getDate(dateTime?: Date) {

	if (dateTime === undefined)
		return -1;

	return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()).valueOf();
}

function getReminderGroupTitle(reminder: ScheduleItem): string {
	return reminder.time?.toLocaleDateString() || "Unscheduled";
}

function renderReminder(reminder: ScheduleItem): JSX.Element {
	return (
		<ReminderCard
			key={reminder.taskId}
			data={reminder}
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