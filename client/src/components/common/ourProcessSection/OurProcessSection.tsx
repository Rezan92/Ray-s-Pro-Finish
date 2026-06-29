import React from 'react';
import { ClipboardList, ShieldCheck, PaintRoller, Sparkles } from 'lucide-react';
import styles from './OurProcessSection.module.css';
import { BrushButton } from '../brushButton/BrushButton';

// A sub-component for each step
const ProcessStep: React.FC<{
	icon: React.ElementType;
	numberString: string;
	title: string;
	description: string;
}> = ({ icon: Icon, numberString, title, description }) => {
	return (
		<div className={styles.processStep}>
			<div className={styles.processStepGraphic}>
				<span className={styles.hugeStepNumber}>{numberString}</span>
				<div className={styles.processStepIconWrapper}>
					<Icon size={40} />
				</div>
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
				<ProcessStep
					icon={ClipboardList}
					numberString='01'
					title='Consultation & Estimate'
					description="We come to your home for a comprehensive 15- to 30-minute consultation. We take precise measurements, discuss your color preferences, and confidently answer all your questions. You'll receive a detailed, transparent quote immediately after."
				/>
				<ProcessStep
					icon={ShieldCheck}
					numberString='02'
					title='Protection & Preparation'
					description="We meticulously prepare the area by moving, covering, and protecting all floors and furniture. We work respectfully around your day-to-day life to ensure a pristine environment before any paint is applied."
				/>
				<ProcessStep
					icon={PaintRoller}
					numberString='03'
					title='Professional Execution'
					description="Once perfectly prepped, our professional team begins the painting process. We use premium materials and flawless techniques to deliver sharp lines and a beautiful, lasting finish."
				/>
				<ProcessStep
					icon={Sparkles}
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
