import { useState } from 'react';
import styles from './LatestProjectsSection.module.css';
import { ProjectCard } from '../projectCard/ProjectCard';
import type { Project } from '../projectCard/ProjectCard';
import { ProjectModal } from '../projectModal/ProjectModal';
import { projectsData } from '@/data/projectsData';

// Mock data has been removed from this file

export const LatestProjectsSection = () => {
	// State to manage the modal
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const handleCardClick = (project: Project) => {
		setSelectedProject(project);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
	};

	return (
		<section className={styles.latestProjectsSection}>
			<div className={styles.latestProjectsHeader}>
				<span className={styles.latestProjectsSubtitle}>
					OUR GLOBAL WORK INDUSTRIES
				</span>
				<h2 className={styles.latestProjectsTitle}>Latest Projects</h2>
			</div>

			<div className={styles.latestProjectsGrid}>

				{projectsData.slice(0, 6).map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onClick={() => handleCardClick(project)}
					/>
				))}
			</div>

			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					onClose={handleCloseModal}
				/>
			)}
		</section>
	);
};
