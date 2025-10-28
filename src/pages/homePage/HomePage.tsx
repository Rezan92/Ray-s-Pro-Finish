import Hero from '@/components/common/hero/Hero';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { AboutSection } from '@/components/common/aboutSection/AboutSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';
import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { IndustrialServicesSection } from '@/components/common/industrialServicesSection/IndustrialServicesSection';

function HomePage() {
	return (
		<div>
			<Hero />
			<FeatureSection />
			<AboutSection />
			<RequestQuoteSection />
			<ServicesSection />
			<IndustrialServicesSection />
		</div>
	);
}

export default HomePage;
