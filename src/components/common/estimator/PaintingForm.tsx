import React, { useMemo } from 'react';
import type { FormData, PaintingRoom } from './EstimatorTypes';
import { PaintingRoomDetails } from './PaintingRoomDetails';

interface PaintingFormProps {
	formData: FormData;
	onNestedChange: (
		path: 'painting' | 'patching' | 'installation',
		field: string,
		value: any,
	) => void;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomScopeChange: (roomId: string, field: string, value: boolean) => void;
	onRoomCountChange: (roomType: 'bedroom' | 'bathroom', count: number) => void;
}

export const PaintingForm: React.FC<PaintingFormProps> = ({
	formData,
	onNestedChange,
	onRoomChange,
	onRoomScopeChange,
	onRoomCountChange,
}) => {
	const { spaces } = formData.painting;

	const handleSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onNestedChange('painting', 'spaces', {
			...spaces,
			[e.target.name]: e.target.checked,
		});
	};

	// Memoize the list of rooms to prevent re-renders
	const roomsToDisplay = useMemo(() => {
		return formData.painting.rooms;
	}, [formData.painting.rooms]);

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Interior Painting</h3>
			<div className='form-group'>
				<label>What spaces are we painting?</label>
				<div className='checkbox-group horizontal wrap'>
					{[
						{ name: 'livingRoom', label: 'Living Room' },
						{ name: 'kitchen', label: 'Kitchen' },
						{ name: 'hallway', label: 'Hallway' },
						{ name: 'stairwell', label: 'Stairwell' },
						{ name: 'closets', label: 'Closets' },
					].map((room) => (
						<label
							key={room.name}
							className='checkbox-label'
						>
							<input
								type='checkbox'
								name={room.name}
								checked={spaces[room.name as keyof typeof spaces]}
								onChange={handleSpacesChange}
							/>
							{room.label}
						</label>
					))}
				</div>
				<div className='input-group horizontal'>
					<label>Bedrooms:</label>
					<input
						type='number'
						min='0'
						className='small-input'
						value={spaces.bedroomCount}
						onChange={(e) =>
							onRoomCountChange('bedroom', parseInt(e.target.value) || 0)
						}
					/>
					<label>Bathrooms:</label>
					<input
						type='number'
						min='0'
						className='small-input'
						value={spaces.bathroomCount}
						onChange={(e) =>
							onRoomCountChange('bathroom', parseInt(e.target.value) || 0)
						}
					/>
				</div>
			</div>

			{/* --- Dynamic Room Details --- */}
			{roomsToDisplay.length > 0 && (
				<div className='form-group'>
					<label>Room Details</label>
					<div className='room-details-container'>
						{roomsToDisplay.map((room) => (
							<PaintingRoomDetails
								key={room.id}
								room={room}
								onRoomChange={onRoomChange}
								onRoomScopeChange={onRoomScopeChange}
							/>
						))}
					</div>
				</div>
			)}

			<div className='form-group'>
				<label>Furniture</label>
				<select
					name='furniture'
					value={formData.painting.rooms[0]?.furniture || 'Empty'}
					onChange={(e) =>
						formData.painting.rooms.forEach((room) =>
							onRoomChange(room.id, 'furniture', e.target.value),
						)
					}
				>
					<option value='Empty'>Room will be empty</option>
					<option value='Center'>I will move furniture to center</option>
					<option value='Contractor'>
						I need the contractor to move all furniture
					</option>
				</select>
			</div>

			<div className='form-group'>
				<label>Paint Materials</label>
				<select
					name='materials'
					value={formData.painting.materials}
					onChange={(e) =>
						onNestedChange('painting', 'materials', e.target.value)
					}
				>
					<option value='Customer'>I will provide all paint</option>
					<option value='Standard'>
						Please include paint (standard quality)
					</option>
					<option value='Premium'>Please include paint (premium quality)</option>
				</select>
			</div>

			<div className='form-group'>
				<label>Photo Upload (Required)</label>
				<div className='upload-placeholder'>
					[File Upload Component Here]
					<p>
						Please upload 1-2 photos of each room. This is required for an
						accurate estimate.
					</p>
				</div>
			</div>
		</div>
	);
};