import React from 'react';
import { ContentRouting } from "./pages"
import { signInWithEmailAndPassword } from "../sync"
import { Provider } from 'react-redux';
import { store } from '../store';

import '../assets/css/theme.css'


class App extends React.Component {

	async componentDidMount() {

		let userId = store.getState().user.userId

		if (!userId) {
			userId = await signInWithEmailAndPassword("inchakov@gmail.com", "!Parol2020")
			store.dispatch({ type: "user-set", userId })
		}

		if (userId) {
			store.dispatch({type: "tasks-start-loading"})
		}
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
