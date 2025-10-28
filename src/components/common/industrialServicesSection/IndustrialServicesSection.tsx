import { StatCard } from '../statCard/StatCard';
import './IndustrialServicesSection.css';
import { HardHat, Smile } from 'lucide-react';

// Using a placeholder for the background image on the right
const bgImage = 'https://placehold.co/800x600/666/fff?text=Workers';

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
						WILCON A CONSTRUCTION COMPANY
					</span>
					<h2 className='industrial-services-title'>
						Best Provider for Industrial Services
					</h2>
					<p className='industrial-services-description'>
						Far far away, behind the word mountains, far from the countries
						Vokalia and Consonantia, there live the blind texts.
					</p>
					<p className='industrial-services-description'>
						Separated they live in Bookmarksgrove right at the coast of the
						Semantics, a large language ocean.
					</p>
				</div>

				{/* Right Column (Image + Stats) */}

				<div className='industrial-services-stats-wrapper'>
					<StatCard
						icon={HardHat}
						count='48,000'
						label='PROJECT COMPLETED'
						variant='primary'
					/>
					<StatCard
						icon={Smile}
						count='54,900'
						label='HAPPY CUSTOMERS'
						variant='light'
					/>
				</div>
			</div>
		</section>
	);
};
