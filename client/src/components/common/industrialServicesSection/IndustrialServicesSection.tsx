import { StatCard } from '../statCard/StatCard';
import './IndustrialServicesSection.css';
import { HardHat, Smile } from 'lucide-react';
import bgImage from '@/assets/industrialServices/industrialServices.png';

// Using a placeholder for the background image on the right

export const IndustrialServicesSection = () => {
	return (
		<section className='industrial-services-section'>
			<div
				className='industrial-services-right-bg'
				style={{ backgroundImage: `url(${bgImage})` }}
			>
				{' '}
			</div>
			<div className='industrial-services-section-container'>
				{/* Left Column (Text) */}
				<div className='industrial-services-left-content'>
					<span className='industrial-services-subtitle'>
						A COMMITMENT TO QUALITY
					</span>
					<h2 className='industrial-services-title'>
						The Difference is in the Details
					</h2>
					<p className='industrial-services-description'>
						A great finish is only possible with great preparation. We take the
						time to properly prep every surface, protect your furniture, and
						ensure our work area is spotless at the end of each day.
					</p>
					<p className='industrial-services-description'>
						We use high-quality materials and professional techniques to deliver
						a final product that not only looks beautiful but is built to last.
						Your satisfaction is our top priority.
					</p>
				</div>

				{/* Right Column (Image + Stats) */}

				<div className='industrial-services-stats-wrapper'>
					<StatCard
						icon={HardHat}
						count='200'
						label='PROJECT COMPLETED'
						variant='primary'
					/>
					<StatCard
						icon={Smile}
						count='250'
						label='HAPPY CUSTOMERS'
						variant='light'
					/>
				</div>
			</div>
		</section>
	);
};
