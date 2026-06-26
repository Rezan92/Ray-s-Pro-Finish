import React from 'react';
import styles from './TestimonialSlider.module.css';
import { Star } from 'lucide-react';

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
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={16}
										className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
										fill={i < testimonial.rating ? "currentColor" : "none"}
									/>
								))}
							</div>
							<p className={styles.reviewText}>{testimonial.quote}</p>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
