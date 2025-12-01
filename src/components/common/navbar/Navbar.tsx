import { NavLink } from 'react-router-dom';
import { Button } from '../button/Button';
import { Menu } from 'lucide-react';
import './Navbar.css';

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMobileMenu, closeMobileMenu } from '@/store/slices/uiSlice';

const navLinks = [
	{ label: 'Home', to: '/' },
	{ label: 'About', to: '/about' },
	{ label: 'Services', to: '/services' },
	{ label: 'Projects', to: '/projects' },
	{ label: 'Blog', to: '/blog' },
	{ label: 'Contact', to: '/contact' },
];

const Navbar = () => {
	// Use Redux instead of local state
	const dispatch = useAppDispatch();
	const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);

	const handleToggle = () => dispatch(toggleMobileMenu());
	const handleClose = () => dispatch(closeMobileMenu());

	return (
		<nav className='navbar'>
			<div className='container'>
				{/* --- Desktop Navigation --- */}
				<div className='nav-desktop'>
					<ul className='nav-links-list'>
						{navLinks.map((link) => (
							<li key={link.label}>
								<NavLink
									to={link.to}
									// This 'className' prop from NavLink gives us the active state
									className={({ isActive }) =>
										isActive ? 'nav-link active' : 'nav-link'
									}
								>
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>
					<Button
						to='/contact'
						variant='dark'
					>
						Inquire Now
					</Button>
				</div>

				{/* --- Mobile Navigation --- */}
				<div className='nav-mobile'>
					{/* Hamburger Menu Button */}
					<button
						onClick={handleToggle}
						className='menu-toggle-btn'
					>
						{<Menu size={28} />}
					</button>
					<span className='nav-mobile-title'>Menu</span>
				</div>
			</div>

			{/* --- Mobile Menu Dropdown (Animated) --- */}
			{/* This is the sliding panel. We apply the 'open' class based on state
        to trigger the CSS animation.
      */}
			<div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
				<ul className='mobile-links-list'>
					{navLinks.map((link) => (
						<li key={link.label}>
							<NavLink
								to={link.to}
								className={({ isActive }) =>
									isActive ? 'mobile-link active' : 'mobile-link'
								}
								onClick={handleClose} // Close on click
							>
								{link.label}
							</NavLink>
						</li>
					))}
				</ul>
				<Button
					to='/contact'
					variant='dark'
					className='mobile-menu-btn'
					// We can attach onClick to Button component if it supports it,
					// or wrap it to close menu when clicked.
					onClick={handleClose}
				>
					Inquire Now
				</Button>
			</div>
		</nav>
	);
};

export default Navbar;
