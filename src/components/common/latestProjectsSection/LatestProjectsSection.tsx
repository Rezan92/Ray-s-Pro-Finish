import React, { useState } from 'react';
import './LatestProjectsSection.css';
import { ProjectCard } from '../projectCard/ProjectCard';
import type { Project } from '../projectCard/ProjectCard';
import { ProjectModal } from '../projectModal/ProjectModal';

// Mock data for our projects
// We can move this to a separate file later
const projectsData: Project[] = [
	{
		id: 1,
		image: 'https://placehold.co/600x400/5f6b8a/ffffff?text=Garage+Finishing',
		tag: 'Drywall Finishing',
		title: 'Two-Car Garage Finishing',
		location: 'Lombard, IL',
		details:
			'This new-construction garage had unfinished drywall. We came in to professionally tape all seams, apply three coats of mud, and sand everything perfectly smooth, making it ready for primer and paint.',
	},
	{
		id: 2,
		image: 'https://placehold.co/600x400/6a5f8a/ffffff?text=Basement+Remodel',
		tag: 'Install & Paint',
		title: 'Basement Remodel Finishing',
		location: 'Wheaton, IL',
		details:
			'We handled the complete finishing for this new basement. Our team installed all the drywall, finished it to a level-5 smooth finish, and then painted the walls, ceiling, and trim for a bright, move-in-ready space.',
	},
	{
		id: 3,
		image:
			'https://placehold.co/600x400/8a5f7e/ffffff?text=Living+Room+Repaint',
		tag: 'Interior Painting',
		title: 'Modern Living Room Repaint',
		location: 'Glen Ellyn, IL',
		details:
			'The client wanted to update their main living area. We prepped all surfaces, patched minor scuffs, and gave the walls and trim a fresh, modern coat of paint. Notice the clean, sharp lines along the ceiling!',
	},
	{
		id: 4,
		image: 'https://placehold.co/600x400/8a5f6a/ffffff?text=Wall+Patching',
		tag: 'Drywall Repair',
		title: 'Nail Hole & Anchor Patching',
		location: 'Wheaton, IL',
		details:
			'After removing shelves and art, this client had dozens of nail holes and large drywall anchors. We meticulously patched every spot and blended the texture so the walls looked brand new and were ready for paint.',
	},
	{
		id: 5,
		image: 'https://placehold.co/600x400/8a7e5f/ffffff?text=Ceiling+Repair',
		tag: 'Ceiling Repair',
		title: 'Kitchen Ceiling Water Damage',
		location: 'Carol Stream, IL',
		details:
			'A leak left an ugly stain and bubbling paint on this kitchen ceiling. We cut out the damaged drywall, patched it, expertly matched the existing texture, and painted it to look like the damage never even happened.',
	},
	{
		id: 6,
		image: 'https://placehold.co/600x400/5f8a7a/ffffff?text=Accent+Wall',
		tag: 'Detail Painting',
		title: 'Master Bedroom Accent Wall',
		location: 'Lombard, IL',
		details:
			'To create a modern focal point, we painted this dark accent wall. This precision work requires perfectly straight and sharp lines, along with a fresh coat on the baseboards and trim for a high-end, professional look.',
	},
];

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
				{projectsData.map((project) => (
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
