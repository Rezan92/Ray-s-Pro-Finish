import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={<HomePage />}
				/>
				<Route
					path='/about'
					element={<AboutPage />}
				/>
			</Routes>
		</>
	);
}

export default App;
