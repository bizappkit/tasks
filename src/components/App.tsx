import React from 'react';
import { ContentRouting } from "./pages"
import '../assets/css/theme.css';

class App extends React.Component {

	render() {
		return (
			<div className="layout layout-nav-top">
				<ContentRouting />
			</div>
		)
	}
}

export default App;
