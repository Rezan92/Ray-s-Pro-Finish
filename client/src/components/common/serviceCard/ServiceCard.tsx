import styles from './ServiceCard.module.css';
import { Eye, type LucideIcon } from 'lucide-react';

type ServiceCardProps = {
	icon: LucideIcon;
	iconColor: string;
	title: string;
	description: string;
	align: 'left' | 'right';
	isConsultation?: boolean;
	onClick: () => void;
};

export const ServiceCard = ({
	icon: IconComponent,
	iconColor,
	title,
	description,
	align,
	isConsultation,
	onClick,
}: ServiceCardProps) => {
	const isLeft = align === 'left';

	return (
		<div
			className={`${styles.serviceCard} ${isLeft ? styles.alignLeft : styles.alignRight}`}
			onClick={onClick}
		>
			<div 
				className={styles.iconContainer}
				style={{ backgroundColor: iconColor }}
			>
				<IconComponent size={40} color="#ffffff" className={styles.icon} />
			</div>

			<div className={styles.content}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.description}>
					{description}
				</p>
				<div className={styles.readMore}>
					{isConsultation ? (
						<span className={styles.actionText}>Schedule a Walkthrough &rarr;</span>
					) : (
						<>
							<Eye size={18} className={styles.eyeIcon} />
							<span className={styles.readMoreText}>Click for details</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
