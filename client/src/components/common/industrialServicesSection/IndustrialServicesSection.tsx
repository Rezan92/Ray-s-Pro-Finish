import { StatCard } from '../statCard/StatCard';
import styles from './IndustrialServicesSection.module.css';
import { HardHat, Smile } from 'lucide-react';
import bgImage from '@/assets/industrialServices/industrialServices.png';

// Using a placeholder for the background image on the right

export const IndustrialServicesSection = () => {
	return (
		<section className={styles.industrialServicesSection}>
			<div
				className={styles.industrialServicesRightBg}
				style={{ backgroundImage: `url(${bgImage})` }}
			>
				{' '}
			</div>
			<div className={styles.industrialServicesSectionContainer}>
				{/* Left Column (Text) */}
				<div className={styles.industrialServicesLeftContent}>
					<span className={styles.industrialServicesSubtitle}>
						A COMMITMENT TO QUALITY
					</span>
					<h2 className={styles.industrialServicesTitle}>
						The Difference is in the Details
					</h2>
					<p className={styles.industrialServicesDescription}>
						A great finish is only possible with great preparation. We take the
						time to properly prep every surface, protect your furniture, and
						ensure our work area is spotless at the end of each day.
					</p>
					<p className={styles.industrialServicesDescription}>
						We use high-quality materials and professional techniques to deliver
						a final product that not only looks beautiful but is built to last.
						Your satisfaction is our top priority.
					</p>
				</div>

				{/* Right Column (Image + Stats) */}

				<div className={styles.industrialServicesStatsWrapper}>
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
