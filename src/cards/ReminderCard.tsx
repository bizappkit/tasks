import React from 'react';
import { Card } from 'react-bootstrap';
import { toShortTimeStr } from "../utils/dateTimeUtils";
import { Reminder } from "../model/reminder";

interface ReminderCardProps {
	reminder: Reminder

	onClick: (reminder: Reminder) => void
}

export function ReminderCard(props: ReminderCardProps) {

	return (
		<Card className="card-task" style={{ cursor: "pointer" }} onClick={() => props.onClick(props.reminder)}>
			<Card.Body>
				<div className="card-title" >
					<h6>
						{
							props.reminder.time && (
								<span style={{ fontWeight: 'bold' }}>
									{toShortTimeStr(props.reminder.time) + ":"}
								</span>
							)
						}
						{props.reminder.title}
					</h6>
					<span className="text-small">{props.reminder.subtitle || ""}</span>
				</div>
			</Card.Body>
		</Card>
	)
}