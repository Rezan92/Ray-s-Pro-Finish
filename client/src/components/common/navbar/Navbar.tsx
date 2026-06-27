import { NavLink } from 'react-router-dom';
import { BrushButton } from '../brushButton/BrushButton';
import { Menu } from 'lucide-react';
import styles from './Navbar.module.css';

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
		<nav className={styles.navbar}>
			<div className={styles.container}>
				{/* --- Desktop Navigation --- */}
				<div className={styles.navDesktop}>
					<ul className={styles.navLinksList}>
						{navLinks.map((link) => (
							<li key={link.label}>
								<NavLink
									to={link.to}
									// This 'className' prop from NavLink gives us the active state
									className={({ isActive }) =>
										isActive
											? `${styles.navLink} ${styles.active}`
											: styles.navLink
									}
								>
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>
					<BrushButton
					        to='/contact'
					        className={styles.navEstimateBtn}
							size="small"
					>
					        Free Estimate
					</BrushButton>
					</div>

				{/* --- Mobile Navigation --- */}
				<div className={styles.navMobile}>
					{/* Hamburger Menu Button */}
					<button
						onClick={handleToggle}
						className={styles.menuToggleBtn}
					>
						{<Menu size={28} />}
					</button>
					<span className={styles.navMobileTitle}>Menu</span>
				</div>
			</div>

			{/* --- Mobile Menu Dropdown (Animated) --- */}
			{/* This is the sliding panel. We apply the 'open' class based on state
        to trigger the CSS animation.
      */}
			<div
				className={`${styles.mobileMenu} ${
					isMobileMenuOpen ? styles.open : ''
				}`}
			>
				<ul className={styles.mobileLinksList}>
					{navLinks.map((link) => (
						<li key={link.label}>
							<NavLink
								to={link.to}
								className={({ isActive }) =>
									isActive
										? `${styles.mobileLink} ${styles.active}`
										: styles.mobileLink
								}
								onClick={handleClose} // Close on click
							>
								{link.label}
							</NavLink>
						</li>
					))}
				</ul>
				<BrushButton
				        to='/contact'
				        className={`${styles.mobileMenuBtn} ${styles.navEstimateBtn}`}
				        onClick={handleClose}
						size="medium"
				>
				        Free Estimate
				</BrushButton>
			</div>
		</nav>
	);
};

export default Navbar;
