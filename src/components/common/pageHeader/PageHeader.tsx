import React from 'react';
import './PageHeader.css';

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
		<section className='page-header' style={headerStyle}>
			<div className='page-header-overlay'></div>
			<div className='page-header-container'>
				<h1 className='page-header-title'>{title}</h1>
			</div>
		</section>
	);
};