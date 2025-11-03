import React from 'react';
import './ContactDetails.css';
import ContactInfoBlock from '../contactInfoBlock/ContactInfoBlock';
import { Button } from '../button/Button';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

export const ContactDetails: React.FC = () => {
	// We'll use the number from your TopBar
	const phoneNumber = '17737990006'; // Added '1' for international WhatsApp format
	const phoneDisplay = '773-799-0006';
	const whatsappLink = `https://wa.me/${phoneNumber}`;

	return (
		<div className='contact-details-wrapper'>
			<h2 className='contact-details-title'>Get in Touch</h2>
			<p className='contact-details-intro'>
				We're here to help transform your space. Contact us today for a free,
				no-obligation estimate. We respond to all inquiries within 24 business
				hours.
			</p>

			<div className='contact-details-blocks'>
				<ContactInfoBlock
					icon={Phone}
					bold='Call or Text: '
					title={phoneDisplay}
					subtitle='Mon-Fri, 8:00 AM - 6:00 PM'
				/>
				<ContactInfoBlock
					icon={Mail}
					bold='Email Us:'
					title='info@rayprofinish.com' // Placeholder email
					subtitle='Get a detailed estimate'
				/>
				<ContactInfoBlock
					icon={MapPin}
					bold='Service Area:'
					title='Chicagoland Suburbs'
					subtitle='Serving Wheaton, Lombard & more'
				/>
				<ContactInfoBlock
					icon={Clock}
					bold='Business Hours:'
					title='Mon - Fri: 8:00 AM - 6:00 PM'
					subtitle='Sat: 9:00 AM - 1:00 PM, Sun: Closed'
				/>
			</div>

			<Button
				href={whatsappLink}
				target='_blank'
				variant='dark'
				className='whatsapp-btn'
			>
				{/* You can add a WhatsApp icon here later if you import one */}
				Contact Us via WhatsApp
			</Button>
		</div>
	);
};
