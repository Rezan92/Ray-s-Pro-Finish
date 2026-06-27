import styles from './Hero.module.css';
import { BrushButton } from '../brushButton/BrushButton';
// Use the @ alias for a clean path to assets
import heroImage from '@/assets/hero/Hero.png';
import Navbar from '../navbar/Navbar';

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
				<Navbar />
				<div className={styles.heroMain}>
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
								respect your home and deliver perfect results. No dust, no
								delays.
							</p>
							<div className={styles.heroActions}>
								<BrushButton
									to='/contact'
									className={styles.heroButton}
									size="medium"
								>
									Get Your Dust-Free Estimate
								</BrushButton>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Hero;
