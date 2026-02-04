import styles from './AboutSection.module.css';
import { Paintbrush, Check } from 'lucide-react';
import aboutImage from '@/assets/aboutSection/aboutSection.png';

export const AboutSection = () => {
	return (
		<section className={styles.aboutSection}>
			<div className='container'>
				{/* Image Column */}
				<div className={styles.imageColumn}>
					<img
						src={aboutImage}
						alt='Construction worker'
						className={styles.aboutImage}
					/>
					{/* Orange floating icon box */}
					<div className={styles.floatingIconBox}>
						<Paintbrush
							size={40}
							color='var(--color-brand-dark)'
						/>
					</div>
				</div>

				{/* Text Column */}
				<div className={styles.textColumn}>
					<span className={styles.aboutSectionSubtitle}>
						WELCOME TO RAY'S PRO FINISH
					</span>
					<h2 className={styles.title}>
						Where Quality Craftsmanship Meets a Flawless Finish
					</h2>

					<div className={styles.introText}>
						<Check
							size={24}
							className={styles.introIcon}
						/>
						<p>
							With years of hands-on experience, we provide the best in painting
							and drywall services.
						</p>
					</div>

					<p className={styles.description}>
						We believe that a beautiful paint job begins with a perfect surface.
						That's why we specialize in expert drywall repair, from patching
						small holes to installing new walls. We are meticulous about our
						prep work, ensuring every surface is smooth and ready for a
						stunning, high-quality coat of paint.
					</p>

				</div>
			</div>
		</section>
	);
};
