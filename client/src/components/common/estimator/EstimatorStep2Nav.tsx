import React from 'react';
import type { FormData } from './EstimatorTypes';
import { ChevronRight } from 'lucide-react';

// Define the "tasks" to show in the nav
interface NavTask {
	id: string; // 'painting', 'patching', or a room.id
	label: string;
	isRoom: boolean;
}

interface EstimatorStep2NavProps {
	formData: FormData;
	activeDetail: string;
	onSelectDetail: (id: string) => void;
}

export const EstimatorStep2Nav: React.FC<EstimatorStep2NavProps> = ({
	formData,
	activeDetail,
	onSelectDetail,
}) => {
	const tasks: NavTask[] = [];

	// 1. Add the main services
	if (formData.services.painting) {
		tasks.push({ id: 'painting', label: 'Painting Details', isRoom: false });
	}
	if (formData.services.patching) {
		tasks.push({ id: 'patching', label: 'Patching Details', isRoom: false });
	}
	if (formData.services.installation) {
		tasks.push({
			id: 'installation',
			label: 'Installation Details',
			isRoom: false,
		});
	}

	// 2. Add the dynamic rooms, indented
	if (formData.services.painting && formData.painting.rooms.length > 0) {
		formData.painting.rooms.forEach((room) => {
			tasks.push({ id: room.id, label: room.label, isRoom: true });
		});
	}

	return (
		<nav className='step-2-nav'>
			<ul className='step-2-nav-list'>
				{tasks.map((task) => (
					<li key={task.id}>
						<button
							type='button'
							className={`step-2-nav-button ${task.isRoom ? 'is-room' : ''} ${
								activeDetail === task.id ? 'active' : ''
							}`}
							onClick={() => onSelectDetail(task.id)}
						>
							{task.label}
							{activeDetail === task.id && (
								<ChevronRight
									size={20}
									className='chevron'
								/>
							)}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
};
