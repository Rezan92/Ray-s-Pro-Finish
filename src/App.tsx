import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';
import TopBar from './components/common/topBar/TopBar';

function App() {
	return (
		<div className="App">
      <TopBar/>
      <main>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route
					path='/about'
					element={<AboutPage />}
				/>
			</Routes>
      </main>
		</div>
	);
}

export default App;
