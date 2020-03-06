import React from 'react';
import { Card } from 'react-bootstrap';
import { toShortTimeStr } from "../utils/dateTimeUtils";
import { ScheduleItem } from "../model/task";
import "./CardActive.css"

interface ReminderCardProps {
	data: ScheduleItem

	onClick: (reminder: ScheduleItem) => void
}

export function ReminderCard(props: ReminderCardProps) {

	return (
		<Card className="card-task card-active" onClick={() => props.onClick(props.data)}>
			<Card.Body>
				<div className="card-title" >
					<h6>
						{
							props.data.time && (
								<span style={{ fontWeight: 'bold' }}>
									{toShortTimeStr(props.data.time) + ":"}
								</span>
							)
						}
						{props.data.title}
					</h6>
					<span className="text-small">{props.data.subtitle || ""}</span>
				</div>
			</Card.Body>
		</Card>
	)
}