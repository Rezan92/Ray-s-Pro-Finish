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
							FLAWLESS HOME TRANSFORMATIONS.
							<br />
							ON TIME, ZERO MESS.
						</h1>
						<p className={styles.heroSubtitle}>
							From seamless drywall patching to a premium paint finish, we
							respect your home and deliver perfect results. No dust, no delays.
						</p>
						<div className={styles.heroActions}>
							<Button
								to='/contact'
								variant='primary'
								className={styles.heroButton}
							>
								Get Your Dust-Free Estimate
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Hero;