import styles from './ProjectGallerySection.module.css';
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
		<section className={styles.projectGallerySection}>
			<div className={styles.projectGalleryHeader}>
				<span className={styles.projectGallerySubtitle}>OUR WORK</span>
				<h2 className={styles.projectGalleryTitle}>A Showcase of Quality</h2>
			</div>

			{/* Filter Dropdown */}
			<div className={styles.projectFilterDropdownWrapper}>
				<label
					htmlFor='project-filter'
					className={styles.projectFilterLabel}
				>
					Filter by service:
				</label>
				<div className={styles.projectFilterSelectContainer}>
					<select
						id='project-filter'
						className={styles.projectFilterSelect}
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
						className={styles.projectFilterIcon}
					/>
				</div>
			</div>

			{/* Project Grid */}
			<div className={styles.projectGalleryGrid}>
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
