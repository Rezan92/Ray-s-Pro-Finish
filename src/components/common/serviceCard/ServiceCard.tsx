import React from 'react';
import './ServiceCard.css';
// Reverting to alias path for Button, as this is likely the correct setup
import { Button } from '@/components/common/button/Button';
import { Icon } from 'lucide-react';

type ServiceCardProps = {
  icon: Icon;
  imageSrc: string;
  title: string;
  description: string;
};

export const ServiceCard = ({
  icon: IconComponent,
  imageSrc,
  title,
  description,
}: ServiceCardProps) => {
  return (
    <div className="service-card">
      <div className="service-card-image-wrapper">
        <img
          src={imageSrc}
          alt={title}
          className="service-card-image"
          onError={(e) => {
            // Fallback placeholder
            (e.currentTarget.src =
              'https://placehold.co/400x300/e0e0e0/777?text=Image');
          }}
        />
        <div className="service-card-icon-wrapper">
          <IconComponent size={50} className="service-card-icon" />
        </div>
      </div>
      <div className="service-card-content">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-description">{description}</p>
        <Button variant="dark" className="service-card-button">
          READ MORE
        </Button>
      </div>
    </div>
  );
};

