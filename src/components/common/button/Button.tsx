import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

// We can define the different styles our button can have
type ButtonVariant = 'primary' | 'dark' | 'outline' | 'light';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string; // If this is a link, 'to' will be its destination
  variant?: ButtonVariant;
  className?: string; // Allow passing extra classes
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  to,
  variant = 'primary', // Default to 'primary' (orange)
  className = '',
}) => {
  // Combine the base class, the variant class, and any extra classes
  const classes = `btn ${variant} ${className}`;

  // If a 'to' prop is provided, render a React Router <Link>
  // This is great for navigation
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  // Otherwise, render a standard <button>
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};
