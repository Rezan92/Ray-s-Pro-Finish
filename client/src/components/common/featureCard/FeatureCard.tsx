import styles from './FeatureCard.module.css';
import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  animationDelay: string;
};

export const FeatureCard = ({ icon: Icon, title, description, animationDelay }: FeatureCardProps) => {
  const cardClasses = `${styles.featureCard} ${styles.animateSlideUp}`;

  const cardStyle = {
    animationDelay: animationDelay,
  };

  return (
    <div className={cardClasses} style={cardStyle}>
      <div className={styles.iconWrapper}>
        <Icon size={28} className={styles.mainIcon} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};
