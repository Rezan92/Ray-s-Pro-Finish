import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import TopBar from './components/common/topBar/TopBar';
import Navbar from './components/common/navbar/Navbar';
import { Footer } from './components/common/footer/Footer';

function App() {
	return (
		<div className='App'>
			<TopBar />
			<Navbar />
			<main>
				<Routes>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/about'
						element={<AboutPage />}
					/>
					<Route
						path='/services'
						element={<ServicesPage />}
					/>
					<Route
						path='/contact'
						element={<ContactPage />}
					/>
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
