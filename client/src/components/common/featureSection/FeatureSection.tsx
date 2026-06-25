import styles from './FeatureSection.module.css';
import { ShieldCheck, Star, FileSignature, Award, Clock, ThumbsUp } from 'lucide-react';
import { FeatureCard } from '../featureCard/FeatureCard';
import { BrushButton } from '../brushButton/BrushButton';

export const FeatureSection = () => {
	const features = [
		{
			icon: ShieldCheck,
			title: 'Dust-Free Preparation',
			description: 'We use advanced HEPA-filtered sanders and meticulous masking to ensure your home remains spotless from start to finish.',
			delay: '0ms',
		},
		{
			icon: Star,
			title: 'Expert Team',
			description: 'Our team brings years of specialized experience to your home. Every project receives meticulous attention to detail from start to finish.',
			delay: '100ms',
		},
		{
			icon: Clock,
			title: 'On Time, Guaranteed',
			description: 'We provide firm start and completion dates with punctual daily arrivals so your project never drags out.',
			delay: '200ms',
		},
		{
			icon: FileSignature,
			title: 'Transparent Pricing',
			description: 'No hidden costs and no surprises. The quote you receive is the exact price you pay for the fully agreed-upon scope of work.',
			delay: '300ms',
		},
		{
			icon: Award,
			title: 'Premium Materials',
			description: 'We exclusively use top-tier paints like Benjamin Moore and Sherwin-Williams to guarantee a flawless, lasting finish.',
			delay: '400ms',
		},
		{
			icon: ThumbsUp,
			title: '100% Satisfaction',
			description: "We aren't finished until you are completely thrilled with the results. We stand behind our work and your satisfaction is our priority.",
			delay: '500ms',
		},
	];

	return (
		<section className={styles.featureSection}>
			{/* Static Wavy Background Layer */}
			<div className={styles.bgContainer}>
				<svg className={styles.paintedLinesSvg} width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
					<filter id="feature-brush-bg" x="-20%" y="-20%" width="140%" height="140%">
						<feTurbulence type="fractalNoise" baseFrequency="0.04 0.8" numOctaves="3" result="noise" />
						<feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
						<feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -1.5" result="holes" />
						<feComposite in="displaced" in2="holes" operator="out" />
					</filter>
					<g filter="url(#feature-brush-bg)" stroke="#94a3b8" fill="none" strokeLinecap="square">
						{/* Left to Right Wavy */}
						<path className={styles.staticPath} d="M -200 400 C 500 200, 1400 800, 2100 300" strokeWidth="120" />
					</g>
				</svg>
			</div>

			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>Why Choose Us?</h2>
				<p className={styles.sectionSubtitle}>
					From routine drywall repairs to major exterior painting, we've got your home covered with reliable and friendly service.
				</p>
			</div>

			<div className={styles.timelineContainer}>
                <div className={styles.timelineLine}></div>
				<div className={styles.featureGrid}>
					{features.map((card, index) => (
						<FeatureCard
							key={index}
							index={index}
							icon={card.icon}
							title={card.title}
							description={card.description}
							animationDelay={card.delay}
						/>
					))}
				</div>
			</div>

			<div className={styles.actionContainer}>
				<BrushButton to="/contact">
					Get a FREE quote
				</BrushButton>
			</div>
		</section>
	);
};