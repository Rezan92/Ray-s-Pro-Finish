import { ServiceCard } from '../serviceCard/ServiceCard';
import './ServicesSection.css';
import { PaintRoller, Sheet, Wand2 } from 'lucide-react';
import paintingImage from '@/assets/serviceSection/Painting.png';
import patchingImage from '@/assets/serviceSection/Patching.png';
import installationImage from '@/assets/serviceSection/installation.png';

const serviceImage1 = paintingImage;
const serviceImage2 = patchingImage;
const serviceImage3 = installationImage;

export const ServicesSection = () => {
	return (
		<section className='services-section'>
			<div className='services-section-header'>
				<span className='services-section-subtitle'>Our Services</span>
				<h2 className='services-section-title'>
					Our Painting & Drywall Services
				</h2>
			</div>

			<div className='services-section-grid'>
				<ServiceCard
					icon={PaintRoller}
					imageSrc={serviceImage1}
					title='Interior Painting'
					description='From walls and ceilings to trim and doors, we provide a clean, high-quality paint job that brings new life to your space.'
				/>
				<ServiceCard
					icon={Wand2}
					imageSrc={serviceImage2}
					title='Drywall Repair & Patching'
					description="Don't let holes, cracks, or water damage ruin your walls. We specialize in seamless patches that make the damage completely disappear."
				/>
				<ServiceCard
					icon={Sheet}
					imageSrc={serviceImage3}
					title='Drywall Installation'
					description='Finishing a basement or remodeling? We professionally hang, tape, and finish new drywall for perfectly smooth, paint-ready walls.'
				/>
			</div>
		</section>
	);
};
