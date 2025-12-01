import './ProjectGallerySection.css';
import { ProjectCard } from '../projectCard/ProjectCard';
import type { Project } from '../projectCard/ProjectCard';
import { ChevronDown } from 'lucide-react';
// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setFilter,
	selectFilteredProjects,
	selectActiveFilter,
	selectProjectCategories,
} from '@/store/slices/projectsSlice';
import { openProjectModal } from '@/store/slices/uiSlice'; // <--- Import action

export const ProjectGallerySection = () => {
	// --- Redux State ---
	const dispatch = useAppDispatch();

	// These "selectors" automatically update the component when data changes
	const filteredProjects = useAppSelector(selectFilteredProjects);
	const activeFilter = useAppSelector(selectActiveFilter);
	const filterCategories = useAppSelector(selectProjectCategories);

	// --- Handlers ---
	// Just dispatch the action! No local state needed.
	const handleCardClick = (project: Project) => {
		dispatch(openProjectModal(project));
	};

	const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setFilter(event.target.value));
	};

	return (
		<section className='project-gallery-section'>
			<div className='project-gallery-header'>
				<span className='project-gallery-subtitle'>OUR WORK</span>
				<h2 className='project-gallery-title'>A Showcase of Quality</h2>
			</div>

			{/* Filter Dropdown */}
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
						value={activeFilter} // Controlled by Redux
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

			{/* Project Grid */}
			<div className='project-gallery-grid'>
				{filteredProjects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						onClick={() => handleCardClick(project)}
					/>
				))}
			</div>

			{/* NO MODAL HERE! It is now handled globally by ModalManager in App.tsx */}
		</section>
	);
};
