import React from 'react';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';


function App() {
  return (
    <div>
      <Navbar bg="light" expand='sm' >
        <Nav className="mr-auto">
          <NavDropdown title="Schedule" id="basic-nav-dropdown">
            <NavDropdown.Item href="#tasks">Tasks</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <div className="card card-task">
        <div className="card-body">
          <div className="card-title">
            <a href="#task=6"><h6>Task Name</h6></a>
            <span className="text-small">Due Tomorrow</span>
          </div>
          <div className="card-meta">
            <ul className="avatars">
              <li>
                <img alt="..." className="avatar" src="..." />
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <i className="material-icons">playlist_add_check</i>
              <span>0/3</span>
            </div>
            <div className="dropdown card-options">
              <button className="btn-options" type="button" id="task-dropdown-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="material-icons">more_vert</i>
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                ...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
