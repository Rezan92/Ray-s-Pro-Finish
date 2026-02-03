import styles from './FeatureCard.module.css';
import type { LucideIcon } from 'lucide-react'; // Import the Icon type

type FeatureCardProps = {
  icon: LucideIcon; // Use the Icon type
  title: string;
  description: string;
  variant: 'dark' | 'primary';
  animationDelay: string; // e.g., "0ms", "100ms"
};

export const FeatureCard = ({ icon: Icon , title, description, variant, animationDelay }: FeatureCardProps) => {
  
  // Combine classes: base 'feature-card', the variant ('dark' or 'primary'),
  // and 'animate-slide-up' for the animation.
  const cardClasses = `${styles.featureCard} ${styles[variant]} ${styles.animateSlideUp}`;

  // Apply the animation delay as an inline style
  const cardStyle = {
    animationDelay: animationDelay
  };

  return (
    <div className={cardClasses} style={cardStyle}>
      <div className={styles.iconWrapper}>
        <Icon size={60} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      {/* This is the diagonal sheen effect */}
      <div className={styles.cardSheen}></div>
    </div>
  );
};

