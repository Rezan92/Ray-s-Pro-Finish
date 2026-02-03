import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import styles from './FloatingAlert.module.css';

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
		<div className={`${styles.floatingAlert} ${styles[type]}`}>
			<div className={styles.alertContent}>
				<div className={styles.iconWrapper}>{getIcon()}</div>
				<div className={styles.textWrapper}>
					{title && <h4 className={styles.alertTitle}>{title}</h4>}
					<p className={styles.alertMessage}>{message}</p>
				</div>
			</div>
			<button
				className={styles.closeBtn}
				onClick={onClose}
				aria-label='Close'
			>
				<X size={18} />
			</button>
		</div>
	);
};
