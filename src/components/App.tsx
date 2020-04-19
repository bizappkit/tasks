import React from 'react';
import { ContentRouting } from "./pages"
import { subscribeToTasks } from "../sync"
import { configureStore } from "../store"
import { Provider } from 'react-redux';

import '../assets/css/theme.css'

const store = configureStore();

class App extends React.Component {

	componentDidMount() {

		//store.dispatch({type: "user-set", userId: testUserId})

		subscribeToTasks("inchakov@gmail.com", "!Parol2020", (tasks) => {
			store.dispatch({ type: "tasks-loaded", tasks })
		})
	}

	render() {
		return (
			<Provider store={store}>
				<div className="layout layout-nav-top">
					<ContentRouting />
				</div>
			</Provider>
		)
	}
}

export default App;
