import React from 'react';
import { Navbar, NavDropdown, Nav, Container, Row, Col } from 'react-bootstrap';
import { ReminderCard } from './cards/ReminderCard';
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
            <ReminderCard time={new Date()} title="Test task title" subtile="Test task subtile with text"/>
            <ReminderCard time={new Date()} title="Test task title" subtile="Test task subtile with text"/>
            <ReminderCard
              time={new Date()}
              title="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
              subtile="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."/>
          </Col>
        </Row>
      </Container>

    </div>
  )
}

export default App;
