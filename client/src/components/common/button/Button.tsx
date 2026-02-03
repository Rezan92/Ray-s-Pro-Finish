import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

// We can define the different styles our button can have
type ButtonVariant = 'primary' | 'dark' | 'outline' | 'light';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	to?: string; // For internal React Router links
	href?: string; // For external links (like WhatsApp)
	variant?: ButtonVariant;
	className?: string; // Allow passing extra classes
	target?: string; // For opening in a new tab (e.g., _blank)
	type?: 'submit' | 'button' | 'reset'; // <--- Ensure this is defined
	disabled?: boolean;
	style?: React.CSSProperties;
	size?: string; // Accepted to satisfy interface but visually handled by classes if needed
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	to,
	href,
	variant = 'primary', // Default to 'primary' (orange)
	className = '',
	target,
	type = 'button', // <--- Default to 'button' to prevent accidental form submissions
	disabled,
	style,
}) => {
	// Combine the base class, the variant class, and any extra classes
	const classes = `${styles.btn} ${styles[variant]} ${className}`;

	// If 'href' is provided, render a standard <a> tag
	// This is perfect for external links.
	if (href) {
		return (
			<a
				href={href}
				className={classes}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : undefined}
				style={style}
			>
				{children}
			</a>
		);
	}

	// If 'to' is provided, render a React Router <Link>
	if (to) {
		return (
			<Link
				to={to}
				className={classes}
				style={style}
			>
				{children}
			</Link>
		);
	}

	// Otherwise, render a standard <button>
	return (
		<button
			type={type} // <--- CRITICAL FIX: Pass the type prop to the DOM element
			onClick={onClick}
			className={classes}
			disabled={disabled}
			style={style}
		>
			{children}
		</button>
	);
};
