import React from 'react';
import './PageHeader.css';
import heroImage from '@/assets/hero/Hero.png';

interface PageHeaderProps {
	title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
	const headerStyle = {
		backgroundImage: `url(${heroImage})`,
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
