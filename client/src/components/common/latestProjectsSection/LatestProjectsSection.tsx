import { useState } from 'react';
import './LatestProjectsSection.css';
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
		<section className='latest-projects-section'>
			<div className='latest-projects-header'>
				<span className='latest-projects-subtitle'>
					OUR GLOBAL WORK INDUSTRIES
				</span>
				<h2 className='latest-projects-title'>Latest Projects</h2>
			</div>

			<div className='latest-projects-grid'>

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
