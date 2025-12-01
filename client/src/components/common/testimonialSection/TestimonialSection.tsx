import React from 'react';
import { TestimonialSlider } from '../testimonialSlider/TestimonialSlider';
import type { Testimonial } from '../testimonialSlider/TestimonialSlider';
import './TestimonialSection.css';

const testimonialsData: Testimonial[] = [
	{
		id: 1,
		quote:
			"Ray's team painted our entire first floor, and we couldn't be happier. The lines are incredibly sharp, and they were so clean and respectful of our home. It looks brand new!",
		author: 'Sarah J.',
		role: 'Homeowner in Wheaton, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=1',
	},
	{
		id: 2,
		quote:
			'I had a large hole in my ceiling from a water leak. Ray came in and patched it perfectly. You absolutely cannot tell where the damage was. Amazing work and very professional.',
		author: 'Mark T.',
		role: 'Homeowner in Lombard, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=2',
	},
	{
		id: 3,
		quote:
			'We hired them to finish our garage drywall. They were on time, on budget, and the quality of the finish sanding is outstanding. We will definitely be calling them back to paint it.',
		author: 'David & Jen K.',
		role: 'Homeowners in Glen Ellyn, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=3',
	},
	{
		id: 4,
		quote:
			"I was worried about matching the texture on a drywall patch in my hallway, but they did an incredible job. It blends seamlessly. I'm so impressed with the attention to detail.",
		author: 'Emily B.',
		role: 'Homeowner in Carol Stream, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=4',
	},
	{
		id: 5,
		quote:
			"Ray's team painted our entire first floor, and we couldn't be happier. The lines are incredibly sharp, and they were so clean and respectful of our home. It looks brand new!",
		author: 'Michael R.',
		role: 'Homeowner in Wheaton, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=5',
	},
	{
		id: 6,
		quote:
			'I had a large hole in my ceiling from a water leak. Ray came in and patched it perfectly. You absolutely cannot tell where the damage was. Amazing work and very professional.',
		author: 'Chris P.',
		role: 'Homeowner in Lombard, IL',
		imageUrl: 'https://i.pravatar.cc/100?img=6', // Changed to img=6 for variety
	},
];

export const TestimonialSection: React.FC = () => {
	return (
		<section className='testimonial-section'>
			<div className='testimonial-section_flex'>
				<div className='testimonial-section__left'>
					<div className='testimonial-section__left-container'>
						<h3 className='testimonial-section__subtitle'>
							WHAT OUR CLIENTS SAY
						</h3>
						<h2 className='testimonial-section__title'>
							Words From Homeowners We've Helped
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
