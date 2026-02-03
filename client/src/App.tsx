import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import TopBar from './components/common/topBar/TopBar';
import Navbar from './components/common/navbar/Navbar';
import { Footer } from './components/common/footer/Footer';
import ProjectsPage from './pages/projects/ProjectsPage';
import EstimatorPage from './pages/estimatorPage/EstimatorPage';
import { ModalManager } from './components/common/modal/ModalManager';

function App() {
	return (
		<div className={styles.App}>
			<TopBar />
			<Navbar />
			<ModalManager />
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
						path='/projects'
						element={<ProjectsPage />}
					/>
					<Route
						path='/contact'
						element={<ContactPage />}
					/>

					<Route
						path='/estimator'
						element={<EstimatorPage />}
					/>
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
