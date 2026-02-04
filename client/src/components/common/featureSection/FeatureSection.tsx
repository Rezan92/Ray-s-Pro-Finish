import styles from './FeatureSection.module.css';
import { PaintRoller, Smile, Wand2 } from 'lucide-react'; // Icons from screenshot
import { FeatureCard } from '../featureCard/FeatureCard';

export const FeatureSection = () => {
	const cardData = [
		{
			icon: Wand2,
			title: 'Precision Drywall Repair',
			description:
				'From nail holes to water damage, we make wall imperfections vanish. Our seamless patching and texture matching create a flawless surface.',
			variant: 'dark',
			delay: '0ms',
		},
		{
			icon: PaintRoller,
			title: 'High-Quality Interior Painting',
			description:
				'A great paint job is all in the details. We guarantee clean lines, sharp edges, and a smooth, durable finish that brightens your home.',
			variant: 'primary',
			delay: '100ms',
		},
		{
			icon: Smile,
			title: 'Clean & Reliable Service',
			description:
				'We respect your time and your space. We show up on schedule, protect your furniture, and leave your home spotless.',
			variant: 'dark',
			delay: '200ms',
		},
	];

	return (
		<section className={styles.featureSection}>
			<div className={styles.featureGrid}>
				{cardData.map((card, index) => (
					<FeatureCard
						key={index}
						icon={card.icon}
						title={card.title}
						description={card.description}
						variant={card.variant as 'dark' | 'primary'}
						animationDelay={card.delay}
					/>
				))}
			</div>
		</section>
	);
};
