import React from 'react';
import styles from './TrustMetricsRow.module.css';

export const TrustMetricsRow = () => {
	return (
		<section className={styles.trustMetricsSection}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>THE WAY WE DO BUSINESS</h2>
				<span className={styles.sectionSubtitle}>
					We believe hiring a contractor should be completely stress-free. Here is what you can expect.*
				</span>
			</div>
			<div className={styles.metricsContainer}>
				<div className={styles.metricCard}>
					<div className={styles.metricNumber}>#1</div>
					<h3 className={styles.metricTitle}>Year warranty</h3>
					<p className={styles.metricDescription}>
						We stand behind our work. If our paint peels or a patch cracks within the first year, we’ll come back and fix it for free.
					</p>
				</div>
				
				<div className={styles.metricCard}>
					<div className={styles.metricNumber}>100%</div>
					<h3 className={styles.metricTitle}>Fixed pricing</h3>
					<p className={styles.metricDescription}>
						The final number on your written estimate is the exact price you pay on your bill.
					</p>
				</div>
				
				<div className={styles.metricCard}>
					<div className={styles.metricNumber}>0</div>
					<h3 className={styles.metricTitle}>Surprise charges</h3>
					<p className={styles.metricDescription}>
						We do not hit you with hidden fees, sudden material markups, or unexpected costs at the end of the job.
					</p>
				</div>
			</div>
		</section>
	);
};
