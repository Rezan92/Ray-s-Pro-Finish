import styles from './FeatureCard.module.css';
import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  index: number;
  icon: LucideIcon;
  title: string;
  description: string;
  animationDelay: string;
};

export const FeatureCard = ({ index, icon: Icon, title, description, animationDelay }: FeatureCardProps) => {
  const cardClasses = `${styles.featureCard} ${styles.animateSlideUp}`;

  const cardStyle = {
    animationDelay: animationDelay,
  };

  const isEven = index % 2 === 0;

  // Use 6 distinct solid colors for consistency and variety
  const colorClasses = [
    'colorOrange',
    'colorGreen',
    'colorNavy',
    'colorYellow',
    'colorCrimson',
    'colorTeal'
  ];
  
  const colorKey = colorClasses[index % colorClasses.length];
  const colorClass = styles[colorKey];

  return (
    <div className={cardClasses} style={cardStyle}>
      {!isEven && (
        <div className={`${styles.contentBox} ${styles.contentTop}`}>
          <div className={styles.titleWrapper}>
            <span className={`${styles.numberBadge} ${colorClass}`}>{index + 1}</span>
            <h3 className={styles.cardTitle}>{title}</h3>
          </div>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      )}

      <div className={styles.iconCenterWrapper}>
        <div className={`${styles.iconSquare} ${colorClass}`}>
          <Icon size={32} className={styles.mainIcon} />
        </div>
      </div>

      {isEven && (
        <div className={`${styles.contentBox} ${styles.contentBottom}`}>
          <div className={styles.titleWrapper}>
            <span className={`${styles.numberBadge} ${colorClass}`}>{index + 1}</span>
            <h3 className={styles.cardTitle}>{title}</h3>
          </div>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      )}
    </div>
  );
};
