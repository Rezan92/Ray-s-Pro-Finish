import Hero from '@/components/common/hero/Hero'
import {FeatureSection} from '@/components/common/featureSection/FeatureSection'
import {AboutSection} from '@/components/common/aboutSection/AboutSection'


function HomePage() {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <AboutSection />
    </div>
  )
}

export default HomePage