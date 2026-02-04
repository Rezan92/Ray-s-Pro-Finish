import React from 'react';
import { ClipboardList, ShieldCheck, PaintRoller, Sparkles } from 'lucide-react';
import styles from './OurProcessSection.module.css';

// A sub-component for each step
const ProcessStep: React.FC<{
	icon: React.ElementType;
	step: string;
	title: string;
	description: string;
}> = ({ icon: Icon, step, title, description }) => {
	return (
		<div className={styles.processStep}>
			<div className={styles.processStepIconWrapper}>
				<Icon size={40} />
			</div>
			<div className={styles.processStepContent}>
				<span className={styles.processStepNumber}>{step}</span>
				<h3 className={styles.processStepTitle}>{title}</h3>
				<p className={styles.processStepDescription}>{description}</p>
			</div>
		</div>
	);
};

export const OurProcessSection: React.FC = () => {
	return (
		<section className={styles.ourProcessSection}>
			<div className={styles.ourProcessHeader}>
				<span className={styles.ourProcessSubtitle}>HOW IT WORKS</span>
				<h2 className={styles.ourProcessTitle}>Our Professional Process</h2>
			</div>
			<div className={styles.ourProcessGrid}>
				<ProcessStep
					icon={ClipboardList}
					step='Step 01'
					title='Consultation & Quote'
					description='We start with a free, on-site consultation to understand your vision, assess the scope, and provide a detailed, transparent estimate. No hidden fees.'
				/>
				<ProcessStep
					icon={ShieldCheck}
					step='Step 02'
					title='Protect & Prepare'
					description='This is the most critical step. We meticulously cover your floors, protect your furniture, and professionally prep all surfaces (sanding, patching, priming) for a flawless finish.'
				/>
				<ProcessStep
					icon={PaintRoller}
					step='Step 03'
					title='Execute with Precision'
					description='Our skilled team uses high-quality materials and professional techniques to deliver sharp lines, smooth walls, and a beautiful, durable finish that lasts.'
				/>
				<ProcessStep
					icon={Sparkles}
					step='Step 04'
					title='Cleanup & Walkthrough'
					description='We leave your home spotless. We conduct a final walkthrough with you to ensure every detail is perfect and you are 100% satisfied with the transformation.'
				/>
			</div>
		</section>
	);
};
