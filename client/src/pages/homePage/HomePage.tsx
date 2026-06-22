import Hero from '@/components/common/hero/Hero';
import TrustStrip from '@/components/common/trustStrip/TrustStrip';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';

import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';
import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { IndustrialServicesSection } from '@/components/common/industrialServicesSection/IndustrialServicesSection';
import {LatestProjectsSection} from '../../components/common/latestProjectsSection/LatestProjectsSection';
import {TestimonialSection} from '../../components/common/testimonialSection/TestimonialSection';

function HomePage() {
	return (
		<div>
			<Hero />
			<TrustStrip />

			<FeatureSection />
			<RequestQuoteSection />
			<ServicesSection />
			<IndustrialServicesSection />
      <LatestProjectsSection />
      <TestimonialSection />
		</div>
	);
}

export default HomePage;
