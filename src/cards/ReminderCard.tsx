import { Card } from 'react-bootstrap';
import React from 'react';
import { toShortTimeStr } from "../utils/dateTimeUtils";

interface ReminderCardProps {
	time: Date
	title: string
	subtile: string
}

export function ReminderCard(props: ReminderCardProps) {
	return (
		<Card className="card-task">
			<Card.Body>
				<div className="card-title">
					<a href='/'>
						<h6><span style={{fontWeight: 'bold'}}>{toShortTimeStr(props.time)}</span> - {props.title}</h6>
					</a>
					<span className="text-small">{props.subtile}</span>
				</div>
			</Card.Body>
		</Card>
	)
}