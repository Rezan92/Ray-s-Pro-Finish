import React from 'react';
import './ProjectCard.css';
import { MapPin } from 'lucide-react';

// Define the shape of a project
export type Project = {
  id: number;
  image: string;
  tag: string;
  title: string;
  location: string;
  details: string; // The "more info" for the modal
};

type ProjectCardProps = {
  project: Project;
  onClick: () => void; // Function to open the modal
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-image-wrapper">
        <img
          src={project.image}
          alt={project.title}
          className="project-card-image"
        />
      </div>
      <div className="project-card-content">
        <span className="project-card-tag">{project.tag}</span>
        <h3 className="project-card-title">{project.title}</h3>
        <div className="project-card-location">
          <MapPin size={16} />
          <span>{project.location}</span>
        </div>
      </div>
    </div>
  );
};
