import styles from './ServiceCard.module.css';
import {type LucideIcon } from 'lucide-react';
import { Button } from '../button/Button';

type ServiceCardProps = {
	icon: LucideIcon;
	imageSrc: string;
	title: string;
	description: string;
	onClick: () => void; // ADDED: onClick prop to open the modal
};

export const ServiceCard = ({
	icon: IconComponent,
	imageSrc,
	title,
	description,
	onClick,
}: ServiceCardProps) => {
	return (
		<div className={styles.serviceCard}>
			<div className={styles.imageWrapper}>
				<img
					src={imageSrc}
					alt={title}
					className={styles.image}
					onError={(e) => {
						// Fallback placeholder
						e.currentTarget.src =
							'https://placehold.co/400x300/e0e0e0/777?text=Image';
					}}
				/>
				<div className={styles.iconWrapper}>
					<IconComponent
						size={50}
						className={styles.icon}
					/>
				</div>
			</div>
			<div className={styles.content}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.description}>{description}</p>

				<Button
					onClick={onClick}
					variant='dark'
					className={styles.button}
				>
					READ MORE
				</Button>
			</div>
		</div>
	);
};
