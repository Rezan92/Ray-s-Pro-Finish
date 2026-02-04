import React from 'react';
import styles from './ProjectModal.module.css';
import type { Project } from '../projectCard/ProjectCard'; // Import the type
import { X } from 'lucide-react';

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}></div>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          <X size={24} />
        </button>
        <img
          src={project.image}
          alt={project.title}
          className={styles.modalImage}
        />
        <div className={styles.modalTextContent}>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <span className={styles.modalTag}>{project.tag}</span>
          <p className={styles.modalLocation}>{project.location}</p>
          <div className={styles.modalDivider}></div>
          <p className={styles.modalDetails}>{project.details}</p>
        </div>
      </div>
    </>
  );
};