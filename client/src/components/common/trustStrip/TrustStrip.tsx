import { Sparkles, BadgeCheck, Paintbrush, Palette, Droplet } from 'lucide-react';
import styles from './TrustStrip.module.css';

const TrustStrip = () => {
	return (
		<div className={styles.trustStripWrapper}>
			<div className={styles.trustStripContainer}>
				{/* Guarantee: No Mess */}
				<div className={styles.trustItem}>
					<Sparkles className={styles.iconPrimary} size={28} />
					<div className={styles.itemText}>
						<span className={styles.title}>NO MESS</span>
						<span className={styles.subtitle}>GUARANTEE</span>
					</div>
				</div>

				{/* Guarantee: Owner Operated */}
				<div className={styles.trustItem}>
					<BadgeCheck className={styles.iconPrimary} size={28} />
					<div className={styles.itemText}>
						<span className={styles.title}>OWNER</span>
						<span className={styles.subtitle}>OPERATED</span>
					</div>
				</div>

				{/* Divider */}
				<div className={styles.divider}></div>

				{/* Brand: Benjamin Moore */}
				<div className={styles.trustItem}>
					<Paintbrush className={styles.iconBrand} size={26} />
					<div className={styles.itemText}>
						<span className={styles.brandTitle}>BENJAMIN</span>
						<span className={styles.brandSubtitle}>MOORE</span>
					</div>
				</div>

				{/* Brand: Sherwin-Williams */}
				<div className={styles.trustItem}>
					<Palette className={styles.iconBrand} size={26} />
					<div className={styles.itemText}>
						<span className={styles.brandTitle}>SHERWIN</span>
						<span className={styles.brandSubtitle}>WILLIAMS</span>
					</div>
				</div>

				{/* Brand: Behr */}
				<div className={styles.trustItem}>
					<Droplet className={styles.iconBrand} size={26} />
					<div className={styles.itemText}>
						<span className={styles.brandTitle}>BEHR</span>
						<span className={styles.brandSubtitle}>PAINT</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrustStrip;
