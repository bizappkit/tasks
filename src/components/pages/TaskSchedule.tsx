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

		if (user.userId) {
			const addTaskClick = () => {
				if (user.userId) {
					const task = createTask(user.userId, "")
					dispatch({ type: "tasks-new-task", task })
					history.push(getTaskLink(task.id))
				}
			}

			dispatch({ type: "mainButton-show", text: t("Add Task"), handler: addTaskClick })
		} else {
			dispatch({ type: "mainButton-hide" })
		}

	}, [user.userId, dispatch, t, history])

	useEffect(() => {
		if (user.userId)
			dispatch({ type: "tasks-start-loading", filter: { completion: "incompleted" } })
	}, [user.userId, dispatch])

	const now = new Date()

	return (
		<CardList
			items={scheduleItems}
			getItemKey={r => r.taskId}
			getGroupKey={r => getGroupKey(now, r.time)}
			getGroupTitle={r => getGroupTitle(now, r)}
			renderItem={r => (
				<TaskCard
					key={r.taskId}
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

function getGroupKey(currentTime: Date, dateTime?: Date) {

	if (dateTime === undefined)
		return -1

	if (dateTime < currentTime)
		return -2

	return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()).valueOf();
}

function getGroupTitle(currentTime: Date, reminder: ScheduleItem): string {

	if (reminder.time === undefined)
		return "Unscheduled"

	if (reminder.time < currentTime)
		return "Overdue"

	return reminder.time.toLocaleDateString()
}
