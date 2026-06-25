import styles from './AboutPage.module.css';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { AboutSection } from '@/components/common/aboutSection/AboutSection';
import { TrustMetricsRow } from '@/components/common/trustMetricsRow/TrustMetricsRow';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { TestimonialSection } from '@/components/common/testimonialSection/TestimonialSection';

function AboutPage() {
	return (
		<div className={styles.aboutPageWrapper}>
			{/* 1. Page Title */}
			<PageHeader title='About Us' />

			{/* 2. Our Story (Re-using the component from the Homepage) */}
			<AboutSection />

			{/* 3. Our Commitment (The "Difference is in the details" section) */}
			<TrustMetricsRow />

			{/* 4. Our Values (The 3 feature cards) */}
			<FeatureSection />

			{/* 5. Social Proof (Show what customers say) */}
			<TestimonialSection />


		</div>
	);
}

export default AboutPage;