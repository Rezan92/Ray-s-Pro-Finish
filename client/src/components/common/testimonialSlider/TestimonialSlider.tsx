import React from 'react';
import styles from './TestimonialSlider.module.css';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  imageUrl: string;
  rating: number;
  timeAgo: string;
}

interface TestimonialSliderProps {
	testimonials: Testimonial[];
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
	testimonials,
}) => {
	return (
		<div className={styles.testimonialSliderWrapper}>
			<Swiper
				modules={[Autoplay, Pagination, Navigation]}
				spaceBetween={24}
				slidesPerView={1}
				loop={true}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				pagination={{ clickable: true }}
				breakpoints={{
					640: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
					1280: {
						slidesPerView: 4,
					},
				}}
				className={styles.swiperContainer}
			>
				{testimonials.map((testimonial, index) => (
					<SwiperSlide key={`${testimonial.id}-${index}`}>
						<div className={styles.reviewCard}>
							<div className={styles.cardHeader}>
								<img
									src={testimonial.imageUrl}
									alt={testimonial.author}
									className={styles.authorAvatar}
								/>
								<div className={styles.authorInfo}>
									<h4 className={styles.authorName}>{testimonial.author}</h4>
									<span className={styles.timeAgo}>{testimonial.timeAgo}</span>
								</div>
							</div>
							<div className={styles.starRating}>
								<svg width="0" height="0" style={{ position: 'absolute' }}>
									<defs>
										<linearGradient id={`star-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset={`${Math.round((testimonial.rating % 1) * 100)}%`} stopColor="var(--color-primary)" />
											<stop offset={`${Math.round((testimonial.rating % 1) * 100)}%`} stopColor="#d1d5db" />
										</linearGradient>
									</defs>
								</svg>
								{[...Array(5)].map((_, i) => {
									const isFull = i < Math.floor(testimonial.rating);
									const isPartial = i === Math.floor(testimonial.rating) && (testimonial.rating % 1) !== 0;
									const fillValue = isFull ? 'var(--color-primary)' : isPartial ? `url(#star-gradient-${index})` : '#d1d5db';
									
									return (
										<svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={fillValue} />
										</svg>
									);
								})}
							</div>
							<p className={styles.reviewText}>{testimonial.quote}</p>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
