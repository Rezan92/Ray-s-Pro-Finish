import './AboutPage.css'; // <-- 1. Import the new CSS file
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { AboutSection } from '@/components/common/aboutSection/AboutSection';
import { IndustrialServicesSection } from '@/components/common/industrialServicesSection/IndustrialServicesSection';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { TestimonialSection } from '@/components/common/testimonialSection/TestimonialSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';

function AboutPage() {
	return (
		<div className='about-page-wrapper'>
			{/* 1. Page Title */}
			<PageHeader title='About Us' />

			{/* 2. Our Story (Re-using the component from the Homepage) */}
			<AboutSection />

			{/* 3. Our Commitment (The "Difference is in the details" section) */}
			<IndustrialServicesSection />

			{/* 4. Our Values (The 3 feature cards) */}
			<FeatureSection />

			{/* 5. Social Proof (Show what customers say) */}
			<TestimonialSection />

			{/* 6. Call to Action (End every page with a CTA) */}
			<RequestQuoteSection />
		</div>
	);
}

export default AboutPage;
