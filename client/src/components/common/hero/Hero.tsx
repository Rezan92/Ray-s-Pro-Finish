import styles from './Hero.module.css';
import { Button } from '../button/Button';
// Use the @ alias for a clean path to assets
import heroImage from '@/assets/hero/Hero.png';

const Hero = () => {
	// We apply the background image via inline style for dynamic import
	const heroStyle = {
		backgroundImage: `url(${heroImage})`,
	};

	return (
		<div className={styles.heroContainerWrapper}>
			<section
				className={styles.hero}
				style={heroStyle}
			>
				<div className={styles.heroOverlay}></div> {/* Dark overlay */}
				<div className={styles.heroContainer}>
					<div className={styles.heroContent}>
						<h1 className={styles.heroTitle}>
							EXPERT DRYWALL REPAIR
							<br />& INTERIOR PAINTING
						</h1>
						<p className={styles.heroSubtitle}>
							From seamless drywall patching and installation to a flawless,
							high-quality paint finish, we make your walls look perfect.
						</p>
						<div className={styles.heroActions}>
							<Button
								to='/services'
								variant='primary'
								className={styles.heroButton}
							>
								Our Services
							</Button>
							<Button
								to='/estimator'
								variant='light'
								className={styles.heroButton}
							>
								Get an Instant Estimate
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Hero;