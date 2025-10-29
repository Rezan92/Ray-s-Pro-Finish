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
    image: 'https://placehold.co/600x400/5f6b8a/ffffff?text=Project+1',
    tag: 'Building',
    title: 'Building A Condominium',
    location: 'San Francisco, California, USA',
    details: 'Here is the detailed information for Project 1. We will provide this content later. It can include a full description, client, budget, and timeline.',
  },
  {
    id: 2,
    image: 'https://placehold.co/600x400/6a5f8a/ffffff?text=Project+2',
    tag: 'Renovation',
    title: 'Commercial Renovation',
    location: 'New York, New York, USA',
    details: 'This was a complex renovation in downtown New York. We will add more details about this project soon.',
  },
  {
    id: 3,
    image: 'https://placehold.co/600x400/8a5f7e/ffffff?text=Project+3',
    tag: 'Building',
    title: 'Modern Office Space',
    location: 'Chicago, Illinois, USA',
    details: 'This modern office was built from the ground up. More information will be available here.',
  },
  {
    id: 4,
    image: 'https://placehold.co/600x400/8a5f6a/ffffff?text=Project+4',
    tag: 'Architecture',
    title: 'Luxury Home Design',
    location: 'Miami, Florida, USA',
    details: 'Our team handled the complete architecture and build for this luxury home. More details to come.',
  },
  {
    id: 5,
    image: 'https://placehold.co/600x400/8a7e5f/ffffff?text=Project+5',
    tag: 'Interior',
    title: 'Restaurant Interior',
    location: 'Los Angeles, California, USA',
    details: 'We designed and built the interior for this 5-star restaurant. More info will be added.',
  },
  {
    id: 6,
    image: 'https://placehold.co/600x400/5f8a7a/ffffff?text=Project+6',
    tag: 'Building',
    title: 'Industrial Warehouse',
    location: 'Houston, Texas, USA',
    details: 'This large-scale industrial warehouse was a major project. We will update this with more details.',
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
    <section className="latest-projects-section">
      <div className="latest-projects-header">
        <span className="latest-projects-subtitle">OUR GLOBAL WORK INDUSTRIES</span>
        <h2 className="latest-projects-title">Latest Projects</h2>
      </div>

      <div className="latest-projects-grid">
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
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </section>
  );
};

