import React from 'react';
import './ContactForm.css';
import { Button } from '../button/Button';

export const ContactForm: React.FC = () => {
	// In a real app, you would handle form state and submission here
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert('Form submitted! (This is a demo)');
	};

	return (
		<div className='contact-form-wrapper'>
			<h2 className='contact-form-title'>Send Us a Message</h2>
			<p className='contact-form-intro'>
				Prefer to write? Fill out the form below and we'll get back to you.
			</p>
			<form
				className='contact-form'
				onSubmit={handleSubmit}
			>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label htmlFor='name'>Full Name*</label>
						<input
							type='text'
							id='name'
							name='name'
							required
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='phone'>Phone</label>
						<input
							type='tel'
							id='phone'
							name='phone'
						/>
					</div>
				</div>
				<div className='form-group'>
					<label htmlFor='email'>Email*</label>
					<input
						type='email'
						id='email'
						name='email'
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='service'>What service do you need?*</label>
					<select
						id='service'
						name='service'
						required
					>
						<option value=''>-- Please select a service --</option>
						<option value='Interior Painting'>Interior Painting</option>
						<option value='Drywall Repair & Patching'>
							Drywall Repair & Patching
						</option>
						<option value='Drywall Installation'>Drywall Installation</option>
						<option value='Specialty (Cabinets, Trim, etc.)'>
							Specialty (Cabinets, Trim, etc.)
						</option>
						<option value='Other'>Other / Not Sure</option>
					</select>
				</div>
				<div className='form-group'>
					<label htmlFor='message'>Project Details*</label>
					<textarea
						id='message'
						name='message'
						rows={5}
						placeholder='Please describe your project (e.g., number of rooms, type of damage, etc.)'
						required
					></textarea>
				</div>
				<Button
					type='submit'
					variant='primary'
					className='contact-submit-btn'
				>
					Send Message
				</Button>
			</form>
		</div>
	);
};
