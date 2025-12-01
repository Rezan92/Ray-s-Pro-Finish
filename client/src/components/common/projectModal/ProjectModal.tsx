import React from 'react';
import './ProjectModal.css';
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
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <img
          src={project.image}
          alt={project.title}
          className="modal-image"
        />
        <div className="modal-text-content">
          <h2 className="modal-title">{project.title}</h2>
          <span className="modal-tag">{project.tag}</span>
          <p className="modal-location">{project.location}</p>
          <div className="modal-divider"></div>
          <p className="modal-details">{project.details}</p>
        </div>
      </div>
    </>
  );
};

