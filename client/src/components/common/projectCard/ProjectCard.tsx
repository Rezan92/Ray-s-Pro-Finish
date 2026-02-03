import React from 'react';
import styles from './ProjectCard.module.css';
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
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img
          src={project.image}
          alt={project.title}
          className={styles.image}
        />
        <div className={styles.plusOverlay}>
          {/* You can add an icon here if needed, or rely on CSS/image */}
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.tag}>{project.tag}</span>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.location}>
          <MapPin size={16} />
          <span>{project.location}</span>
        </div>
      </div>
    </div>
  );
};
