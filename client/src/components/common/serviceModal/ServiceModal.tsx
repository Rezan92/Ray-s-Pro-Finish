import React from 'react';
import styles from './ServiceModal.module.css'; // Import the new CSS
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Define the shape of a Service
export type Service = {
	title: string;
	image: string;
	details: string[]; // An array of paragraphs for the description
	icon: LucideIcon;
	description: string;
};

type ServiceModalProps = {
	service: Service;
	onClose: () => void;
};

export const ServiceModal: React.FC<ServiceModalProps> = ({
	service,
	onClose,
}) => {
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
				<img
					src={service.image}
					alt={service.title}
					className={styles.modalImage}
				/>
				<div className={styles.modalTextContent}>
					<h2 className={styles.modalTitle}>{service.title}</h2>
					<div className={styles.modalDivider}></div>
					{/* Loop over the details array and render each as a paragraph */}
					{service.details.map((paragraph, index) => (
						<p
							key={index}
							className={styles.modalDetails}
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</>
	);
};