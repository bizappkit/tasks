import React from 'react';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SchedulePage } from "./pages/SchedulePage";
import TaskPage from "./pages/TaskPage";
import { ContentRouting } from "./ContentRouting"
import '../assets/css/theme.css';

class App extends React.Component {

	render() {
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

					<ContentRouting />

					<Switch>
						<Route path="/task/:taskId">
							<TaskPage />
						</Route>
						<Route path="/">
							<SchedulePage />
						</Route>
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App;
