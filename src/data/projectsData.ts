import type { Project } from '@/components/common/projectCard/ProjectCard';
import basementFinishingImage from '@/assets/projectsImages/BasementFinish.png';
import CeilingDamageImage from '@/assets/projectsImages/CeilingDamage.png';
import DrywallPatchingImage from '@/assets/projectsImages/DrywallPatching.png';
import GarageFinishingImage from '@/assets/projectsImages/GarageFinishing.png';
import LivingroomFinishImage from '@/assets/projectsImages/LivingroomFinish.png';
// import AccentWallImage from '@/assets/projectsImages/AccentWall.png';

// This is now the SINGLE SOURCE OF TRUTH for all projects
export const projectsData: Project[] = [
	{
		id: 1,
		image: GarageFinishingImage,
		tag: 'Drywall Finishing',
		title: 'Two-Car Garage Finishing',
		location: 'Lombard, IL',
		details:
			'This new-construction garage had unfinished drywall. We came in to professionally tape all seams, apply three coats of mud, and sand everything perfectly smooth, making it ready for primer and paint.',
	},
	{
		id: 2,
		image: basementFinishingImage,
		tag: 'Install & Paint',
		title: 'Basement Remodel Finishing',
		location: 'Wheaton, IL',
		details:
			'We handled the complete finishing for this new basement. Our team installed all the drywall, finished it to a level-5 smooth finish, and then painted the walls, ceiling, and trim for a bright, move-in-ready space.',
	},
	{
		id: 3,
		image: LivingroomFinishImage,
		tag: 'Interior Painting',
		title: 'Modern Living Room Repaint',
		location: 'Glen Ellyn, IL',
		details:
			'The client wanted to update their main living area. We prepped all surfaces, patched minor scuffs, and gave the walls and trim a fresh, modern coat of paint. Notice the clean, sharp lines along the ceiling!',
	},
	{
		id: 4,
		image: DrywallPatchingImage,
		tag: 'Drywall Repair',
		title: 'Nail Hole & Anchor Patching',
		location: 'Wheaton, IL',
		details:
			'After removing shelves and art, this client had dozens of nail holes and large drywall anchors. We meticulously patched every spot and blended the texture so the walls looked brand new and were ready for paint.',
	},
	{
		id: 5,
		image: CeilingDamageImage,
		tag: 'Ceiling Repair',
		title: 'Kitchen Ceiling Water Damage',
		location: 'Carol Stream, IL',
		details:
			'A leak left an ugly stain and bubbling paint on this kitchen ceiling. We cut out the damaged drywall, patched it, expertly matched the existing texture, and painted it to look like the damage never even happened.',
	},
	{
		id: 6,
		image: 'https://placehold.co/600x400/5f8a7a/ffffff?text=Accent+Wall',
		tag: 'Detail Painting',
		title: 'Master Bedroom Accent Wall',
		location: 'Lombard, IL',
		details:
			'To create a modern focal point, we painted this dark accent wall. This precision work requires perfectly straight and sharp lines, along with a fresh coat on the baseboards and trim for a high-end, professional look.',
	},
];
