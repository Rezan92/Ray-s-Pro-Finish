import React, { useState } from 'react';
import styles from './WriteReviewModal.module.css';
import { X, Star } from 'lucide-react';
import type { Testimonial } from '../testimonialSlider/TestimonialSlider';

type WriteReviewModalProps = {
	onClose: () => void;
	onSubmit: (review: Testimonial) => void;
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
	onClose,
	onSubmit,
}) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [address, setAddress] = useState('');
	const [service, setService] = useState('Interior Painting');
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(0);
	const [quote, setQuote] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newReview: Testimonial = {
			id: Date.now(), // Unique ID
			author: `${firstName} ${lastName.charAt(0)}.`,
			role: service,
			imageUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
			rating,
			quote,
			timeAgo: 'Just now',
		};
		onSubmit(newReview);
	};

	return (
		<>
			<div className={styles.modalOverlay} onClick={onClose}></div>
			<div className={styles.modalContent}>
				<button className={styles.modalCloseBtn} onClick={onClose}>
					<X size={24} />
				</button>
				
				<h2 className={styles.modalTitle}>Write a Review</h2>
				<p className={styles.modalSubtitle}>Share your experience with Ray's Pro Finish</p>

				<form onSubmit={handleSubmit} className={styles.reviewForm}>
					<div className={styles.formRow}>
						<div className={styles.formGroup}>
							<label htmlFor="firstName">First Name</label>
							<input 
								type="text" 
								id="firstName" 
								value={firstName} 
								onChange={(e) => setFirstName(e.target.value)} 
								required 
								placeholder="John"
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="lastName">Last Name</label>
							<input 
								type="text" 
								id="lastName" 
								value={lastName} 
								onChange={(e) => setLastName(e.target.value)} 
								required 
								placeholder="Doe"
							/>
						</div>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="address">Street Address</label>
						<input 
							type="text" 
							id="address" 
							value={address} 
							onChange={(e) => setAddress(e.target.value)} 
							required 
							placeholder="123 Main St (For Verification Only)"
						/>
						<span className={styles.helpText}>We use this to verify you are a past customer. It will not be displayed publicly.</span>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="service">Job Type</label>
						<select 
							id="service" 
							value={service} 
							onChange={(e) => setService(e.target.value)}
							required
						>
							<option value="Interior Painting">Interior Painting</option>
							<option value="Exterior Painting">Exterior Painting</option>
							<option value="Drywall Repair">Drywall Repair</option>
							<option value="Drywall Installation">Drywall Installation</option>
							<option value="Accent Walls">Accent Walls</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div className={styles.formGroup}>
						<label>Overall Rating</label>
						<div className={styles.starRatingContainer}>
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									type="button"
									key={star}
									className={`${styles.starBtn} ${star <= (hoverRating || rating) ? styles.starActive : ''}`}
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
								>
									<Star size={32} fill={star <= (hoverRating || rating) ? "currentColor" : "none"} />
								</button>
							))}
						</div>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="quote">Your Review</label>
						<textarea 
							id="quote" 
							value={quote} 
							onChange={(e) => setQuote(e.target.value)} 
							required 
							placeholder="Tell others about your experience..."
							rows={4}
						></textarea>
					</div>

					<button type="submit" className={styles.submitBtn}>
						Submit Review
					</button>
				</form>
			</div>
		</>
	);
};
