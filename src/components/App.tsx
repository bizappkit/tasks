import React from 'react';
import { ContentRouting } from "./pages"
import { signInWithEmailAndPassword } from "../sync"
import { Provider } from 'react-redux';
import { store } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';
//import useMediaQuery from '@material-ui/core/useMediaQuery';

const theme = createMuiTheme({
  palette: {
	type: 'dark',
    primary: {
      light: '#f27573',
      main: '#ef5350',
      dark: '#a73a38',
      contrastText: '#fff',
    },
    secondary: {
      light: '#99d5cf',
      main: '#80cbc4',
      dark: '#598e89',
      contrastText: '#000',
    },
  },
});


class App extends React.Component {

	async componentDidMount() {

		let userId = store.getState().user.userId

		if (!userId) {
			userId = await signInWithEmailAndPassword("inchakov@gmail.com", "!Parol2020")
			store.dispatch({ type: "user-set", userId })
		}

		// if (userId) {
		// 	store.dispatch({ type: "tasks-start-loading", filter: { completion: "incompleted" } })
		// }
	}

	render() {

		//const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<ContentRouting />
				</Provider>
			</ThemeProvider>
		)
	}
}

export default App;
