import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ContentRouting } from "./ContentRouting"
import '../assets/css/theme.css';

class App extends React.Component {

	render() {
		return (
			<Router>
				<div className="layout layout-nav-top">
					<ContentRouting />
				</div>
			</Router>
		)
	}
}

export default App;
