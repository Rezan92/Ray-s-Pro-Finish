import React from 'react';
import styles from './ServiceModal.module.css';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Define the shape of a Service
export type Service = {
	title: string;
	image?: string;
	details: string[];
	icon: LucideIcon;
	iconColor: string;
	description: string;
	isConsultation?: boolean;
};

type ServiceModalProps = {
	service: Service;
	onClose: () => void;
};

export const ServiceModal: React.FC<ServiceModalProps> = ({
	service,
	onClose,
}) => {
	const IconComponent = service.icon;

	return (
		<>
			<div
				className={styles.modalOverlay}
				onClick={onClose}
			></div>
			<div className={styles.modalContent}>
				<button
					className={styles.modalCloseBtn}
					onClick={onClose}
				>
					<X size={24} />
				</button>
				
				<div className={styles.modalHeader}>
					<div 
						className={styles.modalIconWrapper} 
						style={{ backgroundColor: service.iconColor }}
					>
						<IconComponent size={32} color="#ffffff" />
					</div>
					<h2 className={styles.modalTitle}>{service.title}</h2>
				</div>

				<div className={styles.modalDivider}></div>
				
				<div className={styles.modalTextContent}>
					{service.details.map((paragraph, index) => (
						<p
							key={index}
							className={styles.modalDetails}
						>
							{paragraph}
						</p>
					))}
				</div>

				{service.isConsultation && (
					<div className={styles.modalAction}>
						<a href="#quote" className={styles.actionButton} onClick={onClose}>
							Schedule a Walkthrough &rarr;
						</a>
					</div>
				)}
			</div>
		</>
	);
};