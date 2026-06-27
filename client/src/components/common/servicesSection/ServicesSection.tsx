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
