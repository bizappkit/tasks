import React from 'react';
import { Navbar, NavDropdown, Nav, Container, Row, Col } from 'react-bootstrap';
import { ReminderCard } from './cards/ReminderCard';
import { CardList } from './cards/CardList';
import { Reminder } from './model/reminder';


const reminders: Reminder[] = [
	{ id: "1", time: undefined, title: "Test task title", subtitle: "Test task subtile with text" },
	{ id: "2", time: new Date(), title: "Test task title", subtitle: "Test task subtile with text" },
	{ id: "3", time: new Date(), title: "Test task title", subtitle: "Test task subtile with text" }
]

function getDate(dateTime?: Date) {

	if (dateTime === undefined)
		return -1;

	return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()).valueOf();
}

function getReminderGroupTitle(reminder: Reminder): string {
	return reminder.time?.toLocaleDateString() || "Unscheduled";
}

function renderReminder(reminder: Reminder): JSX.Element {
	return (
		<ReminderCard
			key={reminder.id}
			reminder={reminder}
			onClick={(r) => console.log("Reminder clicked: " + r.id)}
		/>
	)
}

function App() {
	return (
		<div className="layout layout-nav-top">
			<Navbar bg="light" expand='sm' >
				<Nav className="mr-auto">
					<NavDropdown title="Schedule" id="basic-nav-dropdown">
						<NavDropdown.Item href="#tasks">Tasks</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar>

			<Container>
				<Row>
					<Col>
						<CardList
							items={reminders}
							getItemKey={r => r.id}
							getGroupKey={r => getDate(r.time)}
							getGroupTitle={getReminderGroupTitle}
							renderItem={renderReminder}
						/>
					</Col>
				</Row>
			</Container>

		</div>
	)
}

export default App;
