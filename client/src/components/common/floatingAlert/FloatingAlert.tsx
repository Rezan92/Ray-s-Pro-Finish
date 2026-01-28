import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import './FloatingAlert.css';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

interface FloatingAlertProps {
	isVisible: boolean;
	onClose: () => void;
	type?: AlertType;
	title?: string;
	message: string;
}

export const FloatingAlert: React.FC<FloatingAlertProps> = ({
	isVisible,
	onClose,
	type = 'info',
	title,
	message,
}) => {
	if (!isVisible) return null;

	// Icon mapping
	const getIcon = () => {
		switch (type) {
			case 'warning':
				return <AlertTriangle size={20} />;
			case 'error':
				return <AlertCircle size={20} />;
			case 'success':
				return <CheckCircle size={20} />;
			default:
				return <Info size={20} />;
		}
	};

	return (
		<div className={`floating-alert alert-${type}`}>
			<div className='alert-content'>
				<div className='alert-icon-wrapper'>{getIcon()}</div>
				<div className='alert-text-wrapper'>
					{title && <h4 className='alert-title'>{title}</h4>}
					<p className='alert-message'>{message}</p>
				</div>
			</div>
			<button
				className='alert-close-btn'
				onClick={onClose}
				aria-label='Close'
			>
				<X size={18} />
			</button>
		</div>
	);
};
