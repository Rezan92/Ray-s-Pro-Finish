import React, { useMemo } from 'react';
import type { FormData, PaintingRoom } from './EstimatorTypes';
import { PaintingRoomCard } from './PaintingRoomCard';

// Define the props it will receive from EstimatorPage
interface PaintingFormProps {
	formData: FormData;
	onRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomAdd: (type: string) => void;
	onRoomRemove: (roomId: string) => void;
	onGlobalChange: (field: string, value: string) => void;
}

// Define our room types and labels
const ROOM_TYPES = [
	{ key: 'livingRoom', label: 'Living Room' },
	{ key: 'diningRoom', label: 'Dining Room' },
	{ key: 'kitchen', label: 'Kitchen' },
	{ key: 'bedroom', label: 'Bedroom' },
	{ key: 'bathroom', label: 'Bathroom' },
	{ key: 'office', label: 'Office / Study' },
	{ key: 'basement', label: 'Basement' },
	{ key: 'hallway', label: 'Hallway' },
	{ key: 'stairwell', label: 'Stairwell' },
	{ key: 'laundryRoom', label: 'Laundry Room' },
	{ key: 'garage', label: 'Garage' },
	{ key: 'closet', label: 'Closet' },
	{ key: 'other', label: 'Other' },
];

// Helper to determine if a room type is multi-room
const isMultiRoom = (type: string) => type === 'bedroom' || type === 'bathroom';

export const PaintingForm: React.FC<PaintingFormProps> = ({
	formData,
	onRoomTypeToggle,
	onRoomChange,
	onRoomAdd,
	onRoomRemove,
	onGlobalChange,
}) => {
	const { painting } = formData;

	// Create a map of which room types are checked
	const checkedTypes = useMemo(() => {
		const typeMap = new Map<string, boolean>();
		painting.rooms.forEach((room) => {
			typeMap.set(room.type, true);
		});
		return typeMap;
	}, [painting.rooms]);

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Interior Painting</h3>

			{/* --- A. The Room Builder --- */}
			<div className='form-group-box'>
				<div className='form-group'>
					<label>Please add the spaces you'd like us to paint.</label>
					<div className='checkbox-group horizontal wrap'>
						{ROOM_TYPES.map((type) => {
							const isChecked = checkedTypes.get(type.key) || false;
							return (
								<label
									key={type.key}
									className='checkbox-label'
								>
									<input
										type='checkbox'
										checked={isChecked}
										onChange={(e) =>
											onRoomTypeToggle(type.key, e.target.checked)
										}
									/>
									{type.label}
								</label>
							);
						})}
					</div>
				</div>
			</div>

			{/* --- B. The Generated Room Cards --- */}
			{painting.rooms.map((room) => {
				const multi = isMultiRoom(room.type);
				return (
					<PaintingRoomCard
						key={room.id}
						room={room}
						onRoomChange={onRoomChange}
						// Only pass Add/Remove handlers if it's a multi-room type
						onRoomAdd={multi && room.id.endsWith('_0') ? onRoomAdd : undefined}
						// Only show "Remove" if it's NOT the first of its type
						onRoomRemove={
							multi && !room.id.endsWith('_0') ? onRoomRemove : undefined
						}
					/>
				);
			})}

			{/* --- C. Global Painting Questions --- */}
			<div className='form-group-box global-questions'>
				<div className='form-group'>
					<label>Who will provide the paint?</label>
					<select
						name='paintProvider'
						value={painting.paintProvider}
						onChange={(e) => onGlobalChange('paintProvider', e.target.value)}
					>
						<option value=''>Please select...</option>
						<option value='Customer'>I will provide all paint</option>
						<option value='Standard'>
							Please include standard quality paint
						</option>
						<option value='Premium'>
							Please include premium quality paint
						</option>
					</select>
				</div>
				<div className='form-group'>
					<label>What about furniture?</label>
					<select
						name='furniture'
						value={painting.furniture}
						onChange={(e) => onGlobalChange('furniture', e.target.value)}
					>
						<option value=''>Please select...</option>
						<option value='Empty'>The home will be empty</option>
						<option value='Customer'>
							I will move and cover all my furniture
						</option>
						<option value='Contractor'>
							I need the painter to move and cover furniture
						</option>
					</select>
				</div>
			</div>
		</div>
	);
};
