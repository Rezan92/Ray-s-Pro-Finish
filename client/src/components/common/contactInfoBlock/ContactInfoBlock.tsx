import styles from './ContactInfoBlock.module.css';

interface ContactInfoBlockProps {
	// We pass the icon component itself as a prop
	icon: React.ElementType;
	bold?: string;
	title: string;
	subtitle: string;
}

function ContactInfoBlock({
	icon: Icon,
	bold,
	title,
	subtitle,
}: ContactInfoBlockProps) {
	return (
		<div className={styles.contactBlock}>
			<div className={styles.contactInfoIconWrapper}>
				<Icon size={30} />
			</div>
			<div className={styles.textWrapper}>
				<span className={styles.title}>
					<span className={styles.bold}>{bold}</span>
					{title}
				</span>
				<span className={styles.subtitle}>{subtitle}</span>
			</div>
		</div>
	);
}

export default ContactInfoBlock;