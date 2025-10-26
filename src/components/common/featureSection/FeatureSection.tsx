import './FeatureSection.css';
import { HardHat, Shield, Users } from 'lucide-react'; // Icons from screenshot
import {FeatureCard} from '../featureCard/FeatureCard';

export const FeatureSection = () => {
  const cardData = [
    {
      icon: HardHat,
      title: 'Quality Construction',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regalia.',
      variant: 'dark',
      delay: '0ms'
    },
    {
      icon: Shield,
      title: 'Professional Liability',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regalia.',
      variant: 'primary',
      delay: '100ms'
    },
    {
      icon: Users,
      title: 'Dedicated To Our Clients',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regalia.',
      variant: 'dark',
      delay: '200ms'
    }
  ];

  return (
    <section className="feature-section">
      <div className="feature-grid">
        {cardData.map((card, index) => (
          <FeatureCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            variant={card.variant as 'dark' | 'primary'}
            animationDelay={card.delay}
          />
        ))}
      </div>
    </section>
  );
};

