import React, { useState, useEffect, useRef } from 'react';
import styles from './StatCard.module.css';
import { Icon } from 'lucide-react';

type StatCardProps = {
  icon: Icon;
  count: string; // Keep as string (e.g., "48,000")
  label: string;
  variant: 'primary' | 'light';
};

export const StatCard = ({
  icon: IconComponent,
  count,
  label,
  variant,
}: StatCardProps) => {
  // Parse the target number, removing commas
  const target = parseInt(count.replace(/,/g, ''), 10);
  
  // State for the number that gets displayed
  const [currentCount, setCurrentCount] = useState(0);
  
  // Ref for the IntersectionObserver
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the component is 50% in view...
        if (entry.isIntersecting) {
          // Start the animation
          let startTime: number | null = null;
          const duration = 2000; // 2-second animation

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Calculate the current value
            const newCount = Math.floor(progress * target);
            setCurrentCount(newCount);

            // If animation isn't finished, request another frame
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Ensure it ends on the exact target number
              setCurrentCount(target);
            }
          };

          requestAnimationFrame(animate);
          
          // Disconnect the observer after animating once
          observer.disconnect();
        }
      },
      {
        threshold: 0.5, // Start when 50% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup on unmount
    return () => observer.disconnect();
  }, [target]); // Rerun if the target number ever changes

  return (
    // Attach the ref to this element
    <div className={`${styles.statCard} ${styles[variant]}`} ref={ref}>
      <div className={styles.iconWrapper}>
        <IconComponent size={60} className={styles.icon} />
      </div>
      <div className={styles.content}>
        {/* Display the animated count, formatted with commas */}
        <span className={styles.count}>
          {currentCount.toLocaleString('en-US')}
        </span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
};

