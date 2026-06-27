import React, { useState } from 'react';
import styles from './ServiceModal.module.css';
import { X, ZoomIn } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { BrushButton } from '../brushButton/BrushButton';

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
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
				
				{service.image && (
					<div className={styles.imageContainer} onClick={() => setIsLightboxOpen(true)}>
						<img src={service.image} alt={service.title} className={styles.modalImage} />
						<div className={styles.imageOverlay}>
							<ZoomIn size={32} color="#fff" />
							<span>Click to Zoom</span>
						</div>
					</div>
				)}

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
						<BrushButton href="#quote" className={styles.actionButton} onClick={onClose} size="small">
							Schedule a Walkthrough &rarr;
						</BrushButton>
					</div>
				)}
			</div>

			{/* Lightbox Overlay */}
			{isLightboxOpen && service.image && (
				<div className={styles.lightboxOverlay}>
					<button className={styles.lightboxCloseBtn} onClick={() => setIsLightboxOpen(false)}>
						<X size={32} color="#fff" />
					</button>
					<TransformWrapper
						initialScale={1}
						minScale={0.5}
						maxScale={4}
						centerOnInit={true}
					>
						<TransformComponent wrapperClass={styles.lightboxTransformWrapper}>
							<img 
								src={service.image} 
								alt={service.title} 
								className={styles.lightboxImage} 
							/>
						</TransformComponent>
					</TransformWrapper>
				</div>
			)}
		</>
	);
};