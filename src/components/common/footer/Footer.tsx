import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	MapPin,
	Phone,
	Mail,
	ChevronRight,
	Twitter,
	Facebook,
	Instagram,
} from 'lucide-react';
import './Footer.css';

// A small sub-component for consistent link styling
const FooterLink: React.FC<{ to: string; label: string }> = ({ to, label }) => (
	<NavLink
		to={to}
		className='footer-link-item'
	>
		<ChevronRight
			size={16}
			className='footer-link-icon'
		/>
		<span>{label}</span>
	</NavLink>
);

// A small sub-component for consistent contact info styling
const ContactItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
	icon,
	text,
}) => (
	<div className='footer-contact-item'>
		<div className='footer-contact-icon'>{icon}</div>
		<span>{text}</span>
	</div>
);

export const Footer: React.FC = () => {
	return (
		<footer className='footer-section'>
			<div className='footer-grid'>
				{/* Column 1: About */}
				<div className='footer-column'>
					<h3 className='footer-column-title'>ABOUT</h3>
					<p className='footer-about-text'>
						Ray's Pro Finish specializes in expert drywall repair and
						high-quality interior painting. We're committed to delivering a
						flawless finish and professional service to every homeowner.
					</p>
					<div className='footer-social-icons'>
						<a
							href='https://twitter.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Twitter'
						>
							<Twitter size={20} />
						</a>
						<a
							href='https://facebook.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Facebook'
						>
							<Facebook size={20} />
						</a>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Instagram'
						>
							<Instagram size={20} />
						</a>
					</div>
				</div>

				{/* Column 2: Links */}
				<div className='footer-column'>
					<h3 className='footer-column-title'>LINKS</h3>
					<nav className='footer-links-list'>
						<FooterLink
							to='/projects'
							label='Projects'
						/>
						<FooterLink
							to='/about'
							label='About Us'
						/>
						<FooterLink
							to='/services'
							label='Services'
						/>
						<FooterLink
							to='/blog'
							label='Blog Posts'
						/>
						<FooterLink
							to='/contact'
							label='Contact'
						/>
					</nav>
				</div>

				{/* Column 3: Services */}
				<div className='footer-column'>
					<h3 className='footer-column-title'>SERVICES</h3>
					<div className='footer-links-list'>
						{/* You can update these links as needed */}
						<FooterLink
							to='/services'
							label='Interior Painting'
						/>
						<FooterLink
							to='/services'
							label='Drywall Repair & Patching'
						/>
						<FooterLink
							to='/services'
							label='Drywall Installation'
						/>
					</div>
				</div>

				{/* Column 4: Have a Questions? */}
				<div className='footer-column'>
					<h3 className='footer-column-title'>HAVE A QUESTIONS?</h3>
					<div className='footer-contact-list'>
						<ContactItem
							icon={<MapPin size={20} />}
							text='Service Area: Wheaton, Lombard & Chicagoland Suburbs'
						/>
						<ContactItem
							icon={<Phone size={20} />}
							text='(773) 799-0006 (Call or Text)'
						/>
						<ContactItem
							icon={<Mail size={20} />}
							text='info@yourdomain.com'
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};
