import { ServiceCard } from '../serviceCard/ServiceCard';
import styles from './ServicesSection.module.css';
import { PaintRoller, Hammer, Palette, CalendarCheck } from 'lucide-react';
import type { Service } from '../serviceModal/ServiceModal';

import interiorPaintingImg from '@/assets/serviceSection/interior_painting.png';
import drywallPatchingImg from '@/assets/serviceSection/drywall_patching.png';
import accentWallsImg from '@/assets/serviceSection/accent_walls.png';
import freeConsultationImg from '@/assets/serviceSection/free_consultation.png';

// Redux
import { useAppDispatch } from '@/store/hooks';
import { openServiceModal } from '@/store/slices/uiSlice';

const servicesData: Service[] = [
	{
		title: 'Interior Painting',
		image: interiorPaintingImg,
		icon: PaintRoller,
		iconColor: '#F15A24',
		description: 'We paint walls, ceilings, doors, and trim...',
		details: [
			'We paint walls, ceilings, doors, and trim.',
			'Our process includes covering your floors and furniture, prepping the surfaces so they are smooth, applying the paint evenly, and cleaning up the room completely when done.'
		],
	},
	{
		title: 'Drywall Patching',
		image: drywallPatchingImg,
		icon: Hammer,
		iconColor: '#1E8E3E',
		description: 'We fix nail holes, stress cracks, dents, and water damage...',
		details: [
			'We fix nail holes, stress cracks, dents, and water damage on your walls or ceilings.',
			'We patch, sand, and match the existing wall texture so the repair layout looks seamless once painted.'
		],
	},
	{
		title: 'Accent Walls',
		image: accentWallsImg,
		icon: Palette,
		iconColor: '#040e26',
		description: 'We paint single walls or specific sections of a room with a different color...',
		details: [
			'We paint single walls or specific sections of a room with a different color to create a focal point.',
			'We use precise taping techniques to guarantee perfectly straight, clean lines where the colors meet.'
		],
	},
	{
		title: 'Free Consultation',
		image: freeConsultationImg,
		icon: CalendarCheck,
		iconColor: '#faad14',
		description: 'We visit your home to look at the rooms you want painted...',
		details: [
			'We visit your home to look at the rooms you want painted, look at what repairs are needed, and give you a clear, written price estimate.',
			'There is no obligation to hire us.'
		],
		isConsultation: true,
	},
];

export const ServicesSection = () => {
	const dispatch = useAppDispatch();

	const handleCardClick = (service: Service) => {
		dispatch(openServiceModal(service));
	};

	return (
		<section className={styles.servicesSection}>
			{/* Animation Layer */}
			<div className={styles.animationContainer}>
				<svg className={styles.paintedLinesSvg} width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
					<filter id="brush-bristles-bg" x="-20%" y="-20%" width="140%" height="140%">
						<feTurbulence type="fractalNoise" baseFrequency="0.04 0.8" numOctaves="3" result="noise" />
						<feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
						<feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -1.5" result="holes" />
						<feComposite in="displaced" in2="holes" operator="out" />
					</filter>
					<g filter="url(#brush-bristles-bg)" stroke="#f15a24" fill="none" strokeLinecap="square">
						{/* Top to Bottom Diagonal */}
						<path className={styles.path1} d="M -100 -100 Q 800 500 2000 1200" strokeWidth="80" />
						{/* Left to Right Wavy */}
						<path className={styles.path2} d="M -200 400 C 500 200, 1400 800, 2100 300" strokeWidth="120" />
						{/* Bottom Left to Top Right */}
						<path className={styles.path3} d="M -100 1200 Q 1000 400 2000 -100" strokeWidth="50" />
					</g>
				</svg>
			</div>

			<div className={styles.servicesSectionHeader}>
				<h2 className={styles.servicesSectionTitle}>
					Our Services
				</h2>
				<span className={styles.servicesSectionSubtitle}>What We Provide</span>
			</div>

			<div className={styles.servicesSectionGrid}>
				{servicesData.map((service, index) => (
					<ServiceCard
						key={service.title}
						icon={service.icon}
						iconColor={service.iconColor}
						title={service.title}
						description={service.description}
						align={index % 2 === 0 ? 'left' : 'right'}
						onClick={() => handleCardClick(service)}
					/>
				))}
			</div>
		</section>
	);
};
