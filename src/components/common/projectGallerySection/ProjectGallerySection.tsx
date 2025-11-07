import React, { useState, useMemo, useEffect } from 'react';
import './ProjectGallerySection.css';
import { ProjectCard } from '../projectCard/ProjectCard';
import type { Project } from '../projectCard/ProjectCard';
import { ProjectModal } from '../projectModal/ProjectModal';
import { ChevronDown } from 'lucide-react'; // Import an icon for the dropdown
import { projectsData } from '@/data/projectsData'; // <-- IMPORT the shared data

// Mock data has been removed from this file

export const ProjectGallerySection = () => {
	// === Modal State ===
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	// === Filter State ===
	const [activeFilter, setActiveFilter] = useState<string>('All');
	const [filteredProjects, setFilteredProjects] =
		useState<Project[]>(projectsData);

	// Get all unique tags from the projects data
	const filterCategories = useMemo(() => {
		const tags = new Set(projectsData.map((p) => p.tag));
		return ['All', ...Array.from(tags)];
	}, []); // This only runs once

	// This effect runs whenever the activeFilter changes
	useEffect(() => {
		if (activeFilter === 'All') {
			setFilteredProjects(projectsData);
		} else {
			const filtered = projectsData.filter(
				(project) => project.tag === activeFilter
			);
			setFilteredProjects(filtered);
		}
	}, [activeFilter]);

	const handleCardClick = (project: Project) => {
		setSelectedProject(project);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
	};

	// This is the new handler for the dropdown
	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setActiveFilter(event.target.value);
	};

	return (
		<section className='project-gallery-section'>
			<div className='project-gallery-header'>
				<span className='project-gallery-subtitle'>OUR WORK</span>
				<h2 className='project-gallery-title'>A Showcase of Quality</h2>
			</div>

			{/* === This is the new Dropdown Filter === */}
			<div className='project-filter-dropdown-wrapper'>
				<label
					htmlFor='project-filter'
					className='project-filter-label'
				>
					Filter by service:
				</label>
				<div className='project-filter-select-container'>
					<select
						id='project-filter'
						className='project-filter-select'
						value={activeFilter}
						onChange={handleFilterChange}
					>
						{filterCategories.map((category) => (
							<option
								key={category}
								value={category}
							>
								{category}
							</option>
						))}
					</select>
					<ChevronDown
						size={20}
						className='project-filter-icon'
					/>
				</div>
			</div>

			{/* --- Project Grid --- */}
			<div className='project-gallery-grid'>
				{filteredProjects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onClick={() => handleCardClick(project)}
					/>
				))}
			</div>

			{/* This is the modal. It only renders if a project is selected. */}
			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					onClose={handleCloseModal}
				/>
			)}
		</section>
	);
};
