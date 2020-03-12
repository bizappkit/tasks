import React from 'react';
import { Card } from 'react-bootstrap';
import { toShortTimeStr } from "../../utils/dateTimeUtils";
import { ScheduleItem } from "../../model/task";
import { Link } from "react-router-dom";
//import "./CardActive.css"

interface ScheduleItemProps {
	data: ScheduleItem

	onClick: (reminder: ScheduleItem) => void
}

export function ScheduleItemCard(props: ScheduleItemProps) {

	return (
		<Card className="card-task" onClick={() => props.onClick(props.data)}>
			<Card.Body>
				<div className="card-title" >
					<Link to={"/task/" + props.data.taskId}>
						<h6>
							{
								props.data.time && (
									<span style={{ fontWeight: 'bold' }}>
										{toShortTimeStr(props.data.time) + ": "}
									</span>
								)
							}
							{props.data.title}
						</h6>
					</Link>
					<span className="text-small">{props.data.subtitle || ""}</span>
				</div>
			</Card.Body>
		</Card>
	)
}