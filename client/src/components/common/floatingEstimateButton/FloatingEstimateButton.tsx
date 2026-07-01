import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import styles from './FloatingEstimateButton.module.css';

export const FloatingEstimateButton: React.FC = () => {
	return (
		<Link to="/contact" className={styles.floatingButton}>
			<ClipboardList size={18} className={styles.icon} />
			<span>Get an Estimate</span>
		</Link>
	);
};
