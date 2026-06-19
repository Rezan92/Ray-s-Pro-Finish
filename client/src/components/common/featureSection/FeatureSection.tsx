import styles from './FeatureSection.module.css';
import { ShieldCheck, UserCheck, Clock, Award } from 'lucide-react';
import { FeatureCard } from '../featureCard/FeatureCard';
import aboutImage from '@/assets/aboutSection/aboutSection.png';
import { Button } from '../button/Button';

export const FeatureSection = () => {
	const leftFeatures = [
		{
			icon: ShieldCheck,
			title: 'Dust-Free Preparation',
			description: 'We use advanced HEPA-filtered sanders and meticulous masking to ensure your home remains spotless from start to finish.',
			delay: '0ms',
		},
		{
			icon: UserCheck,
			title: 'Background Checked Crews',
			description: 'Every professional we send is fully vetted and trained to respect your space—no subcontractor roulette.',
			delay: '100ms',
		},
	];

	const rightFeatures = [
		{
			icon: Clock,
			title: 'On Time, Guaranteed',
			description: 'We provide firm start and completion dates with punctual daily arrivals so your project never drags out.',
			delay: '200ms',
		},
		{
			icon: Award,
			title: 'Premium Materials',
			description: 'We exclusively use top-tier paints like Benjamin Moore and Sherwin-Williams to guarantee a flawless, lasting finish.',
			delay: '300ms',
		},
	];

	return (
		<section className={styles.featureSection}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>Why Choose Us?</h2>
				<p className={styles.sectionSubtitle}>
					From routine drywall repairs to major exterior painting, we've got your home covered with reliable and friendly service.
				</p>
			</div>

			<div className={styles.centralHubGrid}>
				{/* Left Column Features */}
				<div className={styles.featuresCol}>
					{leftFeatures.map((card, index) => (
						<FeatureCard
							key={index}
							icon={card.icon}
							title={card.title}
							description={card.description}
							animationDelay={card.delay}
						/>
					))}
				</div>

				{/* Center Column Image */}
				<div className={styles.centerCol}>
					<div className={styles.imageWrapper}>
						<img src={aboutImage} alt="Premium Painting Services" className={styles.centerImage} />
					</div>
				</div>

				{/* Right Column Features */}
				<div className={styles.featuresCol}>
					{rightFeatures.map((card, index) => (
						<FeatureCard
							key={index}
							icon={card.icon}
							title={card.title}
							description={card.description}
							animationDelay={card.delay}
						/>
					))}
				</div>
			</div>

			<div className={styles.actionContainer}>
				<Button to="/contact" variant="primary" className={styles.ctaButton}>
					Get a FREE quote
				</Button>
			</div>
		</section>
	);
};