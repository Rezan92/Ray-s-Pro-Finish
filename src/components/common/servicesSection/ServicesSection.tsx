import React, { useState } from 'react'; // Import useState
import { ServiceCard } from '../serviceCard/ServiceCard';
import './ServicesSection.css';
import { PaintRoller, Sheet, Wand2 } from 'lucide-react';
import paintingImage from '@/assets/serviceSection/Painting.png';
import patchingImage from '@/assets/serviceSection/Patching.png';
import installationImage from '@/assets/serviceSection/installation.png';
import { ServiceModal } from '../serviceModal/ServiceModal'; // 1. Import the new modal
import type { Service } from '../serviceModal/ServiceModal'; // 2. Import the Service type

// 3. Define all service data, including the new details
const servicesData: Service[] = [
	{
		title: 'Interior Painting',
		image: paintingImage,
		icon: PaintRoller,
		description:
			'From walls and ceilings to trim and doors, we provide a clean, high-quality paint job that brings new life to your space.',
		details: [
			"A high-quality paint job is the fastest way to transform your space, but the secret is in the prep work.",
			"Our process is meticulous. We start by protecting your floors, furniture, and fixtures. We then prepare all surfaces by filling nail holes, caulking cracks, and sanding imperfections for a perfectly smooth base.",
			"Using premium paints and professional techniques, we deliver sharp, clean lines and a durable, even finish on all walls, ceilings, and trim. Your satisfaction is our guarantee.",
		],
	},
	{
		title: 'Drywall Repair & Patching',
		image: patchingImage,
		icon: Wand2,
		description:
			"Don't let holes, cracks, or water damage ruin your walls. We specialize in seamless patches that make the damage completely disappear.",
		details: [
			"From small nail pops and stress cracks to large holes from plumbing or electrical work, our drywall repair service makes wall damage vanish.",
			"We specialize in seamless patching. Our process involves securely backing the patch, applying professional-grade tape, and skillfully applying multiple coats of joint compound, feathering the edges to blend perfectly with the existing wall.",
			"We are experts at matching existing wall textures—whether you have orange peel, knockdown, or a custom finish—so that after priming and painting, the repair is completely invisible.",
		],
	},
	{
		title: 'Drywall Installation',
		image: installationImage,
		icon: Sheet,
		description:
			'Finishing a basement or remodeling? We professionally hang, tape, and finish new drywall for perfectly smooth, paint-ready walls.',
		details: [
			"Perfect for basement finishing, home additions, or extensive remodels. We provide professional drywall installation (hanging) and finishing services.",
			"Our team expertly hangs and fastens new drywall sheets, ensuring all joints are staggered correctly and screws are set to the proper depth to prevent future pops.",
			"We then tape, mud, and sand all seams and corners to a Level 4 or Level 5 (perfectly smooth) finish, leaving you with pristine, straight, and durable walls that are ready for primer and paint.",
		],
	},
];

export const ServicesSection = () => {
	// 4. Add state to manage the modal
	const [selectedService, setSelectedService] = useState<Service | null>(null);

	const handleCardClick = (service: Service) => {
		setSelectedService(service);
	};

	const handleCloseModal = () => {
		setSelectedService(null);
	};

	return (
		<section className='services-section'>
			<div className='services-section-header'>
				<span className='services-section-subtitle'>Our Services</span>
				<h2 className='services-section-title'>
					Our Painting & Drywall Services
				</h2>
			</div>

			<div className='services-section-grid'>
				{/* 5. Map over the new data object */}
				{servicesData.map((service) => (
					<ServiceCard
						key={service.title}
						icon={service.icon}
						imageSrc={service.image}
						title={service.title}
						description={service.description}
						onClick={() => handleCardClick(service)} // 6. Pass the click handler
					/>
				))}
			</div>

			{/* 7. Conditionally render the modal */}
			{selectedService && (
				<ServiceModal
					service={selectedService}
					onClose={handleCloseModal}
				/>
			)}
		</section>
	);
};