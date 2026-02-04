import styles from './RequestQuoteSection.module.css';
import { Button } from '@/components/common/button/Button';

export const RequestQuoteSection = () => {
	return (
		<section className={styles.requestQuoteSection}>
			<div className={styles.requestQuoteContent}>
				<h2 className={styles.requestQuoteTitle}>Ready to Transform Your Space?</h2>
				<p className={styles.requestQuoteDescription}>
					Let's talk about your project. Whether it's a single wall patch or a
					full interior paint job, we provide fast, free, and no-obligation
					estimates.
				</p>
				<Button
					variant='primary'
					to='/contact'
				>
					GET A FREE ESTIMATE
				</Button>
			</div>
		</section>
	);
};