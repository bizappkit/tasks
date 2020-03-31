import React from 'react';
import { toShortTimeStr } from "../../utils/dateTimeUtils";
import { ScheduleItem } from "../../model/task";
import { Link } from "react-router-dom";
//import "./CardActive.css"

interface ScheduleItemProps {
	data: ScheduleItem
	link: string
}

export function ScheduleItemCard(props: ScheduleItemProps) {

	return (
		<div className="card card-task">
			<div className="card-body">
				<div className="card-title" >
					<Link to={props.link}>
						<h6 className="H6-filter-by-text">
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
			</div>
		</div>
	)
}