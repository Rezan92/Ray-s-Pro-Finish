import React from 'react';
import { TestimonialSlider } from '../testimonialSlider/TestimonialSlider';
import type { Testimonial } from '../testimonialSlider/TestimonialSlider';
import './TestimonialSection.css';

const testimonialsData: Testimonial[] = [
	{
		id: 1,
		quote:
			'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
		author: 'Jeff Freshman',
		role: 'GUESTS',
		imageUrl: 'https://i.pravatar.cc/100?img=1',
	},
	{
		id: 2,
		quote:
			'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot.',
		author: 'Jane Doe',
		role: 'CLIENTS',
		imageUrl: 'https://i.pravatar.cc/100?img=2',
	},
	{
		id: 3,
		quote:
			'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs.',
		author: 'John Smith',
		role: 'PARTNERS',
		imageUrl: 'https://i.pravatar.cc/100?img=3',
	},
	{
		id: 4,
		quote:
			'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.',
		author: 'Emily White',
		role: 'GUESTS',
		imageUrl: 'https://i.pravatar.cc/100?img=4',
	},
	{
		id: 5,
		quote:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		author: 'Michael Brown',
		role: 'CLIENTS',
		imageUrl: 'https://i.pravatar.cc/100?img=5',
	},
	{
		id: 6,
		quote:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		author: 'Michael Brown',
		role: 'CLIENTS',
		imageUrl: 'https://i.pravatar.cc/100?img=5',
	},
];

export const TestimonialSection: React.FC = () => {
	return (
		<section className='testimonial-section'>
			<div className='testimonial-section_flex'>
				<div className='testimonial-section__left'>
					<div className='testimonial-section__left-container'>
						<h3 className='testimonial-section__subtitle'>READ TESTIMONIALS</h3>
						<h2 className='testimonial-section__title'>
							It's always a joy to hear that the work we do has positively
							reviews
						</h2>
					</div>
				</div>
				<div className='testimonial-section__right'>
					<TestimonialSlider testimonials={testimonialsData} />
				</div>
			</div>
		</section>
	);
};
