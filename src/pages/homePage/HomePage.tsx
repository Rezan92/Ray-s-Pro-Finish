import Hero from '@/components/common/hero/Hero';
import { FeatureSection } from '@/components/common/featureSection/FeatureSection';
import { AboutSection } from '@/components/common/aboutSection/AboutSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';

function HomePage() {
	return (
		<div>
			<Hero />
			<FeatureSection />
			<AboutSection />
			<RequestQuoteSection />
		</div>
	);
}

export default HomePage;
