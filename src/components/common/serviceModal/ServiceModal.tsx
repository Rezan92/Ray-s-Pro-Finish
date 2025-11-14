import React from 'react';
import './ServiceModal.css'; // Import the new CSS
import { X } from 'lucide-react';

// Define the shape of a Service
export type Service = {
	title: string;
	image: string;
	details: string[]; // An array of paragraphs for the description
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
				className='modal-overlay'
				onClick={onClose}
			></div>
			<div className='modal-content'>
				<button
					className='modal-close-btn'
					onClick={onClose}
				>
					<X size={24} />
				</button>
				<img
					src={service.image}
					alt={service.title}
					className='modal-image'
				/>
				<div className='modal-text-content'>
					<h2 className='modal-title'>{service.title}</h2>
					<div className='modal-divider'></div>
					{/* Loop over the details array and render each as a paragraph */}
					{service.details.map((paragraph, index) => (
						<p
							key={index}
							className='modal-details'
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</>
	);
};
