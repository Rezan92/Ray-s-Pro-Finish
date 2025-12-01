import React from 'react';
import './Button.css';
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
	type?: 'submit' | 'button' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	to,
	href,
	variant = 'primary', // Default to 'primary' (orange)
	className = '',
	target,
}) => {
	// Combine the base class, the variant class, and any extra classes
	const classes = `btn ${variant} ${className}`;

	// If 'href' is provided, render a standard <a> tag
	// This is perfect for external links.
	if (href) {
		return (
			<a
				href={href}
				className={classes}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : undefined}
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
			>
				{children}
			</Link>
		);
	}

	// Otherwise, render a standard <button>
	return (
		<button
			onClick={onClick}
			className={classes}
		>
			{children}
		</button>
	);
};
