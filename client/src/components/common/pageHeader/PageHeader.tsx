import React from 'react';
import styles from './PageHeader.module.css';

// 1. Import all hero images
import defaultHeroImage from '@/assets/hero/Hero.png';
import aboutHeroImage from '@/assets/hero/AboutHero.png';
import contactHeroImage from '@/assets/hero/ContactHero.png';
import projectsHeroImage from '@/assets/hero/ProjectsHero.png';
import servicesHeroImage from '@/assets/hero/ServicesHero.png';

interface PageHeaderProps {
	title: string;
}

// 2. Create a map to link titles to the new images
const imageMap: { [key: string]: string } = {
  'About Us': aboutHeroImage,
  'Contact Us': contactHeroImage,
  'Our Work': projectsHeroImage,
  'Our Services': servicesHeroImage,
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
	
  // 3. Look up the correct image, or use the default
  const imageUrl = imageMap[title] || defaultHeroImage;

	const headerStyle = {
		backgroundImage: `url(${imageUrl})`, // 4. Use the dynamic image URL
	};

	return (
		<section className={styles.pageHeader} style={headerStyle}>
			<div className={styles.pageHeaderOverlay}></div>
			<div className={styles.pageHeaderContainer}>
				<h1 className={styles.pageHeaderTitle}>{title}</h1>
			</div>
		</section>
	);
};