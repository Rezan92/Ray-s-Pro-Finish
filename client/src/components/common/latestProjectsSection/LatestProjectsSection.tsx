import { useState, useRef, useCallback } from 'react';
import styles from './LatestProjectsSection.module.css';
import { ProjectCard } from '../projectCard/ProjectCard';
import type { Project } from '../projectCard/ProjectCard';
import { ProjectModal } from '../projectModal/ProjectModal';
import { projectsData } from '@/data/projectsData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BrushButton } from '../brushButton/BrushButton';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export const LatestProjectsSection = () => {
	// State to manage the modal
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const swiperRef = useRef<SwiperType | null>(null);

	const handleCardClick = (project: Project) => {
		setSelectedProject(project);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
	};

	const handlePrev = useCallback(() => {
		if (!swiperRef.current) return;
		swiperRef.current.slidePrev();
	}, []);

	const handleNext = useCallback(() => {
		if (!swiperRef.current) return;
		swiperRef.current.slideNext();
	}, []);

	const displayProjects = projectsData;

	return (
		<section className={styles.latestProjectsSection}>
			<div className={styles.container}>
				<div className={styles.latestProjectsHeader}>
					<div className={styles.headerTitleContainer}>
						<h2 className={styles.latestProjectsTitle}>Latest Projects</h2>
						<span className={styles.latestProjectsSubtitle}>
							Projects we are proud of
						</span>
					</div>
					<div className={styles.headerControls}>
						<button
							className={styles.navButton}
							onClick={handlePrev}
							aria-label="Previous Project"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							className={styles.navButton}
							onClick={handleNext}
							aria-label="Next Project"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				</div>

				<div className={styles.carouselContainer}>
					<Swiper
						modules={[Autoplay, Navigation]}
						onBeforeInit={(swiper) => {
							swiperRef.current = swiper;
						}}
						spaceBetween={24}
						slidesPerView={1}
						loop={true}
						autoplay={{
							delay: 3500,
							disableOnInteraction: false,
						}}
						breakpoints={{
							640: {
								slidesPerView: 2,
							},
							1024: {
								slidesPerView: 3,
							},
						}}
					>
						{displayProjects.map((project, index) => (
							<SwiperSlide key={`${project.id}-${index}`}>
								<ProjectCard
									project={project}
									onClick={() => handleCardClick(project)}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className={styles.viewAllContainer}>
					<BrushButton className={styles.viewAllButton} size="medium" to="/projects">
						View All Projects
					</BrushButton>
				</div>

				{selectedProject && (
					<ProjectModal project={selectedProject} onClose={handleCloseModal} />
				)}
			</div>
		</section>
	);
};
