import {ServiceCard} from '../serviceCard/ServiceCard';
import './ServicesSection.css';
import { DraftingCompass, Building, Hammer } from 'lucide-react';

// You can replace these with paths to your actual images
const serviceImage1 = 'https://placehold.co/400x300/666/fff?text=Service+1';
const serviceImage2 = 'https://placehold.co/400x300/666/fff?text=Service+2';
const serviceImage3 = 'https://placehold.co/400x300/666/fff?text=Service+3';

export const ServicesSection = () => {
  const cardDescription =
    'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia';

  return (
    <section className="services-section">
      <div className="services-section-header">
        <span className="services-section-subtitle">Our Services</span>
        <h2 className="services-section-title">We Offer Services</h2>
      </div>

      <div className="services-section-grid">
        <ServiceCard
          icon={DraftingCompass}
          imageSrc={serviceImage1}
          title="Architecture"
          description={cardDescription}
        />
        <ServiceCard
          icon={Building}
          imageSrc={serviceImage2}
          title="Renovation"
          description={cardDescription}
        />
        <ServiceCard
          icon={Hammer}
          imageSrc={serviceImage3}
          title="Construction"
          description={cardDescription}
        />
      </div>
    </section>
  );
};

