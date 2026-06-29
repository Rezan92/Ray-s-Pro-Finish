import styles from './ServicesPage.module.css';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { OurProcessSection } from '@/components/common/ourProcessSection/OurProcessSection';

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
		</div>
	);
};

export default ServicesPage;