import Hero from '@/components/common/hero/Hero';
import TrustStrip from '@/components/common/trustStrip/TrustStrip';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { FaqSection } from '@/components/common/faqSection/FaqSection';

import { ServicesSection } from '@/components/common/servicesSection/ServicesSection';
import { TrustMetricsRow } from '@/components/common/trustMetricsRow/TrustMetricsRow';
import {LatestProjectsSection} from '../../components/common/latestProjectsSection/LatestProjectsSection';
import {TestimonialSection} from '../../components/common/testimonialSection/TestimonialSection';

function HomePage() {
	return (
		<div>
			<Hero />
			<TrustStrip />

			<FeatureSection />

			<ServicesSection />
			<TrustMetricsRow />
      <LatestProjectsSection />
      <FaqSection />
      <TestimonialSection />
		</div>
	);
}

export default HomePage;
