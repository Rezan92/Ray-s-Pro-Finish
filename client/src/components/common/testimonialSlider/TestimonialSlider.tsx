import React, { useState, useEffect, useRef } from 'react';
import styles from './TestimonialSlider.module.css';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  imageUrl: string;
}

interface TestimonialSliderProps {
	testimonials: Testimonial[];
}

const QuoteIcon: React.FC = () => (
	<div className={styles.sliderAuthorQuoteIcon}>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='currentColor'
		>
			<path d='M9.983 3v7.391c0 2.9-2.35 5.26-5.238 5.26a5.207 5.207 0 0 1-4.745-3.015c-.5-1.562-.25-3.375.656-4.688C1.523 6.25 3.442 4.938 5.625 4.938c.859 0 1.688.188 2.438.563C8.988 5.953 9.983 4.64 9.983 3zm10 0v7.391c0 2.9-2.35 5.26-5.238 5.26a5.207 5.207 0 0 1-4.745-3.015c-.5-1.562-.25-3.375.656-4.688C11.523 6.25 13.442 4.938 15.625 4.938c.859 0 1.688.188 2.438.563C18.988 5.953 19.983 4.64 19.983 3z' />
		</svg>
	</div>
);

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
	testimonials,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timeoutRef = useRef<number | null>(null);
	const sliderTrackRef = useRef<HTMLDivElement>(null);

	// Clone the first item and add to the end for the infinite loop effect
	const loopedTestimonials = [...testimonials, testimonials[0]];

	const resetTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	useEffect(() => {
		// Don't start a new timer while the reset transition is happening
		if (isTransitioning) return;

		resetTimeout();
		timeoutRef.current = window.setTimeout(() => {
			setCurrentIndex((prevIndex) => prevIndex + 1);
		}, 20000); // Slide duration

		return () => {
			resetTimeout();
		};
	}, [currentIndex, isTransitioning]);

	// This effect handles the "magic" of the infinite loop
	useEffect(() => {
		// When we reach the cloned slide, we need to reset
		if (currentIndex === testimonials.length) {
			setIsTransitioning(true); // Pause the autoplay timer

			// After the slide animation finishes, jump back to the start
			const timer = setTimeout(() => {
				if (sliderTrackRef.current) {
					// Disable transition for the jump
					sliderTrackRef.current.style.transition = 'none';
					// Jump back to the start. This will cause a re-render.
					setCurrentIndex(0);

					// We need to wait for the re-render to complete and the browser to paint the jumped state.
					// Then we can re-enable the transition. A small timeout ensures this happens in a separate browser task.
					setTimeout(() => {
						if (sliderTrackRef.current) {
							sliderTrackRef.current.style.transition = ''; // Restore transition from CSS
						}
						// Resume autoplay after the whole reset operation is complete.
						setIsTransitioning(false);
					}, 50); // A small delay is enough to ensure the jump is not animated.
				}
			}, 700); // This must match the CSS transition duration

			return () => clearTimeout(timer);
		}
	}, [currentIndex, testimonials.length]);

	const handleDotClick = (index: number) => {
		// Prevent clicking during the reset animation
		if (isTransitioning) return;
		resetTimeout();
		setCurrentIndex(index);
	};

	// The active index for dots and author info should loop back to 0
	const activeDisplayIndex = currentIndex % testimonials.length;

	return (
		<div className={styles.testimonialSlider}>
			<div className={styles.sliderViewport}>
				<div
					ref={sliderTrackRef}
					className={styles.sliderTrack}
					style={{ transform: `translateX(-${currentIndex * 100}%)` }}
				>
					{loopedTestimonials.map((testimonial, index) => (
						<div
							key={index}
							className={styles.slide}
						>
							<p className={styles.slideQuote}>{testimonial.quote}</p>
						</div>
					))}
				</div>
			</div>

			<div className={styles.sliderAuthor}>
				<div className={styles.sliderAuthorImageWrapper}>
					<img
						src={testimonials[activeDisplayIndex].imageUrl}
						alt={testimonials[activeDisplayIndex].author}
						className={styles.sliderAuthorImage}
					/>
					<QuoteIcon />
				</div>
				<div className={styles.sliderAuthorInfo}>
					<p className={styles.sliderAuthorName}>
						{testimonials[activeDisplayIndex].author}
					</p>
					<p className={styles.sliderAuthorRole}>
						{testimonials[activeDisplayIndex].role}
					</p>
				</div>
			</div>

			<div className={styles.sliderDots}>
				{testimonials.map((_, index) => (
					<button
						key={index}
						onClick={() => handleDotClick(index)}
						className={`${styles.sliderDotsDot} ${
							index === activeDisplayIndex ? styles.sliderDotsDotActive : ''
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};
