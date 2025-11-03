import React from 'react';
import { Check } from 'lucide-react';
import './SpecialtyServicesSection.css';

// A sub-component for each item
const SpecialtyItem: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className='specialty-item'>
			<Check size={20} className='specialty-item-icon' />
			<span className='specialty-item-title'>{title}</span>
		</div>
	);
};

export const SpecialtyServicesSection: React.FC = () => {
	const services = [
		'Trim & Door Painting',
		'Cabinet Painting',
		'Drywall Texture Matching',
		'Move-In / Move-Out Painting',
		'Accent Walls',
	];

	return (
		<section className='specialty-services-section'>
			<div className='specialty-services-header'>
				<span className='specialty-services-subtitle'>BEYOND THE BASICS</span>
				<h2 className='specialty-services-title'>
					Comprehensive Finishing Services
				</h2>
			</div>
			<div className='specialty-services-grid'>
				{services.map((service) => (
					<SpecialtyItem key={service} title={service} />
				))}
			</div>
		</section>
	);
};
