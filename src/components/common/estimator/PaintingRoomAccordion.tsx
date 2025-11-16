import React, { useState } from 'react';
import type { PaintingRoom } from './EstimatorTypes';
import { PaintingRoomDetails } from './PaintingRoomDetails';
// You'll need an icon, let's use ChevronDown
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
	room: PaintingRoom;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomScopeChange: (roomId: string, field: string, value: boolean) => void;
}

export const PaintingRoomAccordion: React.FC<AccordionProps> = ({
	room,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(true); // Default to open

	// Check if the room has the essential details
	const hasDetails =
		room.dimensions.length &&
		room.dimensions.width &&
		(room.scope.walls ||
			room.scope.ceiling ||
			room.scope.trim ||
			room.scope.doors);

	return (
		<div className='accordion-item'>
			<button
				type='button'
				className={`accordion-header ${isOpen ? 'open' : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className='accordion-title'>{room.name}</span>
				<div className='accordion-status'>
					{hasDetails && (
						<span className='details-complete-badge'>✔ Details Added</span>
					)}
					<ChevronDown
						size={20}
						className='accordion-icon'
					/>
				</div>
			</button>
			{isOpen && (
				<div className='accordion-content'>
					<PaintingRoomDetails
						room={room}
						{...props}
					/>
				</div>
			)}
		</div>
	);
};
