import React from 'react';
import { Check } from 'lucide-react';
import styles from './SpecialtyServicesSection.module.css';

// A sub-component for each item
const SpecialtyItem: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className={styles.specialtyItem}>
			<Check size={20} className={styles.specialtyItemIcon} />
			<span className={styles.specialtyItemTitle}>{title}</span>
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
		<section className={styles.specialtyServicesSection}>
			<div className={styles.specialtyServicesHeader}>
				<span className={styles.specialtyServicesSubtitle}>BEYOND THE BASICS</span>
				<h2 className={styles.specialtyServicesTitle}>
					Comprehensive Finishing Services
				</h2>
			</div>
			<div className={styles.specialtyServicesGrid}>
				{services.map((service) => (
					<SpecialtyItem key={service} title={service} />
				))}
			</div>
		</section>
	);
};
