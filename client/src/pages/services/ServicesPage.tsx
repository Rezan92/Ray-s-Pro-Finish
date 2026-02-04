import styles from './ServicesPage.module.css';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { OurProcessSection } from '@/components/common/ourProcessSection/OurProcessSection';
import { SpecialtyServicesSection } from '@/components/common/specialtyServicesSection/SpecialtyServicesSection';
import { TestimonialSection } from '@/components/common/testimonialSection/TestimonialSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';

const ServicesPage = () => {
	return (
		<div className={styles.servicesPageWrapper}>
			{' '}
			{/* <-- Add the wrapper class */}
			{/* 1. Page Title */}
			<PageHeader title='Our Services' />
			{/* 2. Our Core Services (The 3 main cards) */}
			<ServicesSection />
			{/* 3. Our Professional Process (Builds trust) */}
			<OurProcessSection />
			{/* 4. Our Specialty Services (Shows expertise) */}
			<SpecialtyServicesSection />
			{/* 5. Social Proof (Backs up claims) */}
			<TestimonialSection />
			{/* 6. Call to Action (Gets the lead) */}
			<RequestQuoteSection />
		</div>
	);
};

export default ServicesPage;