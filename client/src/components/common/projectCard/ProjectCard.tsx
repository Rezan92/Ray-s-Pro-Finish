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
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.detailsText}>{project.details}</p>
        <span className={styles.viewDetailsLink}>View Details</span>
      </div>
    </div>
  );
};
