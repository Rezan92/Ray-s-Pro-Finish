import React from 'react';
import styles from './OurProcessSection.module.css';
import { BrushButton } from '../brushButton/BrushButton';

// A sub-component for each step
const ProcessStep: React.FC<{
	numberString: string;
	title: string;
	description: string;
}> = ({ numberString, title, description }) => {
	return (
		<div className={styles.processStep}>
			<div className={styles.processStepGraphic}>
                <span className={styles.stepLabel}>Step</span>
				<span className={styles.hugeStepNumber}>{numberString}</span>
			</div>
			<div className={styles.processStepContent}>
				<h3 className={styles.processStepTitle}>{title}</h3>
				<p className={styles.processStepDescription}>{description}</p>
			</div>
		</div>
	);
};

export const OurProcessSection: React.FC = () => {
	return (
		<section className={styles.ourProcessSection}>
			<div className={styles.ourProcessHeader}>
				<span className={styles.ourProcessSubtitle}>HOW IT WORKS</span>
				<h2 className={styles.ourProcessTitle}>
                    Our Professional <span className={styles.highlight}>Process</span>
                </h2>
			</div>
            
            <div className={styles.timelineContainer}>
                {/* Desktop Road SVG */}
                <svg className={styles.desktopRoadSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="roadGradientDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 25 12.5 C 100 12.5, 100 37.5, 75 37.5 C 0 37.5, 0 62.5, 25 62.5 C 100 62.5, 100 87.5, 75 87.5 Q 50 87.5 25 87.5"
                        fill="none"
                        stroke="url(#roadGradientDesktop)"
                        strokeWidth="4"
                        strokeDasharray="12 12"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Mobile Road SVG */}
                <svg className={styles.mobileRoadSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="roadGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 50 10 Q 80 25, 50 40 T 50 70 T 50 95"
                        fill="none"
                        stroke="url(#roadGradientMobile)"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

				<ProcessStep
					numberString='01'
					title='Consultation & Estimate'
					description="We come to your home for a comprehensive 15- to 30-minute consultation. We take precise measurements, discuss your color preferences, and confidently answer all your questions. You'll receive a detailed, transparent quote immediately after."
				/>
				<ProcessStep
					numberString='02'
					title='Protection & Preparation'
					description="We meticulously prepare the area by moving, covering, and protecting all floors and furniture. We work respectfully around your day-to-day life to ensure a pristine environment before any paint is applied."
				/>
				<ProcessStep
					numberString='03'
					title='Professional Execution'
					description="Once perfectly prepped, our professional team begins the painting process. We use premium materials and flawless techniques to deliver sharp lines and a beautiful, lasting finish."
				/>
				<ProcessStep
					numberString='04'
					title='Cleanup & Walkthrough'
					description="We leave your home completely spotless. We will walk you through the finished work with complete transparency. If there are any final touch-ups or adjustments you desire, we handle them immediately to guarantee your 100% satisfaction."
				/>
			</div>

            <div className={styles.ctaContainer}>
                <BrushButton to="/contact">
                    Get a Free Estimate
                </BrushButton>
            </div>
		</section>
	);
};
