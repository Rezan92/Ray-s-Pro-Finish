import Hero from '@/components/common/hero/Hero';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { AboutSection } from '@/components/common/aboutSection/AboutSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';
import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { IndustrialServicesSection } from '@/components/common/industrialServicesSection/IndustrialServicesSection';
import {LatestProjectsSection} from '../../components/common/latestProjectsSection/LatestProjectsSection';
import {TestimonialSection} from '../../components/common/testimonialSection/TestimonialSection';

function HomePage() {
	return (
		<div>
			<Hero />
			<FeatureSection isFloating={true} />
			<AboutSection />
			<RequestQuoteSection />
			<ServicesSection />
			<IndustrialServicesSection />
      <LatestProjectsSection />
      <TestimonialSection />
		</div>
	);
}

export default HomePage;
