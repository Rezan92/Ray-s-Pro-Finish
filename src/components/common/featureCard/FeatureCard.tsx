import './FeatureCard.css';
import { Icon } from 'lucide-react'; // Import the Icon type

type FeatureCardProps = {
  icon: typeof Icon; // Use the Icon type
  title: string;
  description: string;
  variant: 'dark' | 'primary';
  animationDelay: string; // e.g., "0ms", "100ms"
};

export const FeatureCard = ({ icon: Icon , title, description, variant, animationDelay }: FeatureCardProps) => {
  
  // Combine classes: base 'feature-card', the variant ('dark' or 'primary'),
  // and 'animate-slide-up' for the animation.
  const cardClasses = `feature-card ${variant} animate-slide-up`;

  // Apply the animation delay as an inline style
  const cardStyle = {
    animationDelay: animationDelay
  };

  return (
    <div className={cardClasses} style={cardStyle}>
      <div className="icon-wrapper">
        <Icon size={60} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      {/* This is the diagonal sheen effect */}
      <div className="card-sheen"></div>
    </div>
  );
};

