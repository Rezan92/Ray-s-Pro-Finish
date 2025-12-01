import React, { useState } from 'react';
import type { PaintingRoom } from './EstimatorTypes';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ROOM_SIZE_OPTIONS } from './roomSizeData';

// Define the props it will receive from the form
interface PaintingRoomCardProps {
	room: PaintingRoom;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomRemove?: (roomId: string) => void; // Optional: for multi-rooms
	onRoomAdd?: (type: string) => void; // Optional: for multi-rooms
}

export const PaintingRoomCard: React.FC<PaintingRoomCardProps> = ({
	room,
	onRoomChange,
	onRoomRemove,
	onRoomAdd,
}) => {
	const [isOpen, setIsOpen] = useState(true);

	// --- Local Change Handlers ---
	const handleFieldChange = (
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		onRoomChange(room.id, e.target.name, e.target.value);
	};

	const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		const newSurfaces = { ...room.surfaces, [name]: checked };
		onRoomChange(room.id, 'surfaces', newSurfaces);
	};

	// --- Special Logic for Stairwell ---
	const isStairwell = room.type === 'stairwell';
	const ceilingHeightValue = isStairwell ? '11ft+' : room.ceilingHeight;

	// Get the dynamic size options for the current room type
	const sizeOptions = ROOM_SIZE_OPTIONS[room.type] || [];

	return (
		<div className='form-group-box room-card'>
			{/* --- Card Header --- */}
			<button
				type='button'
				className={`accordion-header ${isOpen ? 'open' : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className='accordion-title'>{room.label}</span>
				<div className='accordion-actions'>
					{/* Show remove button if this is a multi-room (e.g., Bedroom 2) */}
					{onRoomRemove && (
						<button
							type='button'
							className='btn-remove'
							onClick={(e) => {
								e.stopPropagation(); // Don't trigger collapse
								onRoomRemove(room.id);
							}}
						>
							<Trash2 size={16} /> Remove
						</button>
					)}
					<ChevronDown
						size={20}
						className='accordion-icon'
					/>
				</div>
			</button>

			{/* --- Collapsible Card Body --- */}
			{isOpen && (
				<div className='accordion-content'>
					<div className='form-group-grid'>
						<div className='form-group'>
							<label>Approximate Size</label>
							<select
								name='size'
								value={room.size}
								onChange={handleFieldChange}
							>
								{sizeOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<div className='form-group'>
							<label>Ceiling Height</label>
							<select
								name='ceilingHeight'
								value={ceilingHeightValue}
								onChange={handleFieldChange}
								disabled={isStairwell}
							>
								<option value='8ft'>8 ft (Standard)</option>
								<option value='9-10ft'>9-10 ft</option>
								<option value='11ft+'>11 ft+ / Vaulted</option>
							</select>
						</div>
					</div>

					<div className='form-group'>
						<label>Surfaces to Paint</label>
						<div className='checkbox-group horizontal'>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									name='walls'
									checked={room.surfaces.walls}
									onChange={handleSurfaceChange}
								/>
								Walls
							</label>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									name='ceiling'
									checked={room.surfaces.ceiling}
									onChange={handleSurfaceChange}
								/>
								Ceiling
							</label>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									name='trim'
									checked={room.surfaces.trim}
									onChange={handleSurfaceChange}
								/>
								Trim
							</label>
							<label className='checkbox-label'>
								<input
									type='checkbox'
									name='doors'
									checked={room.surfaces.doors}
									onChange={handleSurfaceChange}
								/>
								Doors
							</label>
						</div>
					</div>

					{/* --- Conditional Fields --- */}
					<div className='conditional-fields-container'>
						{room.surfaces.ceiling && (
							<div className='form-group'>
								<label>Ceiling Texture</label>
								<select
									name='ceilingTexture'
									value={room.ceilingTexture || 'Flat'}
									onChange={handleFieldChange}
								>
									<option value='Flat'>Flat/Smooth</option>
									<option value='Textured'>Textured</option>
									<option value='Popcorn'>Popcorn</option>
								</select>
							</div>
						)}
						{room.surfaces.trim && (
							<div className='form-group'>
								<label>Trim Condition</label>
								<select
									name='trimCondition'
									value={room.trimCondition || 'Good'}
									onChange={handleFieldChange}
								>
									<option value='Good'>Good (Just needs paint)</option>
									<option value='Poor'>Poor (Needs re-caulking)</option>
								</select>
							</div>
						)}
						{room.surfaces.doors && (
							<>
								<div className='form-group'>
									<label>How many doors?</label>
									<input
										type='number'
										name='doorCount'
										className='small-input'
										min='0'
										value={room.doorCount || '1'}
										onChange={handleFieldChange}
									/>
								</div>
								<div className='form-group'>
									<label>Door Style</label>
									<select
										name='doorStyle'
										value={room.doorStyle || 'Slab'}
										onChange={handleFieldChange}
									>
										<option value='Slab'>Flat / Slab</option>
										<option value='Paneled'>Paneled (e.g., 6-panel)</option>
									</select>
								</div>
							</>
						)}
					</div>

					{/* --- Bottom Row of Card --- */}
					<div className='form-group-grid'>
						<div className='form-group'>
							<label>Surface Condition</label>
							<select
								name='wallCondition'
								value={room.wallCondition}
								onChange={handleFieldChange}
							>
								<option value='Good'>Good (Few nail holes)</option>
								<option value='Fair'>Fair (Dings, scuffs)</option>
								<option value='Poor'>Poor (Cracks, stains)</option>
							</select>
						</div>
						<div className='form-group'>
							<label>Color Change</label>
							<select
								name='colorChange'
								value={room.colorChange}
								onChange={handleFieldChange}
							>
								<option value='Similar'>Similar Color</option>
								<option value='Light-to-Dark'>Light-to-Dark</option>
								<option value='Dark-to-Light'>Dark-to-Light</option>
							</select>
						</div>
					</div>

					{/* --- Add Another Button --- */}
					{onRoomAdd && (
						<button
							type='button'
							className='btn-add-room'
							onClick={() => onRoomAdd(room.type)}
						>
							<Plus size={16} /> Add another {room.type}
						</button>
					)}
				</div>
			)}
		</div>
	);
};
