import React from 'react';
import { TestimonialSlider } from '../testimonialSlider/TestimonialSlider';
import type { Testimonial } from '../testimonialSlider/TestimonialSlider';
import { WriteReviewModal } from '../writeReviewModal/WriteReviewModal';
import { BrushButton } from '../brushButton/BrushButton';
import styles from './TestimonialSection.module.css';

const initialTestimonialsData: Testimonial[] = [
	{
		id: 1,
		quote:
			"Ray's team painted our entire first floor, and we couldn't be happier. The lines are incredibly sharp, and they were so clean and respectful of our home. It looks brand new!",
		author: 'Sarah J.',
		role: 'Interior Painting',
		imageUrl: 'https://i.pravatar.cc/100?img=1',
		rating: 5,
		timeAgo: '3 weeks ago',
	},
	{
		id: 2,
		quote:
			'I had a large hole in my ceiling from a water leak. Ray came in and patched it perfectly. You absolutely cannot tell where the damage was. Amazing work and very professional.',
		author: 'Mark T.',
		role: 'Drywall Repair',
		imageUrl: 'https://i.pravatar.cc/100?img=2',
		rating: 5,
		timeAgo: '1 month ago',
	},
	{
		id: 3,
		quote:
			'We hired them to finish our garage drywall. They were on time, on budget, and the quality of the finish sanding is outstanding. We will definitely be calling them back to paint it.',
		author: 'David & Jen K.',
		role: 'Drywall Installation',
		imageUrl: 'https://i.pravatar.cc/100?img=3',
		rating: 5,
		timeAgo: '2 months ago',
	},
	{
		id: 4,
		quote:
			"I was worried about matching the texture on a drywall patch in my hallway, but they did an incredible job. It blends seamlessly. I'm so impressed with the attention to detail.",
		author: 'Emily B.',
		role: 'Drywall Repair',
		imageUrl: 'https://i.pravatar.cc/100?img=4',
		rating: 4,
		timeAgo: '4 months ago',
	},
	{
		id: 5,
		quote:
			"Ray's team painted our entire first floor, and we couldn't be happier. The lines are incredibly sharp, and they were so clean and respectful of our home. It looks brand new!",
		author: 'Michael R.',
		role: 'Interior Painting',
		imageUrl: 'https://i.pravatar.cc/100?img=5',
		rating: 5,
		timeAgo: '5 months ago',
	},
	{
		id: 6,
		quote:
			'I had a large hole in my ceiling from a water leak. Ray came in and patched it perfectly. You absolutely cannot tell where the damage was. Amazing work and very professional.',
		author: 'Chris P.',
		role: 'Drywall Repair',
		imageUrl: 'https://i.pravatar.cc/100?img=6',
		rating: 5,
		timeAgo: '7 months ago',
	},
];

export const TestimonialSection: React.FC = () => {
	const [testimonials, setTestimonials] = React.useState<Testimonial[]>(initialTestimonialsData);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

	const handleAddReview = (newReview: Testimonial) => {
		setTestimonials((prev) => [newReview, ...prev]);
		setIsModalOpen(false);
		setSuccessMessage("Thank you! Your review has been submitted successfully.");
		setTimeout(() => setSuccessMessage(null), 5000);
	};

	const averageRating = testimonials.length > 0 
		? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
		: "0.0";
	const totalReviews = testimonials.length;
	return (
		<section className={styles.testimonialSection}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>
					Our Customers
				</h2>
				<span className={styles.sectionSubtitle}>
					What our customers say about us
				</span>
			</div>

			<div className={styles.ratingSummaryContainer}>
				<div className={styles.ratingSummaryLeft}>
					<h3 className={styles.ratingSummaryTitle}>Reviews</h3>
					<div className={styles.ratingSummaryScoreRow}>
						<span className={styles.ratingScoreText}>{averageRating}</span>
						<div className={styles.ratingStars}>
							<svg width="0" height="0" style={{ position: 'absolute' }}>
								<defs>
									<linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset={`${Math.round((Number(averageRating) % 1) * 100)}%`} stopColor="var(--color-primary)" />
										<stop offset={`${Math.round((Number(averageRating) % 1) * 100)}%`} stopColor="#d1d5db" />
									</linearGradient>
								</defs>
							</svg>
							{[...Array(5)].map((_, i) => {
								const ratingValue = Number(averageRating);
								const isFull = i < Math.floor(ratingValue);
								const isPartial = i === Math.floor(ratingValue) && (ratingValue % 1) !== 0;
								const fillValue = isFull ? 'var(--color-primary)' : isPartial ? 'url(#star-gradient)' : '#d1d5db';
								
								return (
									<svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={fillValue} />
									</svg>
								);
							})}
						</div>
						<span className={styles.ratingCountText}>Over {totalReviews} Reviews</span>
					</div>
				</div>
				<BrushButton className={styles.writeReviewButton} onClick={() => setIsModalOpen(true)} size="medium">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
					Write a Review
				</BrushButton>
			</div>

			<div className={styles.sliderContainer}>
				<TestimonialSlider testimonials={testimonials} />
			</div>

			{isModalOpen && (
				<WriteReviewModal 
					onClose={() => setIsModalOpen(false)} 
					onSubmit={handleAddReview} 
				/>
			)}

			{successMessage && (
				<div className={styles.successToast}>
					{successMessage}
				</div>
			)}
		</section>
	);
};
