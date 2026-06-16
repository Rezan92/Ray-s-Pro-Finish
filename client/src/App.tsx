import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import TopBar from './components/common/topBar/TopBar';
import { Footer } from './components/common/footer/Footer';
import ProjectsPage from './pages/projects/ProjectsPage';
import { ModalManager } from './components/common/modal/ModalManager';
import BlogPage from './pages/blog/BlogPage';

function App() {
	return (
		<div className={styles.App}>
			<TopBar />
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
					/>{' '}
					<Route
						path='/blog'
						element={<BlogPage />}
					/>
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
