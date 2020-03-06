import React from 'react';
import { Card } from 'react-bootstrap';
import { toShortTimeStr } from "../utils/dateTimeUtils";

interface ReminderCardProps {
	data: {
		title: string
		time?: Date
		subtitle?: string
	}
}

export function ReminderCard(props: ReminderCardProps) {
	return (
		<Card className="card-task">
			<Card.Body>
				<div className="card-title">
					<a href='/'>
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
					</a>
					<span className="text-small">{props.data.subtitle || ""}</span>
				</div>
			</Card.Body>
		</Card>
	)
}