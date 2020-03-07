import React from 'react';
import { Navbar, NavDropdown, Nav, Container, Row, Col } from 'react-bootstrap';
import { ReminderCard } from './cards/ReminderCard';
import { CardList } from './cards/CardList';
import { ScheduleItem } from './model/task';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


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

function App() {

	return (
		<Router>
			<div className="layout layout-nav-top">
				<Navbar bg="light" expand='sm' >
					<Nav className="mr-auto">
						<NavDropdown title="Schedule" id="basic-nav-dropdown">
							<NavDropdown.Item href="#tasks">Tasks</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar>

				<Switch>
					<Route path="/task/:taskId">
						<div>Task</div>
					</Route>
					<Route path="/">
						<Container>
							<Row>
								<Col>
									<CardList
										items={reminders}
										getItemKey={r => r.taskId}
										getGroupKey={r => getDate(r.time)}
										getGroupTitle={getReminderGroupTitle}
										renderItem={renderReminder}
									/>
								</Col>
							</Row>
						</Container>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export default App;
