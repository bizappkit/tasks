import React, { useEffect } from 'react';
import { CardList } from '../task/CardList';
import { ScheduleItem, getScheduleItems, createTask } from '../../model/task';
import { useRootDispatch, useRootSelector } from '../../store';
import { getTaskLink } from './TaskPage';
import { TaskCard } from '../task/TaskCard';
import { toShortTimeStr } from "../../utils/dateTimeUtils";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';

export const SchedulePath = "/schedule"

export function SchedulePage() {

	const { t } = useTranslation()
	const tasks = useRootSelector((state) => state.taskList.idToTask)
	const user = useRootSelector((state) => state.user)

	const scheduleItems = getScheduleItems(new Date(), tasks?.values())

	const dispatch = useRootDispatch()
	const history = useHistory()

	useEffect(() => {

		const addTaskClick = () => {
			if (user.userId) {
				const task = createTask(user.userId, "")
				dispatch({ type: "tasks-new-task", task })
				history.push(getTaskLink(task.id))
			}
		}

		dispatch({ type: "mainButton-show", text: t("Add Task"), handler: addTaskClick })
		dispatch({ type: "tasks-start-loading", filter: { completion: "incompleted" } })
	}, [user.userId, dispatch, t, history])

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
